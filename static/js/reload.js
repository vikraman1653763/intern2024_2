function showLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'block';
    
}


// Function to hide the loading popup
function hideLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'none';
}

// Function to simulate a custom reload
var reload = false; // Flag to track whether the page has been reloaded

function customReload() {
    if (!reload) { // Check if the page hasn't been reloaded yet
        // Show the loading popup with a message
        showLoadingPopup();

        // Hide the loading popup after a delay
        setTimeout(function() {
            hideLoadingPopup();
           
            reload = true; // Set the flag to true to indicate that the reload process has started
        }, 1000); // Adjust the delay time (in milliseconds) as needed
    } else {
        // If the page has already been reloaded, stop further reload attempts
        hideLoadingPopup();
    }
}
