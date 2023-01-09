from flask import Flask,  render_template 
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired , Email
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from wtforms import validators
import psycopg2

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:hari1412@localhost/nevarSystems'
app.config['SECRET_KEY'] = "SECRET KEY"


db = SQLAlchemy(app)

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False , unique=True)
    password = db.Column(db.String(100), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Name %%r>' % self.name

class loginForm(FlaskForm):

    email = StringField("Email" , [ validators.DataRequired() , validators.Email()])
    name = StringField("Name" , validators=[DataRequired()])
    submit = SubmitField("Login")


class registerForm(FlaskForm):

    email = StringField("Email" , [ validators.DataRequired() , validators.Email()])
    name = StringField("Name" , validators=[DataRequired()])
    submit = SubmitField("Register")


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/register' , methods=('GET' , 'POST'))
def register():

    name = None
    email = None
    RegisterForm = registerForm()

    if RegisterForm.validate_on_submit():

        user = User.query.filter_by(email=RegisterForm.email.data).first()

        
        print("EMAIL : ", email)
        print("NAME : ", name)
        
        if user is None:

            email = RegisterForm.email.data
            psw = RegisterForm.name.data

            user = User(email=email , password=psw)
            db.session.add(user)
            db.session.commit()

        print("EMAIL : ", email)
        print("NAME : ", name)
        
        RegisterForm.name.data = ''
        RegisterForm.email.data = ''

    return render_template("register.html" , LoginForm=RegisterForm )


@app.route('/login' , methods=('GET' , 'POST'))
def login():

    name = None
    email = None
    LoginForm = loginForm()

    if LoginForm.validate_on_submit():

        email = LoginForm.email.data
        name = LoginForm.name.data

        print("EMAIL : ", email)
        print("NAME : ", name)
        
        LoginForm.name.data = ''
        LoginForm.email.data = ''

    return render_template("login.html" , LoginForm=LoginForm)

@app.route('/users')
def users():

    users = User.query.order_by(User.email).all()
    return render_template('users.html', users=users)


@app.route('/update')
def update():

    users = User.query.order_by(User.email).all()
    return render_template('users.html', users=users)



if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)