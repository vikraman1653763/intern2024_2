function deletePointer(Id) {
    if (confirm("Are you sure you want to delete this pointer?")) {
    console.log('Deleting pointer', Id);
    fetch(`/delete-pointer/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
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
}}

function deletePolygon(Id) {

    if (confirm("Are you sure you want to delete this polygon?")) {
    console.log('Deleting pointer', Id);
    fetch(`/delete-polygon/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
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
}

function deleteLine(Id) {

    if (confirm("Are you sure you want to delete this Line?")) {

    console.log('Deleting LIne', Id);
    fetch(`/delete-line/${Id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
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
}