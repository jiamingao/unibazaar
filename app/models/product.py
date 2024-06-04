from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Product(db.Model):
    __tablename__ = 'products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    name = db.Column(db.String(1024), nullable=False)
    price = db.Column(db.Numeric(10,2), nullable=False)
    description = db.Column(db.String(1024))
    category = db.Column(db.String(55))
    return_accepted = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='products')

    product_images = db.relationship('ProductImage', back_populates='product',cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='product',cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'category': self.category,
            'return_accepted': self.return_accepted,
            'created_at':self.created_at,
            'updated_at':self.updated_at
        }
