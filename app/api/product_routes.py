from flask import Blueprint, request
from app.models import db, Product
from flask_login import current_user, login_required
# from sqlalchemy.orm import joinedload
# from sqlalchemy import insert, delete

product_routes = Blueprint('products', __name__)

#Get all products
@product_routes.route('/all')
def get_all_products():
    products = Product.query.all()
    answer_dict= {}
    for product in products:
        product= product.to_dict()
        answer_dict[product["id"]]=product
    return answer_dict

#get a product by id
# @product_routes.route('/<int:ProductId>')
# def get_product_by_id():
