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

// var baseGroup = new ol.layer.Group({
//     title: 'base map',
//     layers : [osmTile, noneTile]
// });

// map.addLayer(baseGroup);

// var India_state = new ol.layer.Tile({
//     title: 'India States',
//     source: new ol.source.TileWMS({
//       url: 'http://127.0.0.1:8080/geoserver/wms',
//       params: {'LAYERS': 'GISSimplified:admin2', 'TILED': 'true'},
//       serverType: 'geoserver',
//       visible: true
//     })
// });

// var Eclipse = new ol.layer.Tile({
//     title: 'ECLIPSE',
//     source: new ol.source.TileWMS({
//       url: 'http://127.0.0.1:8080/geoserver/ne/wms',
//       params: {'LAYERS': 'ne:boundary_lines	', 'TILED': 'true'},
//       serverType: 'geoserver',
//       visible: true
//     })
// });


// // map.addLayer(India_state);

// var USA = new ol.layer.Tile({ 
//     title: 'USA',
//     source: new ol.source.TileWMS({
//       url: 'http://127.0.0.1:8080/geoserver/adUcation/wms',
//       params: {'LAYERS': 'adUcation:states', 'TILED': 'true'},
//       serverType: 'geoserver',
//       visible: true
//     })
// });

// // map.addLayer(USA);
// var overlayGroup = new ol.layer.Group({ 
//     title:'overlay group',
//     layers : [India_state , USA , Eclipse]
// })

// map.addLayer(overlayGroup);


// var layerSwitcher = new ol.control.LayerSwitcher({
//     activationMode: 'click',
//     startActive: false,
//     groupSelectStyle: 'children'
// })

// map.addControl(layerSwitcher);


// var mousePosition = new ol.control.MousePosition({
//     className: 'mousePosition',
//     projection:'EPSG:4326', 
//     coordinateFormat: function(coordinate) {return ol.coordinate.format(coordinate , '{y} , {x}',6)}
// });

// map.addControl(mousePosition);

// var scaleControl  = new ol.control.ScaleLine({
//     bar: true,
//     text: true
// });

// map.addControl(scaleControl);


// var container = document.getElementById('popup');
// var content = document.getElementById('popup-content');
// var closer = document.getElementById('popup-closer');

// var popup = new ol.Overlay({
//     element: container,
//     autoPan: true,
//     autoPanAnimation: {
//         duration: 250,
//     },
// });

// map.addOverlay(popup);

// closer.onclick = function () {
//     popup.setPosition(undefined);
//     closer.blur();
//     return false;
// };


