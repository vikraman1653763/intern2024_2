function toggleImageSlide(projectId) {
    var projectId = projectId;

    $(document).ready(function() {
        // Assign the project ID from Flask to JavaScript variable

        // Make an AJAX request to fetch images from the database
        $.ajax({
            url: '/get-images/' + projectId, // Use projectId variable in the URL
            method: 'GET',
            success: function(response) {
                // Check if the response contains any images
                if (response && response.images) {
                    // Prepend the heading "Images" inside the image container
                    $('#imageContainer').html('<h2 class="imageTitle">Images</h2>');

                    // Iterate through the images and append them to the image container
                    response.images.forEach(function(imagePath) {
                        // Construct the correct URL path for accessing the images
                        var imageUrl = imagePath;
                        $('#imageContainer').append('<img class="renderImages" src="' + imageUrl + '" alt="Image">');
                    });

                    // Add click event listener to the rendered images
                    $('.renderImages').click(function() {
                        var imagePath = $(this).attr('src');
                        openPopup(imagePath);
                    });
                } else {
                    // If no images found, display a message
                    $('#imageContainer').html('<h2>Images</h2>No images found.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching images:', error);
                $('#imageContainer').html('<h2>Images</h2>Error fetching images. Please try again later.');
            }
        });
    });
}

// Function to open popup and display the clicked image
// Function to open the popup
function openPopup(imagePath) {
    $('#popupImage').attr('src', imagePath); // Set the src attribute of popup image
    $('#popupImageContainer').css('display', 'flex'); // Display the popup container with flex
}

// Function to close the popup
function closePopup() {
    $('#popupImageContainer').css('display', 'none'); // Hide the popup container by setting display to none
}
