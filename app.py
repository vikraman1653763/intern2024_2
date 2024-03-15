from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_migrate import Migrate
from webforms import loginForm, registerForm, projectName, changeUserPassword, searchForm
from functools import wraps 
import requests
from modeldb import User, admin_required,Project,Data,Drawnpt,MapData,db,login_manager,app
from geoserver.catalog import Catalog
import folium
# from folium import plugins
from folium.raster_layers import WmsTileLayer , ImageOverlay
from portal import register, verify_otp,success,login,logout,changePassword
import geopandas as gpd

from waitress import serve


# TODO: 
    # - ADD PASSWORD VIEW BUTTON

    # - work in ortho 
    # - delete workspace if user is deleted



ngrok_ip = "http://127.0.0.1:8080"

geoserver_url = "http://localhost:8080/geoserver/rest/"
username = "admin"
password = "geoserver"
cat = Catalog(geoserver_url, username=username, password=password)


# print("GEOSERVER URL : ", cat.get_info())



ADMIN = 2








@app.route('/')
def index():
    workspaces = cat.get_workspaces()
    return render_template("index.html", workspaces=workspaces)


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
            
            print(i.metadata)
            check.append(i.name)
            layer_name = i.name

        if check:


            layer = cat.get_layer(layer_name)
            print(cat)
            print("________________________________")
            if layer:
                # Print layer name
                print("Layer Name:", layer.name)
                
                # Access resource of the layer
                resource = layer.resource
                
                # Get the directory of attributes and methods for the resource
                directory = dir(resource)
              
                # Print each attribute and method in the directory with their index/key
                print("Attributes and Methods of the Resource:")
                for item in directory:
                    value = getattr(resource, item)
                    print(f"{value}: {item}")
                    print(value)

            else:
                print(f"Layer '{layer_name}' not found.")
            print("________________________________")
            
            lon = layer.resource.native_bbox[0]
            lat = layer.resource.native_bbox[2]
            print("________________________________")
            zoom =11
            # Construct WFS GetFeature request
            wfs_url = "http://localhost:8080/geoserver/wfs"
            params = {
                "service": "WFS",
                "version": "1.1.0",
                "request": "GetFeature",
                "typeName": f"{workspace_name}:{layer_name}",
                "outputFormat": "json",
            }
            response = requests.get(wfs_url, params=params)
            # Check if the request was successful
            if response.status_code == 200:
                # Parse the response JSON to extract feature data
                features = response.json()["features"]
                
                coordinates_data=[]
                # Process feature attributes
                attribute_data = []
                for feature in features:
                    properties = feature["properties"]
                    feature_data = {}
                    for attribute_name, attribute_value in properties.items():
                        feature_data[attribute_name] = attribute_value
                        
                    attribute_data.append(feature_data)
                    geometry = feature["geometry"]
                    coords = geometry["coordinates"]
                    coordinates_data.append(coords)
                    print("attributes", attribute_data)
                    print("________________________________________________________________")
            if lay.name == "States and District":
                lon = 78.6569
                lat = 22.9734
                zoom = 11
        else:
            lon = "79.808289"
            lat = "11.941552"
            zoom = 10
       
        return render_template("layout.html" , lay = json.dumps(check) , workspace=json.dumps(workspace) , ngrok_ip=json.dumps(ngrok_ip), layer_list=check , lon=json.dumps(lon) , lat=json.dumps(lat) , zoom=json.dumps(zoom),id=id,data=attribute_data,coords=coordinates_data)

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


@app.route('/delete/<int:id>', methods=('GET', 'POST'))
@login_required
@admin_required
def delete(id):
    user_to_delete = User.query.get_or_404(id)

    if user_to_delete:
        # Delete associated projects
        projects = Project.query.filter_by(user_id=user_to_delete.id).all()
        for project in projects:
            # Delete associated map_data records
            MapData.query.filter_by(project_id=project.id).delete()
            # Delete associated data records
            Data.query.filter_by(project_id=project.id).delete()
            # Delete associated drawnpt records
            Drawnpt.query.filter_by(project_id=project.id).delete()
            # Delete the project itself
            db.session.delete(project)

        # Commit changes
        db.session.commit()

        # Delete the user
        db.session.delete(user_to_delete)
        db.session.commit()

        flash("User and associated data deleted successfully", "info")
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
        Drawnpt.query.filter_by(project_id=id).delete()
        MapData.query.filter_by(project_id=id).delete()
        Data.query.filter_by(project_id=id).delete()

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


