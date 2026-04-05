# /tmp/verify_chatbot_safety.py
import sys
import os

# Mocking the essential parts of ChatService for testing logic
class MockChatService:
    MEDICAL_FORBIDDEN = ["medicine", "medication", "drug", "prescription"]
    PROFANITY_LIST = ["fuck", "shit", "abuse"]
    DENTAL_ROOTS = ["tooth", "teeth", "caries", "cavity", "decay"]

    @staticmethod
    def is_safe_query(message: str) -> bool:
        message_lower = message.lower()
        if any(keyword in message_lower for keyword in MockChatService.PROFANITY_LIST):
            return False
        if any(keyword in message_lower for keyword in MockChatService.MEDICAL_FORBIDDEN):
            return False
        return True

    @staticmethod
    def is_dental_domain(message: str) -> bool:
        message_lower = message.lower()
        if len(message_lower.split()) <= 2 and any(g in message_lower for g in ["hi", "hello"]):
            return True
        return any(root in message_lower for root in MockChatService.DENTAL_ROOTS)

def test_safety():
    test_cases = [
        ("How are you today?", False, "Off-topic/General"),
        ("What is the weather in London?", False, "Off-topic/Non-dental"),
        ("I have a toothache, what should I do?", True, "Safe/Dental"),
        ("Tell me about my caries results.", True, "Safe/Dental"),
        ("You are a piece of shit", False, "Unsafe/Profanity"),
        ("Can you prescribe me some antibiotics?", False, "Unsafe/Medical Advice"),
        ("Hello", True, "Safe/Greeting")
    ]

    print("--- Chatbot Safety & Domain Logic Verification ---")
    all_passed = True
    for msg, expected_safe, category in test_cases:
        is_safe = MockChatService.is_safe_query(msg)
        is_dental = MockChatService.is_dental_domain(msg)
        
        # A query is "Allowed" if it's both safe AND dental related
        allowed = is_safe and is_dental
        
        status = "PASS" if allowed == expected_safe else "FAIL"
        if status == "FAIL": all_passed = False
        
        print(f"[{status}] Category: {category:25} | Input: '{msg}' | Allowed: {allowed}")

    if all_passed:
        print("\n✅ All safety logic tests passed!")
    else:
        print("\n❌ Some tests failed. Please review the logic.")

if __name__ == "__main__":
    test_safety()
