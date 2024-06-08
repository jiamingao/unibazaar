from flask import Blueprint, request,jsonify
from app.models import db, Review
from flask_login import current_user, login_required
from app.forms.review_create import CreateReviewForm

review_routes = Blueprint('reviews', __name__)


#update a review
@review_routes.route('/<int:reviewId>/edit', methods=["PUT"])
@login_required
def update_review(reviewId):
   review_to_update = Review.query.get(reviewId)

   if not review_to_update:
      return jsonify({"error": "Review not found"}),404

   form = CreateReviewForm()
   form['csrf_token'].data = request.cookies['csrf_token']

   if form.validate_on_submit():
      review_to_update.review = form.data["review"]
      review_to_update.rating = form.data["rating"]

      db.session.commit()
      return review_to_update.to_dict()
   else:
      return jsonify({"error": "Invalid form data"}), 400


#delete a review
@review_routes.route('/<int:reviewId>/delete',methods=["DELETE"])
@login_required
def delete_review(reviewId):
   review_to_delete = Review.query.get(reviewId)
   if not review_to_delete:
      return jsonify({"error": "Product not found"}),404
   db.session.delete(review_to_delete)
   db.session.commit()
   return jsonify({"message": "Product successfully deleted"}), 200
