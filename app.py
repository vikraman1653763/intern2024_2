from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_migrate import Migrate
from webforms import loginForm, registerForm, projectName, changeUserPassword
from datetime import datetime
from functools import wraps 

from geoserver.catalog import Catalog
import folium
# from folium import plugins
from folium.raster_layers import WmsTileLayer , ImageOverlay


from waitress import serve 


# TODO: 
    # - ADD PASSWORD VIEW BUTTON

    # - work in ortho 

# ngrok_ip = "https://7fd2-61-2-143-247.in.ngrok.io/"
ngrok_ip = "http://192.168.1.55:8080"

# id 2 Admin hariharan141200@gmail.com 
# cat = Catalog("http://localhost:8080/geoserver/rest/", username="admin", password="geoserver")
cat = Catalog( ngrok_ip + "/geoserver/rest/", username="admin", password="geoserver")


# print("GEOSERVER URL : ", cat.get_info())



ADMIN = 2

app = Flask(__name__)

# database_ip = "192.168.1.65:8080"
app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:hari1412@localhost/test'
# app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:hari1412@localhost/nevarSystems'
# app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:hari1412@' + database_ip + '/nevarSystems'
app.config['SECRET_KEY'] = "SECRET KEY"


db = SQLAlchemy(app)
migrate = Migrate(app , db)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model , UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False , unique=True)
    username = db.Column(db.String(100), nullable=False , unique=True)
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

class Data(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))


def admin_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if current_user.role != 'admin':
            abort(403)
        return func(*args, **kwargs)
    return decorated_view

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/register' , methods=('GET' , 'POST'))
@login_required
@admin_required
def register():

    email = None
    psw = None
    username = None

    RegisterForm = registerForm()

    if RegisterForm.validate_on_submit():

        user = User.query.filter_by(email=RegisterForm.email.data).first()

        if user is None:
            
            email = RegisterForm.email.data
            username = RegisterForm.username.data
            psw = RegisterForm.password.data

            hashed_pw = generate_password_hash(psw  , "sha256")
            
            user = User(email=email , username=username , password=hashed_pw)
            db.session.add(user)
            db.session.commit()

            cat.create_workspace(username, username)

            flash(" User Added Successfully !!! ")
        RegisterForm.email.data = ''
        RegisterForm.username.data = ''
        RegisterForm.password.data = ''

    return render_template("register.html" , RegisterForm=RegisterForm )


@app.route('/logout' , methods=('GET' , 'POST'))
@login_required
def logout():
    logout_user()
    flash(" Loged Out Succesfully !! " , "info")
    return redirect(url_for('login'))


@app.route('/login' , methods=('GET' , 'POST'))
def login():

    email = None
    password = None
    LoginForm = loginForm()

    if LoginForm.validate_on_submit():

        email = LoginForm.email.data
        password = LoginForm.password.data

        LoginForm.email.data = ''
        LoginForm.password.data = ''

        user = User.query.filter_by(email=email).first()

        if user is not None:
            
            if check_password_hash(user.password, password):
                
                login_user(user)
                flash(" logged in successfully !! ", "success")

                if password == "default":
                    
                    return redirect(url_for('changePassword'))
                    
                return redirect(url_for('dashboard'))
            
            else:
                flash(" Invalid Email/Password !! " , "error_msg")
        
        else:
            flash(" Invalid Email/Password !! " , "error_msg")            
        

    return render_template("login.html" , LoginForm=LoginForm)

@app.route('/changePassword' , methods=('GET' , 'POST'))
@login_required
def changePassword():

    pwd_to_update = current_user
    Change_pwd = changeUserPassword()

        
    if Change_pwd.validate_on_submit():
        
        hashed_pw = generate_password_hash(Change_pwd.password_1.data  , "sha256")

        pwd_to_update.password = hashed_pw
        Change_pwd.password_1.data = ''

        try:

            db.session.commit()
            flash("Password updated successfully", "success")

            return redirect(url_for('dashboard'))

        except:
            
            flash(" Some Occurred Please try again " , "error")
            return redirect(url_for('dashboard'))

    else:
    
    
        return render_template('change_password.html' , Change_pwd=Change_pwd)


@app.route('/dashboard')
@login_required
def dashboard():

    return render_template("dashboard.html")


@app.route('/status/<int:id>' , methods=('GET' , 'POST'))
@login_required
@admin_required
def status(id):

    name_of_project = None
    ProjectName = projectName()

    user = User.query.get_or_404(id)
    projects = user.project

    if ProjectName.validate_on_submit():
        
        name_of_project = ProjectName.name.data
        ProjectName.name.data = ''


        p = Project(name=name_of_project, user_id=user.id)
        db.session.add(p)
        db.session.commit()
        
        flash(" New Project Added " , "success")

        return redirect(url_for("status" , id=user.id))

    else:
        return render_template("status.html" , user=user , projects=projects , ProjectName=ProjectName)

