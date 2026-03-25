import os
import sys

from app.services.cloudinary_service import CloudinaryService

svc = CloudinaryService()

test_file = "/home/user/Documents/trust-hire/dental-caries/dental-caries-detection/backend/results/07ebe9fc-a861-453f-a1a7-6bbfe98a9bc3/detection/0257e550-4f50-4f7d-a7cc-d7d5333dadaf.jpg"
print(f"File exists: {os.path.exists(test_file)}")

try:
    result = svc.upload_annotated_image(test_file)
    print(f"Upload SUCCESS: {result}")
except Exception as e:
    print(f"Upload FAILED: {e}")