@app.route('/save-feature', methods=['POST'])
def save_mapdata():
    data = request.json
    name = data.get('name')
    geojson = json.loads(data.get('geoJSON'))  # Parse the JSON string
    type = geojson.get('type')
    coordinates = geojson.get('coordinates')
    project_id = data.get('project_id')
    # Assuming you have defined the MapData model as mentioned before
    mapdata = MapData(name=name, type=type, metrics=coordinates, project_id=project_id)
    db.session.add(mapdata)
    db.session.commit()

    return jsonify({'message': 'Map data saved successfully'})

@app.route('/get-pointers', methods=['GET','POST'])
def get_pointers():
    # Get the project ID from the query parameters
    project_id = request.args.get('project_id')
    # Query the database to retrieve pointer data filtered by project ID
    pointers = Drawnpt.query.filter_by(project_id=project_id).all()

    # Serialize the pointer data into JSON format
    pointer_data = []
    for pointer in pointers:
        if pointer.ptdata:
            pointer_data.append({
                'name': pointer.name,
                'coordinates': pointer.ptdata,
                'id': pointer.id
            })

    # Send the JSON data to the client-side
    return jsonify({'pointers': pointer_data})

@app.route('/get-polygons', methods=['GET'])
def get_polygons():
    project_id = request.args.get('project_id')
 
    # Query the database to retrieve polygon data
    polygons = MapData.query.filter_by(type='Polygon',project_id=project_id).all()  # Filter only polygons
    
    # Serialize the polygon data into JSON format
    polygon_data = []
    for polygon in polygons:
        if polygon.metrics:
            # Assuming metrics store the polygon coordinates
            coordinates = polygon.metrics.strip('{}').split('},{')
            polygon_coordinates = []
            for coord in coordinates:
                x, y = coord.split(',')
                polygon_coordinates.append([float(x), float(y)])
            
            polygon_data.append({
                'name': polygon.name,
                'coordinates': [polygon_coordinates],
                'id': polygon.id
            })
    # Send the JSON data to the client-side
    return jsonify({'polygons': polygon_data})


@app.route('/get-linestrings', methods=['GET'])
def get_linestrings():
    project_id = request.args.get('project_id')

    # Query the database to retrieve LineString data
    linestrings = MapData.query.filter_by(type='LineString',project_id=project_id).all()
    
    # Serialize the LineString data into JSON format
    linestring_data = []
    for linestring in linestrings:
        if linestring.metrics:
            coordinates = linestring.metrics.strip('{}').split('},{')
            linestring_coordinates = []
            for coord in coordinates:
                x, y = coord.split(',')
                linestring_coordinates.append([float(x), float(y)])
            
            linestring_data.append({
                'name': linestring.name,
                'type': linestring.type,
                'coordinates': linestring_coordinates,
                'id': linestring.id
            })

    # Send the JSON data to the client-side
    return jsonify({'linestrings': linestring_data})


@app.route('/delete-pointer/<int:pointer_id>', methods=['DELETE'])
def delete_pointer(pointer_id):
    pointer = Drawnpt.query.get_or_404(pointer_id)
    if pointer:
        db.session.delete(pointer)
        db.session.commit()
        return jsonify({'message': 'Pointer deleted successfully'}), 200
    else:
        return jsonify({'error': 'Pointer not found'}), 404

@app.route('/delete-polygon/<int:id>', methods=['DELETE'])
def delete_polygon(id):
    poly = MapData.query.get_or_404(id)
    if poly:
        db.session.delete(poly)
        db.session.commit()
        return jsonify({'message': 'Pointer deleted successfully'}), 200
    else:
        return jsonify({'error': 'Pointer not found'}), 404

@app.route('/delete-line/<int:id>', methods=['DELETE'])
def delete_line(id):
    line = MapData.query.get_or_404(id)
    if line:
        db.session.delete(line)
        db.session.commit()
        return jsonify({'message': 'Pointer deleted successfully'}), 200
    else:
        return jsonify({'error': 'Pointer not found'}), 404

dev = True
# dev = False


if __name__ == "__main__":  
    with app.app_context():
        db.create_all()

    if dev:
        app.run(host="0.0.0.0", debug=True, port=5000)
    
    else:
        serve(app , host="0.0.0.0", port=5000, threads=4 , url_prefix="/Nevar_systems")