@app.route('/status/project/<int:id>' , methods=('GET' , 'POST'))
@login_required
@admin_required
def add_layer(id):
    
    pro = Project.query.get_or_404(id)
    
    layers = cat.get_layers()
    workspace = pro.user.username

    lay = {}
    for layer in layers:
        if workspace in layer.name :
            lay[layer.name] = layer.name.split(":")[1]


    if request.method == 'POST':
        selected_ids = request.form.getlist('checkbox')

        data = [Data(name=item , project_id=pro.id) for item in selected_ids]
        db.session.add_all(data)
        db.session.commit()
        
        flash(" Layer Added to the Project " , "success")
        return redirect(request.referrer)
    
    return render_template("add_layer.html" , user=pro.user , lay=lay , exisiting=pro.data)
    

@app.route('/dashboard/application/<int:id>')
@login_required
def project(id):

#     workspace = current_user.username
    
#     lay = Project.query.get_or_404(id)

#     if lay.user.username == current_user.username:     

#         map = folium.Map(location=[8.387088 , 77.007328], zoom_start=15)
        
#         ip = "https://c8d1-2402-3a80-450-d847-1cc8-a352-d7e7-ae64.in.ngrok.io"

# #  192.168.1.47 
#         for i in lay.data:
#             # WmsTileLayer(url='http://127.0.0.1:8080/geoserver/' + workspace +'/wms',
#             # WmsTileLayer(url='http://192.168.43.178:8080/geoserver/' + workspace +'/wms',
#             WmsTileLayer(url='http://192.168.1.55:8080/geoserver/' + workspace +'/wms',

#                             layers= workspace+':'+i.name,
#                             name=i.name,
#                             fmt='image/png',
#                             overlay=True,
#                             transparent=True,
#                             control=True

#                             ).add_to(map)

#         folium.LayerControl().add_to(map)

#         map.save('templates/map.html')
    
#         return render_template("folium.html")

#     else:
#         abort(403)
  
    workspace = current_user.username
    
    lay = Project.query.get_or_404(id)

    if lay.user.username == current_user.username:     

        check = []
        for i in lay.data:
            check.append(i.name)

        print(check)

        return render_template("layout.html" , lay = json.dumps(check) , workspace=json.dumps(workspace) , ngrok_ip=json.dumps(ngrok_ip))

    else:
        abort(403)
    
@app.route("/dashboard/application/map")
@login_required
def map():


    return render_template('map.html')

@app.route('/users')
@login_required
def users():

    users = User.query.order_by(User.date_added).all()
    return render_template('users.html', users=users)


@app.route('/update/<int:id>' , methods=('GET','POST'))
@login_required
@admin_required
def update(id):

    RegisterForm = registerForm()
    name_to_update = User.query.get_or_404(id)

    if RegisterForm.validate_on_submit():

        name_to_update.email =  RegisterForm.email.data
        hashed_pw = generate_password_hash(RegisterForm.password.data  , "sha256")

        name_to_update.password = hashed_pw

        RegisterForm.email.data = ''
        RegisterForm.password.data = ''

        try:

            db.session.commit()
            flash("User updated successfully", "success")

            return redirect(url_for('users'))

        except:
            
            flash(" Some Occurred Please try again " , "error")
            return render_template('users.html',RegisterForm=RegisterForm, user=name_to_update)

    else:
        return render_template('update.html',RegisterForm=RegisterForm, user=name_to_update)


@app.route('/delete/<int:id>' , methods=('GET','POST'))
@login_required
@admin_required
def delete(id):


    user_to_delete = User.query.get_or_404(id)

    print("USER TO DELETE: " , user_to_delete.email , user_to_delete.id)

    if user_to_delete:

        projects = Project.query.filter_by(user_id=user_to_delete.id).all()
        
        for p in projects:
            data = Data.query.filter_by(project_id=p.id).all()
            
            for data_ in data:
                db.session.delete(data_)

        for project in projects:
            db.session.delete(project)


        db.session.delete(user_to_delete)
        db.session.commit()

        flash("User Deleted ", "info")
        return redirect(url_for('users'))

    else:
        flash("User Not Found", "error")
        return redirect(request.referrer)
            

@app.route('/delete/project/<int:id>', methods=('GET','POST') )
@login_required
@admin_required
def delete_project(id):

    project = Project.query.get_or_404(id)

    if project:
        db.session.delete(project)
        db.session.commit()

        flash("Project Deleted" , "error")
        return redirect(request.referrer)
    
    else:
        flash("Project Not Found" , "info")
        return redirect(request.referrer)


dev = True


if __name__ == "__main__":

    if dev:
        app.run(host="0.0.0.0", debug=True, port=5000)
    
    else:
        serve(app , host="0.0.0.0", port=5000, threads=4 , url_prefix="/Nevar_systems")
