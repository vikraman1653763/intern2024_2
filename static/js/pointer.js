function addPointer() {
    addInteraction('Point');
    map.addInteraction(draw);
    draw.on('drawend', function(event) {
        document.getElementById('pointerName').value = '';
        document.getElementById('popupDialog').style.display = 'block';
        var nameInput = document.getElementById('pointerName');
        var submitButton = document.getElementById('submitName');
        submitButton.onclick = function() {
            var name = nameInput.value.trim();
            if (name) {
               
                var coordinates = event.feature.getGeometry().getCoordinates();
            
                

                var marker = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    name: name
                });
            // GeoJSON representation of the point
            var geojson = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                properties: {
                    name: name
                },
                project_id: projectId
            };
            
           
            console.log("pointt",geojson.coordinates);
            // AJAX request to save the GeoJSON in the database
            fetch('/save-pointer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(geojson)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Handle success
                    console.log('Pointer saved successfully');
                } else {
                    // Handle error
                    console.error('Error saving pointer:', data.error);
                }
            })
            .catch(error => {
                console.error('Error saving pointer:', error);
            });
            // Inside submitButton.onclick function
            var geometry = event.feature.getGeometry();
            var coordinates = geometry.getCoordinates();
            var lonLat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
                if (!coordinates || coordinates.length !== 2) {
                    console.error('Invalid coordinates:', coordinates);
                    return;
                }

                if (lonLat && lonLat.length >= 2) {
                    var lon = lonLat[0].toFixed(6);
                    var lat = lonLat[1].toFixed(6);
                    // Rest of your code that uses lon and lat variables
                } else {
                    console.error('Error converting coordinates.');
                }


                var markerName = name + '\n[' + lon + '\n' + lat + ']';
                var mark = name;

                document.getElementById('pointerNameDisplay').textContent = markerName;

                document.getElementById('pointerDialog').style.display = 'block';

                var textStyle = new ol.style.Text({
                    text: mark,
                    font: "18px sans-serif",
                    fill: new ol.style.Fill({ color: 'white' }),
                    offsetX: 0,
                    offsetY: -30,
                    textAlign: 'center'
                });
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: '/static/resources/images/mappt.svg',
                        scale: 0.5,
                        opacity: 1,
                        
                    }),
                    text: textStyle
                });

                marker.setStyle(iconStyle);

                // Add the marker to a vector source
                var vectorSource = new ol.source.Vector({
                    features: [marker]
                });

                // Add the vector source to a vector layer
                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });

                // Add the vector layer to the map
                map.addLayer(vectorLayer);

                // Hide the popup dialog box after adding the pointer
                document.getElementById('popupDialog').style.display = 'none';

                // Add event listener to show pointer dialog box on marker hover
                marker.on('mouseover', function(event) {
                    document.getElementById('pointerDialog').style.display = 'block';
                });

                // Add event listener to hide pointer dialog box on marker mouseout
                marker.on('mouseout', function(event) {
                    document.getElementById('pointerDialog').style.display = 'none';
                });
            }
        };
    });
}

    function removePointer() {
        map.removeInteraction(draw);
    }
    function handleClick() {
        ptImage.classList.toggle('clicked-image-border');
        ptButton.classList.toggle('active');
        if (ptButton.classList.contains('active')) {
            addPointer();
        } else {
            removePointer();
        }
    }
    function addPt() {
        var ptButton = document.getElementById('ptButton');
        if (ptButton) {
            ptButton.addEventListener('click', handleClick);
        }
        var closePopup = document.getElementsByClassName('popup-close')[0];
        closePopup.onclick = function() {
            document.getElementById('popupDialog').style.display = 'none';
        }
        var closePointerDialog = document.querySelector('.pointer-close');
        closePointerDialog.addEventListener('click', function() {
        document.getElementById('pointerDialog').style.display = 'none';
    });
    }
