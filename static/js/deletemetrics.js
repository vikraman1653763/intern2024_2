function deletePointer(Id) {
    console.log('Deleting pointer', Id);
    fetch(`/delete-pointer/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the point name from the HTML
            var pointNameDiv = document.getElementById(`point-${Id}`);
            if (pointNameDiv) {
                pointNameDiv.remove();
            }
        } else {
            console.error('Failed to delete pointer');
        }
    })
    .catch(error => console.error('Error deleting pointer:', error));
}

function deletePolygon(Id) {
    console.log('Deleting pointer', Id);
    fetch(`/delete-polygon/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the point name from the HTML
            var polyNameDiv = document.getElementById(`polygon-${Id}`);
            if (polyNameDiv) {
                pointNameDiv.remove();
            }
        } else {
            console.error('Failed to delete pointer');
        }
    })
    .catch(error => console.error('Error deleting pointer:', error));
}

function deleteLine(Id) {
    console.log('Deleting LIne', Id);
    fetch(`/delete-line/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the point name from the HTML
            var lineNameDiv = document.getElementById(`line-${Id}`);
            if (lineNameDiv) {
                lineNameDiv.remove();
            }
        } else {
            console.error('Failed to delete pointer');
        }
    })
    .catch(error => console.error('Error deleting pointer:', error));
}
