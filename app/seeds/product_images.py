from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_product_images():
  images = [
        ProductImage(product_id=1, image_url="https://unibazaar.s3.amazonaws.com/jacket-01.png",main_image=True),
        ProductImage(product_id=1, image_url="https://unibazaar.s3.amazonaws.com/jacket-02.png",main_image=False),
        ProductImage(product_id=1, image_url="https://unibazaar.s3.amazonaws.com/jacket-03.png",main_image=False),
        ProductImage(product_id=1, image_url="https://unibazaar.s3.amazonaws.com/jacket-04.png",main_image=False),
        ProductImage(product_id=1, image_url="https://unibazaar.s3.amazonaws.com/jacket-05.png",main_image=False),

        ProductImage(product_id=2, image_url="https://unibazaar.s3.amazonaws.com/jeans1.png",main_image=True),
        ProductImage(product_id=2, image_url="https://unibazaar.s3.amazonaws.com/jeans2.png",main_image=False),
        ProductImage(product_id=2, image_url="https://unibazaar.s3.amazonaws.com/jeans3.png",main_image=False),
        ProductImage(product_id=2, image_url="https://unibazaar.s3.amazonaws.com/jeans4.png",main_image=False),
        ProductImage(product_id=2, image_url="https://unibazaar.s3.amazonaws.com/jeans5.png",main_image=False),

        ProductImage(product_id=3, image_url="https://unibazaar.s3.amazonaws.com/shirt1.png",main_image=True),
        ProductImage(product_id=3, image_url="https://unibazaar.s3.amazonaws.com/shirt2.png",main_image=False),
        ProductImage(product_id=3, image_url="https://unibazaar.s3.amazonaws.com/shirt3.png",main_image=False),
        ProductImage(product_id=3, image_url="https://unibazaar.s3.amazonaws.com/shirt4.png",main_image=False),
        ProductImage(product_id=3, image_url="https://unibazaar.s3.amazonaws.com/shirt5.png",main_image=False),

        ProductImage(product_id=4, image_url="https://unibazaar.s3.amazonaws.com/dress.png",main_image=True),
        ProductImage(product_id=5, image_url="https://unibazaar.s3.amazonaws.com/5-necklace.png",main_image=True),
        ProductImage(product_id=6, image_url="https://unibazaar.s3.amazonaws.com/6-bracelet.png",main_image=True),
        ProductImage(product_id=7, image_url="https://unibazaar.s3.amazonaws.com/7-vase.png",main_image=True),
        ProductImage(product_id=8, image_url="https://unibazaar.s3.amazonaws.com/8-table.png",main_image=True),
        ProductImage(product_id=9, image_url="https://unibazaar.s3.amazonaws.com/9-pillow.png",main_image=True),
        ProductImage(product_id=10, image_url="https://unibazaar.s3.amazonaws.com/10-hanging.png",main_image=True),
        ProductImage(product_id=11, image_url="https://unibazaar.s3.amazonaws.com/11-scrapbook.png",main_image=True),
        ProductImage(product_id=12, image_url="https://unibazaar.s3.amazonaws.com/12-stencil.png",main_image=True),
    ]

  db.session.add_all(images)
  db.session.commit()

def undo_product_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_images"))
    db.session.commit()
