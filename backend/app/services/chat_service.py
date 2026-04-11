# backend/app/services/chat_service.py
import requests
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from ..core.config import settings
from ..models.detection import Detection
from ..models.chat import ChatMessage
from ..models.user import User
import logging
import re

logger = logging.getLogger(__name__)

class ChatService:
    """Service for handling patient chatbot interactions via Groq (Primary)"""
    
    # Tier 1: Medical safety (prevention of diagnosis/prescription)
    MEDICAL_FORBIDDEN = [
        "medicine", "medication", "drug", "prescription", "prescribe",
        "dosage", "dose", "treatment", "cure", "heal", "therapy",
        "diagnose", "diagnosis", "confirm", "disease", "illness",
        "antibiotic", "painkiller", "remedy", "surgery", "operation"
    ]

    # Tier 2: Profanity & Harmful Content (Baseline list)
    PROFANITY_LIST = [
        "fuck", "shit", "ass", "bitch", "bastard", "damn", "hell",
        "kill", "death", "die", "murder", "suicide", "hate", "scam",
        "fraud", "hack", "abuse"
    ]

    # Tier 3: Domain Verification Roots
    DENTAL_ROOTS = [
        "tooth", "teeth", "caries", "cavity", "decay", "gum", "dentist",
        "scan", "result", "doctor", "mouth", "pain", "ache", "molar",
        "incisor", "enamel", "pulp", "filling", "cleaning", "checkup"
    ]
    
    SAFE_REFUSAL = (
        "I can only help explain your dental scan results in simple terms. "
        "For medical advice, treatment recommendations, or prescriptions, "
        "please consult your dentist directly. They are the best resource "
        "for your dental health needs."
    )

    DOMAIN_REFUSAL = (
        "I am specialized only in dental health and scan diagnostics. "
        "I cannot assist with general topics or unrelated queries. "
        "Please ask me about your dental scan results or oral hygiene."
    )

    SAFETY_REFUSAL = (
        "I am unable to process your request as it violates our safety and "
        "professional conduct guidelines. Please keep the conversation professional "
        "and focused on dental health."
    )
    
    DISCLAIMER = (
        "\n\n⚠️ **Important**: This is AI-generated information based on your scan results. "
        "It does not replace professional dental evaluation. "
        "Please consult your dentist for diagnosis and treatment."
    )
    
    @staticmethod
    def is_safe_query(message: str) -> bool:
        """Check if the query is safe from harmful content and medical advice requests"""
        message_lower = message.lower()
        
        # Check for profanity first
        if any(keyword in message_lower for keyword in ChatService.PROFANITY_LIST):
            logger.warning(f"Profanity detected in user message: {message}")
            return False
            
        # Check for medical diagnosis/prescription requests
        if any(keyword in message_lower for keyword in ChatService.MEDICAL_FORBIDDEN):
            logger.warning(f"Medical advice request detected: {message}")
            return False
            
        return True

    @staticmethod
    def is_dental_domain(message: str) -> bool:
        """Check if the query is relevant to dentistry/caries"""
        message_lower = message.lower()
        
        # If it's a very short greeting/acknowledgment, allow it
        if len(message_lower.split()) <= 2 and any(g in message_lower for g in ["hi", "hello", "thanks", "ok"]):
            return True
            
        return any(root in message_lower for root in ChatService.DENTAL_ROOTS)
    
    @staticmethod
    def get_latest_detection(db: Session, user_id: str) -> Optional[Detection]:
        """Get the latest detection for the user"""
        return db.query(Detection).join(
            User, Detection.patient.has(user_id=user_id)
        ).order_by(Detection.detection_date.desc()).first()
    
    @staticmethod
    def get_chat_messages(user_message: str, detection: Optional[Detection] = None) -> List[Dict[str, str]]:
        """Prepare structured messages for the Chat Completion protocol"""
        
        system_instruction = (
            "You are a highly specialized dental health assistant. "
            "STRICT MANDATE: Only discuss dental caries (cavities), oral hygiene, and the provided scan results. "
            "If the user asks about ANY unrelated topic (politics, weather, general science, etc.), "
            "politely state that you are only capable of discussing dental health. "
            "You NEVER prescribe medications, diagnose specific diseases beyond explaining the AI findings, "
            "or recommend specific medical procedures. "
            "Your tone must be clinical, supportive, and professional. "
            "Keep responses extremely concise (Max 2-3 sentences)."
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
                        severity_level = finding.severity.lower()
                        if severity_level in severity_counts:
                            severity_counts[severity_level] += 1
            
            context = f"""
Patient's Latest Dental Scan Results (STRICT CONTEXT):
- Total caries detected: {detection.total_caries_detected}
- Severity breakdown: {severity_counts['mild']} mild, {severity_counts['moderate']} moderate, {severity_counts['severe']} severe
- Average AI confidence: {avg_confidence:.1f}%
- Scan date: {detection.detection_date.strftime('%B %d, %Y')}
"""
        
        messages = [
            {"role": "system", "content": system_instruction},
        ]
        
        if context:
            messages.append({"role": "system", "content": f"Context: {context}"})
            
        messages.append({"role": "user", "content": user_message})
        
        return messages
    
    @staticmethod
    def call_groq_api(messages: List[Dict[str, str]]) -> str:
        """Call Groq API (OpenAI compatible) for Chat Completions"""
        
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "ENTER_YOUR_NEW_GROQ_KEY_HERE":
            logger.error("GROQ_API_KEY not configured")
            return "The diagnostic chatbot is currently resting. Please check your configuration."
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": messages,
            "max_tokens": 250,
            "temperature": 0.3, # Lowered for more deterministic/professional responses
            "stream": False
        }
        
        try:
            logger.info(f"Calling Groq API: {settings.GROQ_MODEL}")
            
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"Groq API error ({response.status_code}): {response.text}")
                return "I'm currently unable to respond due to a service interruption. Please try again later."
            
            result = response.json()
            
            try:
                choices = result.get("choices", [])
                if choices:
                    message_content = choices[0].get("message", {}).get("content", "")
                    if message_content:
                        return message_content.strip()
            except Exception as e:
                logger.error(f"Failed to parse Groq response: {str(e)}")
            
            return "I'm having trouble generating a response. Please try again."
            
        except Exception as e:
            logger.error(f"Unexpected error in Groq API call: {str(e)}")
            return "An unexpected error occurred. Please try again."
    
    @staticmethod
    def generate_response(
        db: Session,
        user_id: str,
        user_message: str,
        detection_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate chatbot response with multi-tier safety and domain checks"""
        
        # 1. Profanity & Medical Advice safety check
        if not ChatService.is_safe_query(user_message):
            message_lower = user_message.lower()
            refusal = ChatService.SAFETY_REFUSAL if any(k in message_lower for k in ChatService.PROFANITY_LIST) else ChatService.SAFE_REFUSAL
            return {
                "bot_response": refusal,
                "is_safe": False,
                "detection_context": None
            }
            
        # 2. Domain Relevance Check
        if not ChatService.is_dental_domain(user_message):
            return {
                "bot_response": ChatService.DOMAIN_REFUSAL,
                "is_safe": False,
                "detection_context": None
            }
        
        # Get detection context
        detection = None
        if detection_id:
            detection = db.query(Detection).filter(Detection.id == detection_id).first()
        else:
            detection = ChatService.get_latest_detection(db, user_id)
        
        # Build messages for Chat Completion protocol
        messages = ChatService.get_chat_messages(user_message, detection)
        
        # Call Groq API
        bot_response = ChatService.call_groq_api(messages)
        
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
                        sev = finding.severity
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
