function mapView(lay, workspace, ngrok_ip, lon, lat, zoom) {
    var mapView = new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: zoom
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
        
        type: 'base',
        source: new ol.source.OSM()
    });

    var satellite = new ol.layer.Tile({
        title: 'satellite',
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 19
        })
    });

    map.addLayer(satellite);
    map.addLayer(osmTile);

    var layer_names = [];
    console.log(layer_names);
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
        console.log(workspace);
        console.log(lyr[lay[i]]);
       console.log("osm",osmTile);

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
