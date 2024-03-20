function onInfoButtonClick(layer_names, lyr, map, popup) {
    var infoImage = document.querySelector('#infoButton img');
    var infoButton = document.getElementById("infoButton");
    if (infoButton) {
        infoButton.addEventListener('click', function() {
            console.log("Info button clicked");
            infoImage.classList.toggle('clicked-image-border');
            infoButton.classList.toggle('clicked');
            var infoFlag = infoButton.classList.contains('clicked');
            if (infoFlag) {
                // If infoFlag is true, enable the feature display
                enableFeatureDisplay(layer_names, lyr, map, popup);
                document.body.style.cursor = "help";

            } else {
                // If infoFlag is false, disable the feature display
                disableFeatureDisplay(map,popup);
                popup.setPosition(undefined);
                document.body.style.cursor = "auto";
            }
        });
    } else {
        console.error("Info button element not found");
    }
}

function enableFeatureDisplay(layer_names, lyr, map, popup) {
    if (!map.__featureClickListener) {
        map.__featureClickListener = map.on('singleclick', function(evt) {
            console.log("Single click event fired");
            var content = document.getElementById('popup-content');
            if (!content) {
                console.error("Popup content element not found");
                return;
            }
            content.innerHTML = '';
            var coordinate = evt.coordinate;
            var resolution = map.getView().getResolution();
            var featureFound = false;
    
            for (let i = 0; i < layer_names.length; i++) {
                var layer = lyr[layer_names[i]];
                if (layer.getVisible()) {
                    var url = lyr[layer_names[i]].getSource().getFeatureInfoUrl(coordinate, resolution, 'EPSG:3857', {
                        'INFO_FORMAT': 'application/json'
                    });
                    console.log("Feature info URL:", url);
    
                    if (url) {
                        // If URL is available, make an AJAX request to fetch feature info
                        $.getJSON(url, function(data) {
                            console.log("Received feature data:", data);
                            var feature = data.features[0];
                            if (feature && !featureFound) {
                                var props = feature.properties;
    
                                var table = $('<table>').addClass('custom-table');
    
                                // Add table rows with two columns (heading and data)
                                for (var prop in props) {
                                    var row = $('<tr>');
                                    row.append($('<th>').text(prop)); // Heading
                                    row.append($('<td>').text(props[prop])); // Data
                                    table.append(row);
                                }
    
                                // Append table to popup content
                                $('#popup-content').append(table);
                                popup.setPosition(coordinate);
                                featureFound = true;
                            }
                        }).fail(function(jqxhr, textStatus, error) {
                            console.error("Failed to fetch feature data:", textStatus, error);
                        });
                    }
                }
            }
    
            // If no feature data found, set popup position to undefined
            if (!featureFound) {
                popup.setPosition(undefined);
            }
        });
    }
}

function disableFeatureDisplay(map,popup) {
    if (map.__featureClickListener) {
        ol.Observable.unByKey(map.__featureClickListener);
        map.__featureClickListener = null;
        popup.setPosition(undefined); // Hide popup when feature display is disabled
    }
}
