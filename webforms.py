from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField , PasswordField , BooleanField, ValidationError
from wtforms import validators
from wtforms.validators import DataRequired , Email , EqualTo,  Length




class loginForm(FlaskForm):

    email = StringField("Email" , [ validators.DataRequired() , validators.Email()])
    password = PasswordField("Password" , validators=[DataRequired()])
    submit = SubmitField("Login")


class registerForm(FlaskForm):

    email = StringField("Email" , [ validators.DataRequired() , validators.Email()])
    password = PasswordField("Password" , validators=[DataRequired() , EqualTo('password2' , message="Passwords Must Match ")])  
    password2 = PasswordField("Confirm Password" , validators=[DataRequired()])
    submit = SubmitField("Register")
