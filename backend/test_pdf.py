import requests
import json

# Setup
BASE_URL = "http://localhost:8000/api/v1"
DETECTION_ID = "ad02775d-a0ad-47ad-b224-e9f714ce2a8c"

# Get a token if needed (assuming user is logged in or I have access)
# Since I'm testing locally, I'll try to find a valid token or skip auth if possible
# BUT the endpoint has Depends(get_current_user)

def test_pdf_gen():
    # I'll try to get the detection details first to see if it's there
    resp = requests.get(f"{BASE_URL}/reports/detection/{DETECTION_ID}/pdf")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_pdf_gen()
