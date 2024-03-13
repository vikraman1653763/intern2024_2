function updateAttributeTable(filteredData) {
    // Get the container element where you want to display the table
    var attributeContainer = document.getElementById('attributeContainer');

    // Clear the existing table content
    attributeContainer.innerHTML = '';

    // Create a new table element
    var table = document.createElement('table');

    // Create a header row
    var headerRow = table.insertRow();
    var attributeKeys = Object.keys(filteredData[0]); // Assuming all objects have the same keys
    for (var i = 0; i < attributeKeys.length; i++) {
        var headerCell = headerRow.insertCell();
        headerCell.textContent = attributeKeys[i];
    }

    // Iterate over the filtered data array and create table rows for each object
    for (var i = 0; i < filteredData.length; i++) {
        var rowData = filteredData[i];
        var row = table.insertRow();
        for (var j = 0; j < attributeKeys.length; j++) {
            var cell = row.insertCell();
            cell.textContent = rowData[attributeKeys[j]];
        }
    }

    // Append the table to the container
    attributeContainer.appendChild(table);
}

function filterAttributes(){
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    
    vectorLayer.on('click', function(event) {
        var feature = event.feature; // Get the clicked feature
        var featureId = feature.getId(); // Assuming feature ID is set

        // Filter the attribute data based on the feature ID
        var filteredData = data.filter(function(item) {
            return item['id'] === featureId;
        });

        // Update the attribute table with the filtered data
        updateAttributeTable(filteredData);
    });
}