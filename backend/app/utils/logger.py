import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def log_detection(detection_id: str, patient_id: str, status: str):
    """Log detection event"""
    logger.info(f"Detection {detection_id} for patient {patient_id}: {status}")

def log_error(error: Exception, context: str = ""):
    """Log error"""
    logger.error(f"Error in {context}: {str(error)}", exc_info=True)