function attributestable(data) {
    var attributeContainer = document.getElementById('attributeContainer');

    var headerDiv = attributeContainer.querySelector('.attributeHeader');
    var rowsDiv = attributeContainer.querySelector('.attributeRows');

    var table = document.createElement('table');

    // Create a header row
    var headerRow = table.insertRow();
    var attributeKeys = Object.keys(data[0]); // Assuming all objects have the same keys
    for (var i = 0; i < attributeKeys.length; i++) {
        var headerCell = headerRow.insertCell();
        headerCell.textContent = attributeKeys[i];
    }

    // Append the table to the header div
    headerDiv.appendChild(table);

    // Iterate over the data array and create table rows for each object
    for (var i = 0; i < data.length; i++) {
        var rowData = data[i];
        var row = table.insertRow();
        for (var j = 0; j < attributeKeys.length; j++) {
            var cell = row.insertCell();
            cell.textContent = rowData[attributeKeys[j]];
        }
    }

    // Append the rows div to the container
    rowsDiv.appendChild(table);
}
