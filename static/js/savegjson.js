function saveGeometriesToServer() {
    // Convert the drawn features to GeoJSON format
    var geoJsonFormat = new ol.format.GeoJSON();
    var featuresGeoJson = geoJsonFormat.writeFeatures(source.getFeatures());
   
    // Send the GeoJSON data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: '/save_geometries',
        contentType: 'application/json',
        data: JSON.stringify({ geometries: featuresGeoJson }),
        success: function(response) {
            console.log('Geometries saved successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error saving geometries:', error);
        }
    });
}
