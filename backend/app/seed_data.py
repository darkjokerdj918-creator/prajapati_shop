"""
Seed the SQLite database with all product data.
Run once: python -m app.seed_data
"""
from app.core.database import SessionLocal, create_tables

PRODUCTS = [
    # ── Eco-Friendly Ganesha ─────────────────────────────
    {
        "id": "g1",
        "name": "Majestic Ganesha Idol",
        "category": "ganesha",
        "subcat": "Large",
        "price": 1299.0,
        "original_price": 1799.0,
        "rating": 4.9,
        "reviews": 142,
        "badge": "bestseller",
        "image": "images/ganesha1.jpg",
        "emoji": "🪷",
        "description": (
            "A magnificent handcrafted eco-friendly Ganesha idol made from natural terracotta clay. "
            "Adorned with intricate hand-painted floral motifs in traditional Indian style. "
            "100% biodegradable and safe for immersion."
        ),
        "features": "100% Eco-Friendly,Natural Clay,Handcrafted,Biodegradable,Food-safe Colors",
        "stock": 50,
    },
    {
        "id": "g2",
        "name": "Floral Ganesha with Flowers",
        "category": "ganesha",
        "subcat": "Medium",
        "price": 899.0,
        "original_price": 1199.0,
        "rating": 4.8,
        "reviews": 98,
        "badge": "eco",
        "image": "images/ganesha2.jpg",
        "emoji": "🌸",
        "description": (
            "A beautifully decorated Ganesha idol with vibrant natural flower adornments. "
            "Perfect for Ganesh Chaturthi celebrations. 100% biodegradable."
        ),
        "features": "100% Eco-Friendly,Flower Decorated,Festival Ready,Natural Dyes",
        "stock": 80,
    },
    {
        "id": "g3",
        "name": "Heritage Terracotta Ganesha",
        "category": "ganesha",
        "subcat": "Large",
        "price": 1599.0,
        "original_price": 2199.0,
        "rating": 5.0,
        "reviews": 67,
        "badge": "new",
        "image": "images/ganesha3.jpg",
        "emoji": "✨",
        "description": (
            "An heirloom-quality Ganesha statue with intricate carvings and gold accents. "
            "Crafted by master artisans using traditional techniques passed down generations."
        ),
        "features": "Master Crafted,Gold Accents,Heirloom Quality,Eco-Friendly,Certificate of Authenticity",
        "stock": 30,
    },
    {
        "id": "g4",
        "name": "Mini Ganesha Gift Set (3pc)",
        "category": "ganesha",
        "subcat": "Small",
        "price": 599.0,
        "original_price": 799.0,
        "rating": 4.7,
        "reviews": 215,
        "badge": "bestseller",
        "image": None,
        "emoji": "🎁",
        "description": (
            "A charming set of three miniature Ganesha idols in different sizes, "
            "perfect for gifting. Each piece is individually handcrafted and painted."
        ),
        "features": "Set of 3,Gift Ready,Handcrafted,Eco-Friendly,Multiple Sizes",
        "stock": 120,
    },
    {
        "id": "g5",
        "name": "Navaratna Ganesha",
        "category": "ganesha",
        "subcat": "Medium",
        "price": 1099.0,
        "original_price": 1399.0,
        "rating": 4.8,
        "reviews": 56,
        "badge": "new",
        "image": None,
        "emoji": "💎",
        "description": (
            "A resplendent Ganesha idol adorned with nine gemstone-colored clay ornaments "
            "representing the Navaratna tradition. A truly divine collectors piece."
        ),
        "features": "9 Gem Colors,Premium Finish,Eco-Friendly,Collectors Item",
        "stock": 40,
    },
    {
        "id": "g6",
        "name": "Meditation Ganesha",
        "category": "ganesha",
        "subcat": "Small",
        "price": 499.0,
        "original_price": 649.0,
        "rating": 4.9,
        "reviews": 189,
        "badge": "eco",
        "image": None,
        "emoji": "🧘",
        "description": (
            "A serene Ganesha in meditation pose, crafted from pure clay with "
            "minimalist natural finish. Ideal for home shrines and meditation spaces."
        ),
        "features": "Meditation Pose,Natural Finish,Eco-Friendly,Compact Size",
        "stock": 90,
    },
    # ── Household Items ──────────────────────────────────
    {
        "id": "h1",
        "name": "Artisan Coffee Mug",
        "category": "household",
        "subcat": "Mugs",
        "price": 349.0,
        "original_price": 449.0,
        "rating": 4.7,
        "reviews": 312,
        "badge": "bestseller",
        "image": "images/mug.jpg",
        "emoji": "☕",
        "description": (
            "A beautifully handcrafted terracotta mug with earthy brown glaze and geometric patterns. "
            "Perfect for your morning tea or coffee ritual."
        ),
        "features": "Lead-Free Glaze,Dishwasher Safe,Microwave Safe,350ml Capacity",
        "stock": 200,
    },
    {
        "id": "h2",
        "name": "Blue Pottery Serving Bowl",
        "category": "household",
        "subcat": "Bowls",
        "price": 699.0,
        "original_price": 899.0,
        "rating": 4.8,
        "reviews": 178,
        "badge": "new",
        "image": "images/bowl.jpg",
        "emoji": "🥣",
        "description": (
            "An exquisite blue and white hand-painted serving bowl inspired by traditional "
            "Jaipur blue pottery. A centerpiece for your dining table."
        ),
        "features": "Blue Pottery Style,Food Safe,Handpainted,Large 800ml,Dishwasher Safe",
        "stock": 75,
    },
    {
        "id": "h3",
        "name": "Botanical Terracotta Vase",
        "category": "household",
        "subcat": "Vases",
        "price": 549.0,
        "original_price": 699.0,
        "rating": 4.9,
        "reviews": 94,
        "badge": "new",
        "image": "images/vase.jpg",
        "emoji": "🌿",
        "description": (
            "An elegant tall vase with delicate hand-painted botanical leaf patterns. "
            "A statement piece for modern homes with an earthy aesthetic."
        ),
        "features": "Hand Painted,Waterproof Lining,30cm Height,Décor Vase",
        "stock": 60,
    },
    {
        "id": "h4",
        "name": "Clay Water Pot (Matka)",
        "category": "household",
        "subcat": "Pots",
        "price": 449.0,
        "original_price": 599.0,
        "rating": 4.8,
        "reviews": 423,
        "badge": "bestseller",
        "image": None,
        "emoji": "🏺",
        "description": (
            "A traditional Indian clay matka pot that naturally cools water. "
            "Scientifically proven to maintain optimal water temperature and enhance mineral content."
        ),
        "features": "Natural Cooling,BPA-Free,Alkaline Water,5 Litre Capacity,Traditional Design",
        "stock": 150,
    },
    {
        "id": "h5",
        "name": "Handmade Kulhad Set (6pc)",
        "category": "household",
        "subcat": "Glass",
        "price": 399.0,
        "original_price": 529.0,
        "rating": 4.6,
        "reviews": 267,
        "badge": "sale",
        "image": None,
        "emoji": "🍵",
        "description": (
            "A set of 6 traditional clay kulhads — the original eco-friendly cup. "
            "Perfect for chai, masala milk, and authentic Indian beverages."
        ),
        "features": "Set of 6,Eco-Friendly,150ml Each,Traditional Style,Biodegradable",
        "stock": 300,
    },
    {
        "id": "h6",
        "name": "Terracotta Dinner Set (4pc)",
        "category": "household",
        "subcat": "Plates",
        "price": 1299.0,
        "original_price": 1699.0,
        "rating": 4.7,
        "reviews": 88,
        "badge": "new",
        "image": None,
        "emoji": "🍽️",
        "description": (
            "A beautiful 4-piece dinner set with matching plate, bowl, mug, and side plate. "
            "Fired at high temperature for extra durability with food-safe glaze."
        ),
        "features": "4-Piece Set,Food Safe Glaze,Oven Safe,Dishwasher Safe,Gift Box Included",
        "stock": 45,
    },
    {
        "id": "h7",
        "name": "Red Clay Matka (Handmade)",
        "category": "household",
        "subcat": "Pots",
        "price": 499.0,
        "original_price": 649.0,
        "rating": 4.7,
        "reviews": 102,
        "badge": "new",
        "image": "images/household/red-clay-matka/1.png",
        "emoji": "🏺",
        "description": (
            "A traditional red clay matka, handcrafted by local artisans. Ideal for storing drinking water and keeping it naturally cool."
        ),
        "features": "Red Clay,Handmade,Natural Cooling,3 Litre Capacity",
        "stock": 120,
    },
    {
        "id": "h8",
        "name": "Red & White Design Matka",
        "category": "household",
        "subcat": "Pots",
        "price": 599.0,
        "original_price": 799.0,
        "rating": 4.8,
        "reviews": 58,
        "badge": "new",
        "image": "images/household/red-white-matka/1.png",
        "emoji": "🏺",
        "description": (
            "A decorative red and white patterned matka — combines traditional form with contemporary surface design. Perfect for serving and display."
        ),
        "features": "Hand Painted,Decorative,3.5 Litre,Red & White Finish",
        "stock": 80,
    },
    {
        "id": "h9",
        "name": "Matka Stand (Iron & Wood)",
        "category": "household",
        "subcat": "Accessories",
        "price": 299.0,
        "original_price": 399.0,
        "rating": 4.6,
        "reviews": 34,
        "badge": "",
        "image": "images/household/matka-stand/Gemini_Generated_Image_fgknmbfgknmbfgkn.png",
        "emoji": "🪵",
        "description": (
            "A sturdy matka stand made with wrought iron and wooden slats to elevate and display your clay pot."
        ),
        "features": "Iron Frame,Wooden Slats,Indoor Use,Stable Base",
        "stock": 150,
    },
    {
        "id": "h10",
        "name": "Terracotta Piggy Bank",
        "category": "household",
        "subcat": "Decorative",
        "price": 249.0,
        "original_price": 349.0,
        "rating": 4.5,
        "reviews": 41,
        "badge": "sale",
        "image": "images/household/terracotta-piggy-bank/2.png",
        "emoji": "🐖",
        "description": (
            "A charming handcrafted terracotta piggy bank — a lovely gift for kids and a rustic décor piece."
        ),
        "features": "Handmade,Removable Stopper,Painted Details,Gift Ready",
        "stock": 220,
    },
    {
        "id": "h11",
        "name": "Set of 6 Earthen Diyas",
        "category": "household",
        "subcat": "Diyas",
        "price": 199.0,
        "original_price": 249.0,
        "rating": 4.9,
        "reviews": 76,
        "badge": "bestseller",
        "image": "images/household/diyas-set/1.png",
        "emoji": "🪔",
        "description": (
            "A set of six traditional earthen diyas, perfect for festivals, pujas, and home décor."
        ),
        "features": "Set of 6,Handmade,Smoke-Free Wick Holders,Decorative",
        "stock": 400,
    },
    {
        "id": "h12",
        "name": "Decorative Clay Figurines (3pc)",
        "category": "household",
        "subcat": "Decorative",
        "price": 799.0,
        "original_price": 999.0,
        "rating": 4.8,
        "reviews": 22,
        "badge": "new",
        "image": "images/household/decorative-figurines/1.png",
        "emoji": "🎨",
        "description": (
            "A curated trio of decorative clay figurines — handcrafted and hand-painted to add rustic charm to shelves and mantels."
        ),
        "features": "Set of 3,Hand Painted,Indoor Use,Gift Box",
        "stock": 65,
    },
    {
        "id": "h13",
        "name": "Dahi Handi (Clay Pot)",
        "category": "household",
        "subcat": "Cookware",
        "price": 349.0,
        "original_price": 449.0,
        "rating": 4.6,
        "reviews": 19,
        "badge": "",
        "image": "images/household/dahi-handi/1.png",
        "emoji": "🫙",
        "description": (
            "A traditional clay handi used for storing yogurt and for festive Dahi Handi celebrations. Durable and food-safe."
        ),
        "features": "Food Safe,Handmade,Multi-Purpose,2 Litre",
        "stock": 90,
    },
    {
        "id": "h14",
        "name": "Terracotta Tawa (Cooking Griddle)",
        "category": "household",
        "subcat": "Cookware",
        "price": 799.0,
        "original_price": 999.0,
        "rating": 4.4,
        "reviews": 14,
        "badge": "",
        "image": "images/household/terracotta-tawa/1.png",
        "emoji": "🍳",
        "description": (
            "A traditional terracotta tawa for slow, earthy cooking — ideal for rotis, pancakes, and dosa. Season before use."
        ),
        "features": "Season Before Use,Even Heating,Handmade,30cm Diameter",
        "stock": 45,
    },
]


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
