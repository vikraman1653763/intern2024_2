var mapView = new ol.View({
    center: ol.proj.fromLonLat([80.2707, 13.0827]),
    zoom: 4.5
});

// Initialize the map with the view and no controls initially
var map = new ol.Map({
    target: 'map',
    view: mapView,
    controls: []
});

// Create an OSM tile layer
var osmTile = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Add the OSM tile layer to the map
map.addLayer(osmTile);

// Add a click event handler to close the popup
document.getElementById('popup-closer').onclick = function() {
    overlay.setPosition(undefined);
    return false;
};

// Initialize the popup overlay
var overlay = new ol.Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

// Add the popup overlay to the map
map.addOverlay(overlay);