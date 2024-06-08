from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,SelectField,BooleanField, FloatField
from wtforms.validators import DataRequired
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS


class CreateProductForm(FlaskForm):
  name=StringField('Name', validators=[DataRequired()])
  price=FloatField("Price", validators=[DataRequired()])
  description = StringField('Description', validators=[DataRequired()])
  category = SelectField("Category", choices=[("Clothing", "Clothing"),("Jewelry", "Jewelry"),("Home & Living", "Home & Living"),("Craft Supplies", "Craft Supplies")])
  return_accepted = BooleanField("Is refundable")
  # image_url = FileField("Product Image", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  image_url_1 = FileField("Product Image 1", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  image_url_2 = FileField("Product Image 2", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  image_url_3 = FileField("Product Image 3", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  image_url_4 = FileField("Product Image 4", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  image_url_5 = FileField("Product Image 5", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
  submit= SubmitField("Submit")
