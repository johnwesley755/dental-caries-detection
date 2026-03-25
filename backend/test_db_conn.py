import sys
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

passwords_to_try = [
    "postgres",
    "password",
    "admin",
    "root",
    "12345678",
    "1234567890",
    "dental_user"
]

def check_connection():
    for pwd in passwords_to_try:
        url = f"postgresql://dental_user:{pwd}@localhost:5432/postgres"
        engine = create_engine(url)
        try:
            with engine.connect():
                print(f"SUCCESS! Password is: {pwd}")
                return pwd
        except OperationalError:
            pass
            
    print("Failed to guess password.")
    return None

if __name__ == "__main__":
    check_connection()
