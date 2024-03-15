

// Event handler for the storing polygon and linestring event
function storePolygonAndLine() {
    draw.on('drawend', function(event) {
        var feature = event.feature;
        var geometryType = feature.getGeometry().getType();
        if (geometryType !== 'Polygon' && geometryType !== 'LineString') {
            return;
        }
        var geometry = feature.getGeometry();
        var geoJSONFormat = new ol.format.GeoJSON();
        var geoJSON = geoJSONFormat.writeGeometry(geometry);

        // Show the popup dialog for entering the name
        document.getElementById('popupDialog').style.display = 'block';

        // Event listener for the submit button
        function submitNameHandler() {
            var name = document.getElementById('pointerName').value.trim();
            if (name === '') {
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
            saveFeatureToServer(featureData)
                .then(() => {
                    // Clear the measure tooltip
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    document.getElementById('pointerName').value = '';
                    document.getElementById('popupDialog').style.display = 'none';

                    // Remove the event listener after executing once
                    document.getElementById('submitName').removeEventListener('click', submitNameHandler);

                    // Perform custom reload
                })
                .catch(error => {
                    console.error('Error saving feature:', error);
                });
        }

        document.getElementById('submitName').addEventListener('click', submitNameHandler);
    });
}

function saveFeatureToServer(featureData) {
    console.log(featureData);
    return new Promise((resolve, reject) => {
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
                    resolve();
                } else {
                    reject(new Error('Failed to save feature: ' + response.statusText));
                }
            })
            .catch(error => {
                reject(error);
            });

    });
}
