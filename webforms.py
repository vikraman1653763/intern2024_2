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
    username = StringField("Username" , [ validators.DataRequired()])
    password = PasswordField("Password" , validators=[DataRequired() , EqualTo('password2' , message="Passwords Must Match ")])  
    password2 = PasswordField("Confirm Password" , validators=[DataRequired()])
    submit = SubmitField("Register")


class projectName(FlaskForm):

    name = StringField("Project Name" , [ validators.DataRequired()])
    submit = SubmitField("Add Project")
