# backend/app/services/chat_service.py
import requests
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from ..core.config import settings
from ..models.detection import Detection
from ..models.chat import ChatMessage
from ..models.user import User
import logging

logger = logging.getLogger(__name__)

class ChatService:
    """Service for handling patient chatbot interactions via Google Gemini 1.5 Flash"""
    
    # Medical safety keywords that should block the query
    BLOCKED_KEYWORDS = [
        "medicine", "medication", "drug", "prescription", "prescribe",
        "dosage", "dose", "treatment", "cure", "heal", "therapy",
        "diagnose", "diagnosis", "confirm", "disease", "illness",
        "antibiotic", "painkiller", "remedy", "surgery"
    ]
    
    SAFE_REFUSAL = (
        "I can only help explain your dental scan results in simple terms. "
        "For medical advice, treatment recommendations, or prescriptions, "
        "please consult your dentist directly. They are the best resource "
        "for your dental health needs."
    )
    
    DISCLAIMER = (
        "\n\n⚠️ **Important**: This is AI-generated information based on your scan results. "
        "It does not replace professional dental evaluation. "
        "Please consult your dentist for diagnosis and treatment."
    )
    
    @staticmethod
    def is_safe_query(message: str) -> bool:
        """Check if the query is safe (doesn't contain medical advice keywords)"""
        message_lower = message.lower()
        return not any(keyword in message_lower for keyword in ChatService.BLOCKED_KEYWORDS)
    
    @staticmethod
    def get_latest_detection(db: Session, user_id: str) -> Optional[Detection]:
        """Get the latest detection for the user"""
        return db.query(Detection).join(
            User, Detection.patient.has(user_id=user_id)
        ).order_by(Detection.detection_date.desc()).first()
    
    @staticmethod
    def build_prompt(user_message: str, detection: Optional[Detection] = None) -> str:
        """Build a safe prompt for Gemini with detection context"""
        
        system_instruction = (
            "You are a helpful dental health assistant for patients. "
            "Your role is to explain AI dental scan results in simple, easy-to-understand language. "
            "You NEVER diagnose diseases, prescribe medications, or give medical advice. "
            "You help patients understand what their scan results mean and what steps to take next. "
            "Always be supportive and encouraging. "
            "Keep responses concise (2-3 sentences maximum)."
        )
        
        context = ""
        if detection:
            # Calculate average confidence
            avg_confidence = 0
            if detection.caries_findings:
                confidences = [f.confidence_score for f in detection.caries_findings if f.confidence_score]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Get severity distribution
            severity_counts = {"mild": 0, "moderate": 0, "severe": 0}
            if detection.caries_findings:
                for finding in detection.caries_findings:
                    if finding.severity:
                        severity_level = finding.severity.value.lower()
                        if severity_level in severity_counts:
                            severity_counts[severity_level] += 1
            
            context = f"""
Patient's Latest Dental Scan Results:
- Total caries detected: {detection.total_caries_detected}
- Severity breakdown: {severity_counts['mild']} mild, {severity_counts['moderate']} moderate, {severity_counts['severe']} severe
- Average AI confidence: {avg_confidence:.1f}%
- Scan date: {detection.detection_date.strftime('%B %d, %Y')}
"""
        
        prompt = f"""{system_instruction}

{context}

Patient Question: {user_message}

Provide a helpful, simple explanation. End with encouraging them to see their dentist."""
        
        return prompt
    
    @staticmethod
    def call_gemini_api(prompt: str) -> str:
        """Call Google Gemini API via REST for maximum reliability"""
        
        if not settings.GOOGLE_API_KEY:
            logger.error("GOOGLE_API_KEY not configured")
            return "The diagnostic chatbot is currently resting. Please check your configuration."
        
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.75,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 300,
                "stopSequences": []
            }
        }
        
        try:
            logger.info(f"Calling Google Gemini API: {settings.GOOGLE_MODEL}")
            
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"Gemini API error ({response.status_code}): {response.text}")
                return "I'm currently unable to respond due to a service interruption. Please try again later."
            
            result = response.json()
            
            # Navigate Gemini response structure
            try:
                candidates = result.get("candidates", [])
                if candidates:
                    content = candidates[0].get("content", {})
                    parts = content.get("parts", [])
                    if parts:
                        generated_text = parts[0].get("text", "")
                        if generated_text:
                            return generated_text.strip()
            except Exception as e:
                logger.error(f"Failed to parse Gemini response: {str(e)}")
            
            logger.warning(f"Unexpected response format from Gemini: {result}")
            return "I'm having trouble generating a response. Please try again."
            
        except requests.exceptions.Timeout:
            logger.error("Gemini API timeout")
            return "The response is taking longer than expected. Please try again."
        except requests.exceptions.RequestException as e:
            logger.error(f"Gemini API request error: {str(e)}")
            return "I'm currently unable to connect to the AI service. Please try again later."
        except Exception as e:
            logger.error(f"Unexpected error in Gemini API call: {str(e)}")
            return "An unexpected error occurred. Please try again."
    
    @staticmethod
    def generate_response(
        db: Session,
        user_id: str,
        user_message: str,
        detection_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate chatbot response with safety checks using Gemini"""
        
        # Safety check
        if not ChatService.is_safe_query(user_message):
            return {
                "bot_response": ChatService.SAFE_REFUSAL,
                "is_safe": False,
                "detection_context": None
            }
        
        # Get detection context
        detection = None
        if detection_id:
            detection = db.query(Detection).filter(Detection.id == detection_id).first()
        else:
            detection = ChatService.get_latest_detection(db, user_id)
        
        # Build prompt
        prompt = ChatService.build_prompt(user_message, detection)
        
        # Call Gemini API
        bot_response = ChatService.call_gemini_api(prompt)
        
        # Add disclaimer
        bot_response_with_disclaimer = bot_response + ChatService.DISCLAIMER
        
        # Prepare detection context for response
        detection_context = None
        if detection:
            avg_confidence = 0
            if detection.caries_findings:
                confidences = [f.confidence_score for f in detection.caries_findings if f.confidence_score]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Get primary severity
            severity = None
            if detection.caries_findings:
                severity_counts = {}
                for finding in detection.caries_findings:
                    if finding.severity:
                        sev = finding.severity.value
                        severity_counts[sev] = severity_counts.get(sev, 0) + 1
                if severity_counts:
                    severity = max(severity_counts, key=severity_counts.get)
            
            detection_context = {
                "detection_id": str(detection.id),
                "severity": severity,
                "total_caries": detection.total_caries_detected,
                "confidence_avg": round(avg_confidence, 1)
            }
        
        return {
            "bot_response": bot_response_with_disclaimer,
            "is_safe": True,
            "detection_context": detection_context
        }
    
    @staticmethod
    def save_chat_message(
        db: Session,
        user_id: str,
        detection_id: Optional[str],
        user_message: str,
        bot_response: str
    ) -> ChatMessage:
        """Save chat message to database"""
        
        chat_message = ChatMessage(
            user_id=user_id,
            detection_id=detection_id,
            user_message=user_message,
            bot_response=bot_response
        )
        
        db.add(chat_message)
        db.commit()
        db.refresh(chat_message)
        
        return chat_message
