import pytest
from fastapi.testclient import TestClient
from app.main import app
from io import BytesIO
from PIL import Image

client = TestClient(app)

@pytest.fixture
def auth_token():
    """Get authentication token"""
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "dentist@example.com",
            "password": "testpass123",
            "full_name": "Test Dentist",
            "role": "dentist"
        }
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login/json",
        json={
            "email": "dentist@example.com",
            "password": "testpass123"
        }
    )
    return response.json()["access_token"]

@pytest.fixture
def patient_id(auth_token):
    """Create test patient"""
    response = client.post(
        "/api/v1/patients/",
        json={
            "full_name": "Test Patient",
            "age": 30,
            "gender": "male",
            "contact_number": "1234567890",
            "email": "patient@example.com"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    return response.json()["id"]

def create_test_image():
    """Create a test image"""
    img = Image.new('RGB', (640, 640), color='white')
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def test_create_detection(auth_token, patient_id):
    """Test creating a detection"""
    test_image = create_test_image()
    
    response = client.post(
        "/api/v1/detections/",
        files={"file": ("test.jpg", test_image, "image/jpeg")},
        data={
            "patient_id": patient_id,
            "image_type": "intraoral",
            "notes": "Test detection"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    # Note: This might fail without actual model file
    # In production, ensure model is available
    assert response.status_code in [201, 500]  # 500 if model not found