from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField
from wtforms.validators import DataRequired

class CreateReviewForm(FlaskForm):
  review=StringField('Review', validators=[DataRequired()])
  rating=IntegerField("Price", validators=[DataRequired()])
  submit= SubmitField("Submit")
