from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_migrate import Migrate
from webforms import loginForm, registerForm, projectName, changeUserPassword, searchForm
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
    # - delete workspace if user is deleted


# ngrok_ip = "https://9b06-61-2-143-247.in.ngrok.io/"
# ngrok_ip = "http://192.168.1.75:8080"
ngrok_ip = "http://127.0.0.1:8080"

# id 2 Admin hariharan141200@gmail.com 
# cat = Catalog("http://localhost:8080/geoserver/rest/", username="admin", password="geoserver")
#cat = Catalog( ngrok_ip + "/geoserver/rest/", username="admin", password="geoserver")
geoserver_url = "http://localhost:8080/geoserver/rest/"
username = "admin"
password = "geoserver"
cat = Catalog(geoserver_url, username=username, password=password)


# print("GEOSERVER URL : ", cat.get_info())



ADMIN = 2

app = Flask(__name__)

# database_ip = "192.168.1.65:8080"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/loginNevar'


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

    

def admin_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if current_user.role != 'admin':
            abort(403)
        return func(*args, **kwargs)
    return decorated_view

@app.route('/')
def index():
    workspaces = cat.get_workspaces()
    return render_template("index.html", workspaces=workspaces)



@app.route('/register' , methods=('GET' , 'POST'))
def register():
    if request.method == 'POST':
        error_message = request.form.get('errorMessage')
        flash(error_message, "error_msg")
        print(error_message, 'error')   
        print("")
        print("")
        return jsonify({'status': 'success'}), 200
    
    else:
        action='register'
        return render_template('register.html', action=action)

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    try:
        # Retrieve user details from the request
        data = request.get_json()
        username = data.get('username')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')
        
        # Save user details to the database
        new_user = User(username=username, lastname=lastname, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'User registered successfully'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': 'Error saving user details'})
    
@app.route('/success')
def success():
    return render_template('success.html')

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
        print(email,password)
        LoginForm.email.data = ''
        LoginForm.password.data = ''

        user = User.query.filter_by(email=email).first()

        if user is not None:
            
            if user.password == password:
                
                login_user(user)
                flash(" logged in successfully !! ", "success")

                if password == "default":
                    
                    return redirect(url_for('changePassword'))
                    

                if user.role == "admin":
                    return redirect(url_for('users'))
                else:
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

@app.route('/status/project/<int:id>', methods=('GET', 'POST'))
@login_required
@admin_required
def add_layer(id):
    pro = Project.query.get_or_404(id)
    layers = cat.get_layers()
    lay = {}
    already_exists = [i.name for i in pro.data]

    for layer in layers:
        workspace = layer.name.split(":")[0]
        if workspace in layer.name:
            x_ = layer.name.split(":")[1]
            if x_ not in already_exists:
                lay[layer.name] = x_

    if request.method == 'POST':
        selected_ids = request.form.getlist('checkbox')
        data = [Data(name=item, project_id=pro.id) for item in selected_ids]
        db.session.add_all(data)
        db.session.commit()
        flash("Layer Added to the Project", "success")
        return redirect(request.referrer)

    return render_template("add_layer.html", user=pro.user, lay=lay, existing=pro.data)


@app.route('/dashboard/application/<int:id>')
@login_required
def project(id):

    workspace = current_user.username
    
    lay = Project.query.get_or_404(id)
    
                
    if lay.user.username == current_user.username:     

        workspace_name = current_user.username
   
        check = []
        for i in lay.data:
            check.append(i.name)
           
            layer_name = i.name

        if check:


            layer = cat.get_layer(layer_name)
            
            lon = layer.resource.native_bbox[0]
            lat = layer.resource.native_bbox[2]
            zoom =11
            print("lat an long", lon,lat,zoom)

            # print(lon , lat)
            if lay.name == "States and District":
                lon = 78.6569
                lat = 22.9734
                zoom = 11
        else:
            
            lon = "79.808289"
            lat = "11.941552"
            zoom = 10

        # # print(check)
        # # print(dir(layer))

        # # a = dir(layer)
        # # for i in a:
        # #     print(f"ATTRIBUTE : {i}" , getattr(layer, i))


        # # print(layer.resource)
        # # print("RESOURCE : " , dir(layer.resource))

        # # for val , i in enumerate(dir(layer.resource)):
        # #     print(" RESOURCE : " , val , " attribute : " , i , getattr(layer.resource, i) )

        # print("LONGITUDE : " , layer.resource.native_bbox[0])
        # print("LATITUDE : " , layer.resource.native_bbox[2])


        return render_template("layout.html" , lay = json.dumps(check) , workspace=json.dumps(workspace) , ngrok_ip=json.dumps(ngrok_ip), layer_list=check , lon=json.dumps(lon) , lat=json.dumps(lat) , zoom=json.dumps(zoom),id=id)

    else:
        abort(403)
    
@app.route("/dashboard/application/map")
@login_required
def map():


    return render_template('map.html')

@app.route('/users')
@admin_required
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

        name_to_update.password = RegisterForm.password.data 

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

        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , user_to_delete.username)
        print(" WORKSPACE : " , type(user_to_delete.username))
                
        # workspace_name = user_to_delete.username

        # # get a reference to the workspace
        # workspace = cat.get_workspace(workspace_name)

        # # get all the resources in the workspace
        # resources = cat.get_resources(workspace)

        # # delete each resource
        # for resource in resources:
        #     cat.delete(resource)

        # # delete the workspace
        # cat.delete(workspace, purge=True)

        # w_ = cat.get_workspace(user_to_delete.username)
        # cat.delete(w_, purge=True)


        # cat.delete_workspace(workspace=user_to_delete.username)



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

@app.route('/delete/project/layer/<int:id>', methods=('GET','POST') )
@login_required
@admin_required
def delete_layer(id):

    layer = Data.query.get_or_404(id)

    if project:
        db.session.delete(layer)
        db.session.commit()

        flash("Layer Deleted" , "error_msg")
        return redirect(request.referrer)
    
    else:
        flash("Layer Not Found" , "info")
        return redirect(request.referrer)




@app.route('/save-pointer', methods=['POST'])
def save_pointer():
    # Extract pointer data from the request
    data = request.get_json()
    name = data.get('properties').get('name')
    coordinates = data.get('geometry').get('coordinates')
    project_id = data.get('project_id')  # Assuming you receive data_id from the client
    print("Savingname",name)
    print("Savingcoord",coordinates)
    print("Saving id",project_id)
    print("Savingssssssssssss")
    # Create a new Drawnpt object and add it to the database session
    pointer = Drawnpt(name=name, ptdata={'coordinates': coordinates}, project_id=project_id)
    db.session.add(pointer)
    

    try:
        # Commit the session to save the pointer to the database
        db.session.commit()
        return jsonify({'success': True, 'message': 'Pointer saved successfully'})
    except Exception as e:
        # Handle errors and rollback the session if needed
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/get-pointers', methods=['GET'])
def get_pointers():
    # Query the database to retrieve pointer data
    pointers = Drawnpt.query.all()
    
    # Serialize the pointer data into JSON format
    pointer_data = []
    for pointer in pointers:
        if pointer.ptdata:
            print(pointer.ptdata)
            print(" ")
            pointer_data.append({
                'name': pointer.name,
                'coordinates': pointer.ptdata
            })
        
    # Send the JSON data to the client-side
    return jsonify({'pointers': pointer_data})
    

dev = True
# dev = False


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    if dev:
        app.run(host="0.0.0.0", debug=True, port=5000)
    
    else:
        serve(app , host="0.0.0.0", port=5000, threads=4 , url_prefix="/Nevar_systems")
