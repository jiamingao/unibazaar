from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,SelectField,BooleanField, DecimalField
from wtforms.validators import DataRequired


class CreateProductForm(FlaskForm):
  name=StringField('Name', validators=[DataRequired()])
  price=DecimalField("Price", validators=[DataRequired()])
  description = StringField('Description', validators=[DataRequired()])
  category = SelectField("Category", choices=[("Clothing", "Clothing"),("Jewelry", "Jewelry"),("Home & Living", "Home & Living"),("Craft Supplies", "Craft Supplies")])
  return_accepted = BooleanField("Is refundable")
  image_url = StringField("Product Image", validators=[DataRequired()])
  submit= SubmitField("Submit")
