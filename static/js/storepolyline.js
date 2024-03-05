 // Event handler for the storing polygon and linestring event
 function storePolygonAndLine(){

     draw.on('drawend', function(event) {
         var feature = event.feature;
         var geometryType = feature.getGeometry().getType();
         if (geometryType !== 'Polygon' && geometryType !== 'LineString') {
             return;
            }
            var geometry = feature.getGeometry();
            
            var geoJSONFormat = new ol.format.GeoJSON();
            var geoJSON = geoJSONFormat.writeGeometry(geometry);
            
            var coordinates = geometry.getCoordinates();
            
            var name = prompt('Please enter a name for the drawn feature:');
            if (name === null || name.trim() === '') {
                alert('Please enter a valid name for the drawn feature.');
                return;
            }
            
            // Create an object containing the name and the GeoJSON representation
            var featureData = {
                name: name.trim(),
                geoJSON: geoJSON,
                project_id: projectId
            };
            // Save the feature data to the server
            saveFeatureToServer(featureData);
            
            // Clear the measure tooltip
            measureTooltipElement = null;
            createMeasureTooltip();
        });
        
    }      
        function saveFeatureToServer(featureData) {
            console.log(featureData);
            fetch('/save-feature', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(featureData)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Feature saved successfully!');
                    } else {
                        console.error('Failed to save feature:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error saving feature:', error);
                });
        }

    