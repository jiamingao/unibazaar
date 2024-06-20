from flask import Blueprint, request,jsonify
from app.models import db, CartItem
from flask_login import current_user


cart_item_routes = Blueprint('cart_items', __name__)

# add to cart
@cart_item_routes.route('/add', methods=['POST'])
def add_to_cart():
    product_id = request.json['product_id']
    quantity = request.json.get('quantity',1)
    print("Received quantity:", quantity)

    item = CartItem.query.filter_by( product_id=product_id).first()
    if item:
        print("Old quantity:", item.quantity)
        item.quantity += quantity
        print("New quantity:", item.quantity)
    else:
      item = CartItem(
        product_id=product_id,
        quantity=quantity)
      db.session.add(item)

    db.session.commit()
    item_dict = item.to_dict()
    item_dict['product'] = item.product.to_dict()
    return  jsonify(item_dict)

# get cart items
@cart_item_routes.route('/all', methods=['GET'])
def view_cart():
    items = CartItem.query.all()
    return jsonify([{'product_id': item.product_id, 'quantity': item.quantity} for item in items])

# update cart items
@cart_item_routes.route('/<int:itemId>/edit', methods=["PUT"])
def edit_quantity(itemId):
    # item_to_update = CartItem.query.get(cartId)
    item_to_update = CartItem.query.filter_by(id=itemId).first()
    new_quantity =  request.json.get('quantity')
    item_to_update.quantity = new_quantity
    db.session.commit()
    updated_itme_dict = item_to_update.to_dict()
    updated_itme_dict['product'] = item_to_update.product.to_dict()
    return jsonify(updated_itme_dict)

#remove cart item
@cart_item_routes.route('/<int:itemId>/delete', methods=["DELETE"])
def delete_item(itemId):
   item_to_delete = CartItem.query.filter_by(id=itemId).first()
   if not item_to_delete:
      return jsonify({"error": "Product not found"}),404
   db.session.delete(item_to_delete)
   db.session.commit()
   return jsonify({"message": "item successfully deleted"}), 200
  #  return item_to_delete.to_dict()
