from flask import Blueprint, request,jsonify
from app.models import db, CartItem
from flask_login import current_user


cart_item_routes = Blueprint('cart_items', __name__)

# add to cart
@cart_item_routes.route('/add', methods=['POST'])
def add_to_cart():
    product_id = request.json['product_id']
    quantity = request.json.get('quantity', 1)
    new_item = CartItem(
        user_id = current_user.id,
        product_id=product_id,
        quantity=quantity)
    db.session.add(new_item)
    db.session.commit()
    add_item = CartItem.query.get(new_item.id)
    # print(add_item.product)
    add_itme_dict = add_item.to_dict()
    add_itme_dict['product'] = add_item.product.to_dict()
    return add_itme_dict

# get cart items
@cart_item_routes.route('/all', methods=['GET'])
def view_cart():
    items = CartItem.query.all()
    return jsonify([{'product_id': item.product_id, 'quantity': item.quantity} for item in items])

# update cart items
@cart_item_routes.route('/<int:cartId>/edit', methods=["PUT"])
def edit_quantity(cartId):
    # item_to_update = CartItem.query.get(cartId)
    item_to_update = CartItem.query.filter_by(id=cartId, user_id=current_user.id).first()
    new_quantity =  request.json.get('quantity')
    item_to_update.quantity = new_quantity
    db.session.commit()
    updated_itme_dict = item_to_update.to_dict()
    updated_itme_dict['product'] = item_to_update.product.to_dict()
    return updated_itme_dict

#remove cart item
@cart_item_routes.route('/<int:cartId>/delete', methods=["DELETE"])
def delete_item(cartId):
   item_to_delete = CartItem.query.filter_by(id=cartId, user_id=current_user.id).first()
   if not item_to_delete:
      return jsonify({"error": "Product not found"}),404
   db.session.delete(item_to_delete)
   db.session.commit()
   # return jsonify({"message": "item successfully deleted"}), 200
   return item_to_delete.to_dict()
