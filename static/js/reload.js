function showLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'block';
    
}


// Function to hide the loading popup
function hideLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'none';
}

// Function to simulate a custom reload

function customReload() {
    var reload = false; // Flag to track whether the page has been reloaded
    if (!reload) { // Check if the page hasn't been reloaded yet
        // Show the loading popup with a message
        showLoadingPopup();

        // Hide the loading popup after a delay
        window.onload = function() {
            hideLoadingPopup();
            reload = true; 
        }; 
    } else {
        // If the page has already been reloaded, stop further reload attempts
        hideLoadingPopup();
    }
}
