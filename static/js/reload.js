function showLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'block';
}

// Function to hide the loading popup
function hideLoadingPopup() {
    document.getElementById('loadingPopup').style.display = 'none';
}

// Function to simulate a custom reload
function customReload() {
    showLoadingPopup();
    
    // Hide the loading popup after 2 seconds (2000 milliseconds)
    setTimeout(function() {
        hideLoadingPopup();
    }, 2000);
}

// Call customReload function when the page is loaded or reloaded
