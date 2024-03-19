function mapView(lay, workspace, ngrok_ip, lon, lat,projectId,layer_names) {
    var mapView = new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 16,
        minZoom: 4,
        maxZoom: 22, 
        constrainResolution: false, 
        duration: 500 
    });
    

    var map = new ol.Map({
        target: 'map',
        view: mapView,
        controls: []
    });

    var noneTile = new ol.layer.Tile({
        title: 'None',
        type: 'base',
        visible: false
    });

    var osmTile = new ol.layer.Tile({
        title: 'OpenStreetMap',
        visible: true,
        type: 'base', // Set a type for base layers
        source: new ol.source.OSM()
    });

 

    

    var googleMaps = new ol.layer.Tile({
        title: 'Google Maps',
        source: new ol.source.XYZ({
            url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        })
    });
    
    var googleSatellite = new ol.layer.Tile({
        title: 'Google Satellite',
        source: new ol.source.XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
        })
    });

    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(popup);

    
    map.addLayer(osmTile);
    map.addLayer(noneTile);
    map.addLayer(googleMaps);
    map.addLayer(googleSatellite);
    
    layer_names = [];
    
    var lyr = {};

    for (let i = 0; i < lay.length; i++) {
        
        lyr[lay[i]] = new ol.layer.Tile({
            title: lay[i],
            source: new ol.source.TileWMS({
                url: ngrok_ip + '/geoserver/' + workspace + '/wms',
                params: { 'LAYERS': workspace + ':' + lay[i], 'TILED': 'true' },
                serverType: 'geoserver',
                visible: true
            })
        });
         lyr[lay[i]].setZIndex(i + 1);

        layer_names.push(lay[i]);
        map.addLayer(lyr[lay[i]]);

    }
    
    
    
    map.addControl(mousePosition);
    map.addControl(scaleControl);
    createPoint();
    createPolygon();
    createLine();
    createControls();
    toggleSlide();
    // attributestable(data);
    
    
    featureCode(layer_names,lyr,map,popup);
    return map;
    
}

function featureCode(layer_names,lyr, map,popup) {
    map.on('singleclick', function(evt) {
        
        content.innerHTML = '';
        var coordinate = evt.coordinate;
        var resolution = map.getView().getResolution();
        for (let i = 0; i < layer_names.length; i++) {
            var url = lyr[layer_names[i]].getSource().getFeatureInfoUrl(coordinate, resolution, 'EPSG:3857', {
                'INFO_FORMAT': 'application/json'
                
            });
            console.log(layer_names[i], url);
            if (url) {
                // If URL is available, make an AJAX request to fetch feature info
                $.getJSON(url, function(data) {
                    var feature = data.features[0];
                    if (feature) {
                        var props = feature.properties;
                        
                        var table = $('<table>').addClass('custom-table');
                
                            // Add table rows with two columns (heading and data)
                            for (var prop in props) {
                                var row = $('<tr>');
                                row.append($('<th>').text(prop)); // Heading
                                row.append($('<td>').text(props[prop])); // Data
                                table.append(row);
                            }
                            
                            // Append table to popup content
                            $('#popup-content').append(table);
                            
                            
                    }
                });
                popup.setPosition(coordinate);
            }
        }

       
        
    });
}

var mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, 'lat&nbsp    :{y} <br/> long:{x}', 5)
    }
});
var scaleControl  = new ol.control.ScaleLine({
    bar: true,
    text: true
});

// Function to update the state of the "Toggle All Layers" button based on the state of layer checkboxes
function updateToggleAllLayersCheckbox() {
    var layerCheckboxes = document.querySelectorAll('.layer-checkbox');
    var allChecked = Array.from(layerCheckboxes).every(function(checkbox) {
        return checkbox.checked;
    });
    document.getElementById('toggleAllLayers').checked = allChecked;
}

// Add an event listener to layer checkboxes to update the "Toggle All Layers" button
var layerCheckboxes = document.querySelectorAll('.layer-checkbox');
layerCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', updateToggleAllLayersCheckbox);
});

// Add an event listener to the "Toggle All Layers" checkbox
document.getElementById('toggleAllLayers').addEventListener('change', function() {
    var isChecked = this.checked; // Check if the checkbox is checked

    // Loop through checkboxes within the loop
    var layerCheckboxes = document.querySelectorAll('.layer-checkbox');
    layerCheckboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked; // Update the state of the checkbox
        
        var layerName = checkbox.value; // Get the layer name associated with the checkbox
        var layer = map.getLayers().getArray().find(function(layer) {
            return layer.get('title') === layerName; // Find the layer by its title
        });
        
        if (layer) {
            layer.setVisible(isChecked); // Set the visibility based on the checkbox state
        }
    });
});



function toggleLayer(event) {
    var layerName = event.target.value;
    var checkedStatus = event.target.checked;
    var layer = map.getLayers().getArray().find(function(layer) {
        return layer.get('title') === layerName;
    });
    if (layer) {
        layer.setVisible(checkedStatus);
    }
}
