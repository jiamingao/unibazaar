from flask import Blueprint, request,jsonify
from app.models import db, Product, ProductImage, Review, User
from flask_login import current_user, login_required
from sqlalchemy.orm import joinedload
from app.forms.product_create import CreateProductForm
from app.forms.review_create import CreateReviewForm
from app.api.aws_helpers import upload_file_to_s3, remove_file_from_s3, get_unique_filename


product_routes = Blueprint('products', __name__)

#Get all products
@product_routes.route('/all')
def get_all_products():
    products = Product.query.all()
    answer_dict={}
    for product in products:
        product_dict = product.to_dict()
        product_dict['main_image'] = [image.to_dict() for image in product.product_images if image.main_image]
        product_dict['images'] = [image.to_dict() for image in product.product_images]
        answer_dict[product_dict["id"]]=product_dict
    return answer_dict


#get a product by product id
@product_routes.route('/<int:productId>')
def get_product_detail(productId):
    product = Product.query.get(productId)
    product_dict = product.to_dict()
    product_dict['images'] = [image.to_dict() for image in product.product_images]
    return product_dict

#get all products of current user
@product_routes.route('/current')
@login_required
def get_products_by_current_user():
    products = Product.query.filter_by(user_id=current_user.id).all()
    answer_dict={}
    for product in products:
        product_dict = product.to_dict()
        product_dict['main_image'] = [image.to_dict() for image in product.product_images if image.main_image]
        product_dict['images'] = [image.to_dict() for image in product.product_images]
        answer_dict[product_dict["id"]]=product_dict
    return answer_dict

#create a product
@product_routes.route('/new', methods=['POST'])
@login_required
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


      files = [request.files.get(f'image_url_{i}') for i in range(5)]
      for index, file in enumerate(files):
          if file:
            file.filename = get_unique_filename(file.filename)
            upload = upload_file_to_s3(file)
            new_image = ProductImage(
               product_id=new_product.id,
               image_url=upload["url"],
               main_image=(index == 0)  # Only the first file gets main_image=True
                )
            db.session.add(new_image)

      db.session.commit()

      product = Product.query.get(new_product.id)
      # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", product)
      product_dict = product.to_dict()
      product_dict['images'] = [image.to_dict() for image in product.product_images]
      return product_dict
    else:
       return jsonify({"error": "Invalid form data"}), 400

#update a product
@product_routes.route('/<int:productId>/edit', methods=["PUT"])
@login_required
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

     files = [request.files.get(f'image_url_{i}') for i in range(5)]
     existing_images = product_to_update.product_images
     main_image_set = False

     for index, file in enumerate(files):
      if file:
         file.filename = get_unique_filename(file.filename)
         upload = upload_file_to_s3(file)
         url = upload["url"]

         if index < len(existing_images):
            existing_images[index].image_url = url
            existing_images[index].main_image = (index == 0)
         else:
            new_image = ProductImage(
                        product_id=productId,
                        image_url=url,
                        main_image=(index == 0)
                    )
            db.session.add(new_image)
         if index == 0:
            main_image_set = True

        # Ensure there is a main image if not already set
      if not main_image_set and existing_images:
         existing_images[0].main_image = True

     db.session.commit()
     product_dict = product_to_update.to_dict()
     product_dict['images'] = [image.to_dict() for image in product_to_update.product_images]
     return product_dict
  else:
     return jsonify({"error": "Invalid form data"}), 400


#delete a product
@product_routes.route('/<int:productId>/delete', methods=["DELETE"])
@login_required
def delete_product(productId):
   product_to_delete = Product.query.get(productId)
   if not product_to_delete:
      return jsonify({"error": "Product not found"}),404
   db.session.delete(product_to_delete)
   db.session.commit()
   # return jsonify({"message": "Product successfully deleted"}), 200
   return product_to_delete.to_dict()


#get all reviews by productId
@product_routes.route('/<int:productId>/reviews')
def get_reviews_by_product(productId):
   reviews = Review.query.filter_by(product_id = productId).all()
   if not reviews:
        return {}, 200

   total_rating = 0
   answer_dict = {
        'reviews': {},
        'poster':{}
    }

   for review in reviews:
      poster = User.query.get(review.user_id)
      poster_dict = poster.to_dict()
      review_dict = review.to_dict()
      review_dict['poster']=poster_dict
      answer_dict['reviews'][review_dict["id"]] = review_dict
      total_rating += review_dict['rating']
      average_rating = total_rating / len(reviews)
      answer_dict['average_rating'] = average_rating

   return answer_dict, 200



#create a review
@product_routes.route('/<int:productId>/reviews/new', methods=["POST"])
@login_required
def create_a_review(productId):
   form = CreateReviewForm()
   form['csrf_token'].data = request.cookies['csrf_token']
   if form.validate_on_submit():
      new_review = Review(
         user_id = current_user.id,
         product_id = productId,
         review = form.data["review"],
         rating = form.data["rating"]
      )
      db.session.add(new_review)
      db.session.commit()
      return new_review.to_dict()
   else:
      return jsonify({"error": "Invalid form data"}), 400
