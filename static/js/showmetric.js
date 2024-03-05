
function createPoint(){
     // Fetch pointer data from the server
     fetch(`/get-pointers?project_id=${projectId}`)

     .then(response => response.json())
     .then(data => {
         // Loop through the pointer data and add markers to the map
         data.pointers.forEach(pointer => {
             var coordinates = pointer.coordinates;
             var marker = new ol.Feature({
                 geometry: new ol.geom.Point(coordinates.coordinates)
             });
 
             var iconStyle = new ol.style.Style({
                 image: new ol.style.Icon({
                     src: '/static/resources/images/mappt.svg', // Example icon image
                     scale: 0.5
                 }),
                 text: new ol.style.Text({
                     text: pointer.name,
                     offsetY:-25,
                     font:'14px Arial',
                     fill: new ol.style.Fill({
                         color: 'white'
                     })
                 })
             });
             marker.setStyle(iconStyle);
 
             var vectorSource = new ol.source.Vector({
                 features: [marker]
             });
 
             var vectorLayer = new ol.layer.Vector({
                 source: vectorSource
             });
 
             map.addLayer(vectorLayer);
         });
     })
     .catch(error => console.error('Error fetching pointer data:', error));
 
}
function calculateCentroid(coordinates) {
    var centroidX = 0, centroidY = 0;
    for (var i = 0; i < coordinates[0].length; i++) {
        centroidX += coordinates[0][i][0];
        centroidY += coordinates[0][i][1];
    }
    centroidX /= coordinates[0].length;
    centroidY /= coordinates[0].length;
    return [centroidX, centroidY];
}


function createPolygon() {
    fetch(`/get-polygons?project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            // Loop through the polygon data and add polygons to the map
            data.polygons.forEach(polygon => {
                var coordinates = polygon.coordinates;
                var centroid = calculateCentroid(coordinates);
                var offsetX = 0; 
                var offsetY = 0;
                var textCoordinates = [centroid[0] + offsetX, centroid[1] + offsetY];

                // Create text style for the polygon name
                var textStyle = new ol.style.Text({
                    font: 'bold 14px Lucida Sans,Ebrima,Arial',
                    fill: new ol.style.Fill({
                        color: 'black'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white', // Border color
                        width: 3 // Border width
                    }),
                    text: polygon.name, // Set the text to the name of the polygon
                    offsetX: 0,
                    offsetY: 0,
                     // Padding around the text
                });

                // Create feature for the text
                var textFeature = new ol.Feature({
                    geometry: new ol.geom.Point(textCoordinates) // Use a point from the polygon coordinates as the text label location
                });

                textFeature.setStyle(new ol.style.Style({
                    text: textStyle,
                }));

                var textSource = new ol.source.Vector({
                    features: [textFeature]
                });

                var textLayer = new ol.layer.Vector({
                    source: textSource
                });

                map.addLayer(textLayer);

                // Add the polygon feature
                var polygonFeature = new ol.Feature({
                    geometry: new ol.geom.Polygon(coordinates)
                });

                polygonFeature.set('name', polygon.name);

                var vectorSource = new ol.source.Vector({
                    features: [polygonFeature]
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(11, 238, 254, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'grey',
                            width: 3,
                            lineDash: [3, 10]
                        })
                    })
                });

                map.addLayer(vectorLayer);
            });
        })
        .catch(error => console.error('Error fetching polygon data:', error));
}



function createLine() {
    // Fetch LineString data from the server
    fetch(`/get-linestrings?project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            // Loop through the LineString data and add LineStrings to the map
            data.linestrings.forEach(linestring => {
                var coordinates = linestring.coordinates;

                var linestringFeature = new ol.Feature({
                    geometry: new ol.geom.LineString(coordinates)
                });

                // Add name as a property to the feature
                linestringFeature.set('name', linestring.name);

                var vectorSource = new ol.source.Vector({
                    features: [linestringFeature]
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "white",
                            width: 2,
                            lineDash: [1, 3]
                        })
                    })
                });

                map.addLayer(vectorLayer);

                // Add text labels for each LineString
                var textStyle = new ol.style.Text({
                    font: 'bold 14px Lucida Sans,Ebrima,Arial',
                    fill: new ol.style.Fill({
                        color: 'white'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'black', // Border color
                        width: 3 // Border width
                    }),
                    offsetY: 0,
                    offsetX: 0, // Adjust the offset to position the text label appropriately
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: linestring.name // Set the text to the name of the LineString
                });

                var textFeature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates[0]) // Use the first coordinate of the LineString as the text label location
                });

                textFeature.setStyle(new ol.style.Style({
                    text: textStyle
                }));

                var textSource = new ol.source.Vector({
                    features: [textFeature]
                });

                var textLayer = new ol.layer.Vector({
                    source: textSource
                });

                map.addLayer(textLayer);
            });
        })
        .catch(error => console.error('Error fetching LineString data:', error));
}

