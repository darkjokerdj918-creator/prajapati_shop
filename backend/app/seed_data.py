"""
Seed the database. Set PRODUCTS to empty to allow the user to insert real products.
"""
from app.core.database import SessionLocal, create_tables

PRODUCTS = []


def seed():
    from app.models.product import Product
    from app.models.admin import Admin
    from app.core.security import hash_password
    create_tables()
    db = SessionLocal()
    try:
        # Seed default admin user if not exists
        admin = db.query(Admin).filter(Admin.email == "admin@prajapatistore.com").first()
        if not admin:
            hashed = hash_password("admin123")
            admin_user = Admin(
                full_name="Store Admin",
                email="admin@prajapatistore.com",
                hashed_password=hashed
            )
            db.add(admin_user)
            db.commit()
            print("[Success] Seeded default admin user: admin@prajapatistore.com / admin123")

        existing = db.query(Product).count()
        if existing > 0:
            print(f"[Info] Database already seeded with {existing} products. Skipping.")
            return
        for data in PRODUCTS:
            db.add(Product(**data))
        db.commit()
        print(f"[Success] Seeded {len(PRODUCTS)} products into the database.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
