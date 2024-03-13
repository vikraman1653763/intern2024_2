from flask_migrate import Migrate
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from functools import wraps 


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/loginNevar'
app.config['SECRET_KEY'] = "SECRET KEY"
db = SQLAlchemy(app)
migrate = Migrate(app , db)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    session = db.session()
    return session.get(User, int(user_id))

class User(db.Model , UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False , unique=True)
    username = db.Column(db.String(100), nullable=False , unique=True)
    lastname = db.Column(db.String(80), nullable=True)
    role = db.Column(db.String(100))
    password = db.Column(db.String(200), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    
    project = db.relationship('Project', backref='user')

    def __repr__(self):
        return '<Name %%r>' % self.name


class Project(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    data = db.relationship('Data', backref='project') 
    Drawnpt = db.relationship('Drawnpt', backref='project') 

class Data(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))


class Drawnpt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ptdata = db.Column(db.JSON) 
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))

class MapData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type = db.Column(db.String)
    metrics = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))


def admin_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if current_user.role != 'admin':
            abort(403)
        return func(*args, **kwargs)
    return decorated_view
