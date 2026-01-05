from sqlalchemy.orm import Session
from models.user import User
from utils.security import hash_password
from models.database import SessionLocal

def seed_default_admin():
    db: Session = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if not existing_admin:
            admin_user = User(
                username="admin",
                email="admin@supporthub.com",
                hashed_password=hash_password("admin123"),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("✅ Default admin user created: username='admin', password='admin123'")
        else:
            print("ℹ️  Admin user already exists")
    except Exception as e:
        print(f"⚠️  Error seeding admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_default_admin()