import sys
import os

# Add the current directory to sys.path to allow importing from 'app'
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password

def create_admin():
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")
    
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"Error: User with email {email} already exists.")
            return

        # Create new admin user
        admin_user = User(
            email=email,
            hashed_password=hash_password(password),
            role=UserRole.admin
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f"Successfully created admin user: {email}")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
