function mapView(lay, workspace, ngrok_ip, lon, lat, zoom) {
    var mapView = new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 16
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
        title: 'Open Street Map',
        visible: true,

        type: 'base',
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
    
    
    map.addLayer(osmTile);
    map.addLayer(noneTile);
    map.addLayer(googleMaps);
    map.addLayer(googleSatellite);

    var layer_names = [];
    
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
        

        layer_names.push(lay[i]);
        map.addLayer(lyr[lay[i]]);
    }

    var mousePosition = new ol.control.MousePosition({
        className: 'mousePosition',
        projection: 'EPSG:4326',
        coordinateFormat: function (coordinate) {
            return ol.coordinate.format(coordinate, '{y} , {x}', 6)
        }
    });

    map.addControl(mousePosition);

    return map;
}
