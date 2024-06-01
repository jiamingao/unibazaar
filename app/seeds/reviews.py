from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reviews():
  reviews = [
        Review(user_id=2, product_id=1, review="Great jacket, perfect for cold weather.", rating=4),
        Review(user_id=3, product_id=2, review="These jeans fit great and feel premium.", rating=5),
        Review(user_id=4, product_id=3, review="Interesting design, but the material is not what I expected.", rating=3),
        Review(user_id=5, product_id=4, review="Lovely summer dress, light and pretty.", rating=5),

        Review(user_id=3, product_id=5, review="This necklace is absolutely stunning.", rating=5),
        Review(user_id=4, product_id=6, review="Beautifully designed bracelet, but a bit pricey.", rating=4),

        Review(user_id=4, product_id=7, review="Elegant vase, smaller than expected but looks good.", rating=4),
        Review(user_id=5, product_id=8, review="Solid and stylish table, fits well in my dining area.", rating=5),
        Review(user_id=1, product_id=9, review="This pillow adds a luxurious touch to any room.", rating=5),

        Review(user_id=1, product_id=10, review="Lovely stained glass, adds a great touch to the decor.", rating=5),
        Review(user_id=2, product_id=11, review="The scrapbook bundle is perfect for beginners.", rating=4),
        Review(user_id=3, product_id=12, review="Useful stencils, easy to use and clean.", rating=5)
    ]
  db.session.add_all(reviews)
  db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
    db.session.commit()
