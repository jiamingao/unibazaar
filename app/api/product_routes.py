from flask import Blueprint, request,jsonify
from app.models import db, Product, ProductImage, Review
from flask_login import current_user, login_required
from sqlalchemy.orm import joinedload
from app.forms.product_create import CreateProductForm

product_routes = Blueprint('products', __name__)

#Get all products
@product_routes.route('/all')
def get_all_products():
    products = Product.query.all()
    answer_dict={}
    for product in products:
        product_dict = product.to_dict()
        product_dict['main_image'] = [image.to_dict() for image in product.product_images if image.main_image]
        answer_dict[product_dict["id"]]=product_dict
    return answer_dict


#get a product by product id
@product_routes.route('/<int:productId>')
def get_product_detail(productId):
    product = Product.query.get(productId)
    product_dict = product.to_dict()
    # product_dict['reviews'] = [review.to_dict() for review in product.reviews]
    product_dict['images'] = [image.to_dict() for image in product.product_images]

    return product_dict

#get all products of current user
@product_routes.route('/current')
def get_products_by_current_user():
    products = Product.query.filter_by(user_id=current_user.id).all()
    answer_dict={}
    for product in products:
        product_dict = product.to_dict()
        product_dict['main_image'] = [image.to_dict() for image in product.product_images if image.main_image]
        answer_dict[product_dict["id"]]=product_dict
    return answer_dict

#create a product
#future goal: add mutiple images
@product_routes.route('/new', methods=['POST'])
def create_new_product():
    form = CreateProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # print("form data ", form.data)
    if form.validate_on_submit():
      new_product=Product(
            user_id = current_user.id,
            name = form.data["name"],
            price = form.data["price"],
            description = form.data["description"],
            category = form.data["category"],
            return_accepted = form.data["return_accepted"]
        )
      # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", new_product)
      db.session.add(new_product)
      db.session.commit()

      new_image=ProductImage(
          product_id = new_product.id,
          image_url = form.data["image_url"],
          main_image= True
      )

      db.session.add(new_image)
      db.session.commit()

      product = Product.query.get(new_product.id)
      # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", product)
      product_dict = product.to_dict()
      product_dict['images'] = [image.to_dict() for image in product.product_images]
      return jsonify(product_dict)
    else:
       return jsonify({"error": "Invalid form data"}), 400

#update a product
@product_routes.route('/<int:productId>/edit', methods=["POST"])
def update_product(productId):
  product_to_update = Product.query.get(productId)
  if not product_to_update:
     return jsonify({"error": "Product not found"}),404

  form = CreateProductForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  print("form data ", form.data)
  if form.validate_on_submit():
     product_to_update.name = form.data["name"]
     product_to_update.price = form.data["price"]
     product_to_update.description = form.data["description"]
     product_to_update.category = form.data["category"]
     product_to_update.return_accepted = form.data["return_accepted"]
     main_image = next((img for img in product_to_update.product_images if img.main_image), None)
     if main_image:
        main_image.image_url = form.data['image_url']

     db.session.commit()
     product_dict = product_to_update.to_dict()
     product_dict['images'] = [image.to_dict() for image in product_to_update.product_images]
     return jsonify(product_dict)
  else:
     return jsonify({"error": "Invalid form data"}), 400

#delete a product
@product_routes.route('/<int:productId>/delete', methods=["DELETE"])
def delete_product(productId):
   product_to_delete = Product.query.get(productId)
   if not product_to_delete:
      return jsonify({"error": "Product not found"}),404
   db.session.delete(product_to_delete)
   db.session.commit()
   return jsonify({"message": "Product successfully deleted"}), 200
