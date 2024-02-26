//contianer
var container;
var zoImage = document.querySelector('#zoButton img'); // Get the image inside the button
var ziImage = document.querySelector('#ziButton img');
var leImage = document.querySelector('#lengthButton img');
var arImage = document.querySelector('#areaButton img');
var ptImage = document.querySelector('#ptButton img');


//home control
function homeControl(dashboardUrl) {
    // Select the existing button by its ID
    var homeButton = document.getElementById('homeButton');

    // Add onclick event directly to the button element
    homeButton.onclick = function() {
        location.href = dashboardUrl;
    };
}

// start : zoomOut Control
function zoomOut() {
    // Get the existing zoom out button
    var zoButton = document.getElementById('zoButton');


    // Define the DragBox interaction for zooming out
    var zoomOutInteraction = new ol.interaction.DragBox();
    
    zoomOutInteraction.on('boxend', function(event) {
        var zoomOutExtent = event.target.getGeometry().getExtent();
        map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));
        map.getView().setZoom(map.getView().getZoom() - 1);
        zoomOutInteraction.setActive(false);
        zoomOutInteraction.setActive(true);
    });
    
    // Add a click event listener to toggle the zoom out interaction and update button class
    zoButton.addEventListener("click", function() {
        zoImage.classList.toggle('clicked-image-border'); // Toggle the class for the image
        zoButton.classList.toggle('clicked');
        if (zoButton.classList.contains('clicked')) {
            document.getElementById("map").style.cursor = "zoom-out";
            map.addInteraction(zoomOutInteraction);
        } else {
            map.removeInteraction(zoomOutInteraction);
            document.getElementById("map").style.cursor = "default";
        }
    });
}


        // end : zoomOut Control

 // start : zoomIn Control
 function zoomIn() {
    // Get the existing zoom in button
    var ziButton = document.getElementById('ziButton');

   
    // Define the DragBox interaction for zooming in
    var zoomInInteraction = new ol.interaction.DragBox();

    zoomInInteraction.on('boxend', function () {
        var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
        map.getView().fit(zoomInExtent);
    });

    // Add a click event listener to toggle the zoom in interaction and update button class
    ziButton.addEventListener("click", function () {
        ziImage.classList.toggle('clicked-image-border'); // Toggle the class for the image

        ziButton.classList.toggle('clicked');
        if (ziButton.classList.contains('clicked')) {
            document.getElementById("map").style.cursor = "zoom-in";
            map.addInteraction(zoomInInteraction);
        } else {
            map.removeInteraction(zoomInInteraction);
            document.getElementById("map").style.cursor = "default";
        }
    });
}


// start : full screen Control
function fullScreen() {
    // Get the existing full screen button
    var fsButton = document.getElementById('fsButton');

    // Add a click event listener to handle full screen functionality
    fsButton.addEventListener("click", function () {
        var mapEle = document.getElementById("map");
        if (mapEle.requestFullscreen) {
            mapEle.requestFullscreen();
        } else if (mapEle.msRequestFullscreen) {
            mapEle.msRequestFullscreen();
        } else if (mapEle.mozRequestFullscreen) {
            mapEle.mozRequestFullscreen();
        } else if (mapEle.webkitRequestFullscreen) {
            mapEle.webkitRequestFullscreen();
        }
    });
}

// end : full screen Control

function lengthControl() {
    // Get the existing length button
    var lengthButton = document.getElementById('lengthButton');

    

    // Add a click event listener to toggle the length interaction and update button class
    lengthButton.addEventListener("click", function () {
        leImage.classList.toggle('clicked-image-border');

        // disableOtherInteraction('lengthButton');
        lengthButton.classList.toggle('clicked');
        var lengthFlag = lengthButton.classList.contains('clicked');
        document.getElementById("map").style.cursor = "default";
        if (lengthFlag) {
            map.removeInteraction(draw);
            addInteraction('LineString');
        } else {
            map.removeInteraction(draw);
            // source.clear();
            // const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
            // while (elements.length > 0) elements[0].remove();
        }
    });
}


function areaControl() {
    // Get the existing area button
    var areaButton = document.getElementById('areaButton');
    areaButton.addEventListener("click", function() {
    
        arImage.classList.toggle('clicked-image-border'); // Toggle the class for the image
    });
    // Add a click event listener to toggle the area interaction and update button class
    areaButton.addEventListener("click", function () {
        // Toggle the 'clicked' class
        areaButton.classList.toggle('clicked');
        
        // Check if the area button is clicked
        var areaFlag = areaButton.classList.contains('clicked');
        
        // Set the cursor style
        document.getElementById("map").style.cursor = "default";

        // Toggle the area interaction based on the button state
        if (areaFlag) {
            map.removeInteraction(draw);
            addInteraction('Polygon');
        } else {
            // If area button is clicked again, do nothing (optional)
            map.removeInteraction(draw);
            // source.clear();
            // const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
            // while (elements.length > 0) elements[0].remove();
        }
    });
}

//poniter fucntion with popup box


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
            
                    // Add the longitude and latitude to the marker's name
                    var lonLat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
                    var lon = lonLat[0].toFixed(6);
                    var lat = lonLat[1].toFixed(6);
                    var markerName = name + '\n (Longitude: ' + lon + ', Latitude: ' + lat + ')';
                    marker.set('name', markerName);
            
                    var textStyle = new ol.style.Text({
                        text: markerName,
                        font: "18px sans-serif",
                        fill: new ol.style.Fill({ color: 'white' }),
                        offsetX: 0,
                        offsetY: -30,
                        textAlign: 'center'
                    });
                    var iconStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '/static/resources/images/mappt.svg',
                            scale: 0.5, // Adjust the scale as needed
                            opacity: 1
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
    }

function createControls() {
    
    homeControl(dashboardUrl );
    zoomOut();
    zoomIn();
    fullScreen();
    lengthControl();
    areaControl();
    addPt();
    

}