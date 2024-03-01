
function pointSave(){
     // Fetch pointer data from the server
     fetch('/get-pointers')
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