//contianer
var container;
function createButtonContainer() {
    container = document.createElement('div');
    container.id = 'buttonContainer'; // You can assign an ID to this container for styling or manipulation
    container.className = 'button-container'; // You can assign a class for styling
    return container;
}
//home control
function homeControl(dashboardUrl ,container){
    var homeButton = document.createElement('button');
        homeButton.innerHTML = '<img src="/static/resources/images/home.svg" alt="" style="width:20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
        homeButton.className = 'myButton';

        var homeElement = document.createElement('div');
        homeElement.className = 'homeButtonDiv';
        homeElement.appendChild(homeButton);

        var homeControl = new ol.control.Control({
            element: homeElement
        })

        homeButton.addEventListener("click", () => {
            location.href = dashboardUrl;
        })

        map.addControl(homeControl);
        container.appendChild(homeElement);
    }

// start : zoomOut Control
function zoomOut(container){
                // Define the DragBox interaction for zooming out
        var zoomOutInteraction = new ol.interaction.DragBox();

        zoomOutInteraction.on('boxend', function (event) {
            var zoomOutExtent = event.target.getGeometry().getExtent();
            map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));
            map.getView().setZoom(map.getView().getZoom() - 1);
            zoomOutInteraction.setActive(false);
            zoomOutInteraction.setActive(true);
        });

        // Create the zoom out button
        var zoButton = document.createElement('button');
        zoButton.innerHTML = '<img src="/static/resources/images/zoomOut.png" alt="" style="width:18px;height:18px;transform: rotate(270deg);filter:brightness(0) invert(1);vertical-align:middle"></img>';
        zoButton.className = 'myButton';
        zoButton.id = 'zoButton';

        // Add a click event listener to toggle the zoom out interaction and update button class
        zoButton.addEventListener("click", function() {
            zoButton.classList.toggle('clicked');
            if (zoButton.classList.contains('clicked')) {
                document.getElementById("map").style.cursor = "zoom-out";
                map.addInteraction(zoomOutInteraction);
            } else {
                map.removeInteraction(zoomOutInteraction);
                document.getElementById("map").style.cursor = "default";
            }
        });

        // Create the control element
        var zoElement = document.createElement('div');
        zoElement.className = 'zoButtonDiv';
        zoElement.appendChild(zoButton);

        // Create the zoom out control
        var zoControl = new ol.control.Control({
            element: zoElement
        });

        // Add the zoom out control to the map
        map.addControl(zoControl);
        container.appendChild(zoElement);

    }
        // end : zoomOut Control

 // start : zoomIn Control
function zoomIn(container){
 var zoomInInteraction = new ol.interaction.DragBox();

 zoomInInteraction.on('boxend', function () {
     var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
     map.getView().fit(zoomInExtent);
 });

 var ziButton = document.createElement('button');
 ziButton.innerHTML = '<img src="/static/resources/images/zoomIn.svg" alt="" style="width:18px;height:18px;transform: rotate(270deg);filter:brightness(0) invert(1);vertical-align:middle"></img>';
 ziButton.className = 'myButton';
 ziButton.id = 'ziButton';

 var ziElement = document.createElement('div');
 ziElement.className = 'ziButtonDiv';
 ziElement.appendChild(ziButton);

 var ziControl = new ol.control.Control({
     element: ziElement
 })

 var zoomInFlag = false;
 ziButton.addEventListener("click", () => {
     ziButton.classList.toggle('clicked');
     zoomInFlag = !zoomInFlag;
     if (zoomInFlag) {
         document.getElementById("map").style.cursor = "zoom-in";
         map.addInteraction(zoomInInteraction);
     } else {
         map.removeInteraction(zoomInInteraction);
         document.getElementById("map").style.cursor = "default";
     }
 })

 map.addControl(ziControl);
 container.appendChild(ziElement);
}

// start : full screen Control

function fullScreen(container){
var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="/static/resources/images/fullscreen.svg" alt="" style="width:20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
})
fsButton.addEventListener("click", () => {
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
})

map.addControl(fsControl);
container.appendChild(fsElement);
}
// end : full screen Control

function lengthControl(container){
var lengthButton = document.createElement('button');
        lengthButton.innerHTML = '<img src="/static/resources/images/measure-length.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
        lengthButton.className = 'myButton';
        lengthButton.id = 'lengthButton';

        var lengthElement = document.createElement('div');
        lengthElement.className = 'lengthButtonDiv';
        lengthElement.appendChild(lengthButton);

        var lengthControl = new ol.control.Control({
            element: lengthElement
        })

        var lengthFlag = false;
        lengthButton.addEventListener("click", () => {
            // disableOtherInteraction('lengthButton');
            lengthButton.classList.toggle('clicked');
            lengthFlag = !lengthFlag;
            document.getElementById("map").style.cursor = "default";
            if (lengthFlag) {
                map.removeInteraction(draw);
                addInteraction('LineString');
            } else {
                map.removeInteraction(draw);
                source.clear();
                const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
                while (elements.length > 0) elements[0].remove();
            }

        })

        map.addControl(lengthControl);
        container.appendChild(lengthElement);

    }

    function areaControl(container){
        var areaButton = document.createElement('button');
        areaButton.innerHTML = '<img src="/static/resources/images/measure-area.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
        areaButton.className = 'myButton';
        areaButton.id = 'areaButton';


        var areaElement = document.createElement('div');
        areaElement.className = 'areaButtonDiv';
        areaElement.appendChild(areaButton);

        var areaControl = new ol.control.Control({
            element: areaElement
        })

        var areaFlag = false;
        areaButton.addEventListener("click", () => {
            // disableOtherInteraction('areaButton');
            areaButton.classList.toggle('clicked');
            areaFlag = !areaFlag;
            document.getElementById("map").style.cursor = "default";
            if (areaFlag) {
                map.removeInteraction(draw);
                addInteraction('Polygon');
            } else {
                map.removeInteraction(draw);
                source.clear();
                const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
                while (elements.length > 0) elements[0].remove();
            }
        })

        map.addControl(areaControl);
        container.appendChild(areaElement);

    }
    
    function createControls() {
        var container = createButtonContainer();
    
        homeControl(dashboardUrl ,container);
        zoomOut(container);
        zoomIn(container);
        fullScreen(container);
        lengthControl(container);
        areaControl(container);
    
        // Append the container to the map's target element
        var mapTarget = document.getElementById('map');
        mapTarget.appendChild(container);
    }