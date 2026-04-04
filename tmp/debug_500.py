import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.api.v1.admin import list_pending_dentists
import asyncio

async def test_endpoint():
    db = SessionLocal()
    try:
        # Mock current_user (must be admin)
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not admin:
            print("No admin user found in database to test with.")
            return

        print(f"Testing list_pending_dentists with admin: {admin.email}")
        
        # Call the endpoint function directly
        result = await list_pending_dentists(db=db, current_user=admin)
        print("Success! Result:")
        print(result)
        
    except Exception as e:
        print("\n--- ERROR TRACEBACK ---")
        import traceback
        traceback.print_exc()
        print("--- END ERROR ---\n")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_endpoint())
