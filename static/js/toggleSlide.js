function toggleSlide() {
    document.addEventListener("DOMContentLoaded", function() {
        var sidebar = document.getElementById('sidebar');
        var metricBar = document.querySelector('.metricbar');
        var toolyDiv = document.querySelector('.tooly');
        var togImage = document.querySelector('#toggleButton img');
        var imageContainer = document.getElementById('imageContainer');
        var isVisibleSidebar = true;
        var isVisibleMetricBar = true;
        var isVisibleImageContainer = false;

        // Toggle sidebar visibility
        document.getElementById('togglelayer').addEventListener('click', function() {
            isVisibleSidebar = !isVisibleSidebar;
            if (isVisibleImageContainer) {
                sidebar.classList.toggle('sidebar-visible');
                imageContainer.classList.toggle('image-visible');
            }else{
                sidebar.classList.toggle('sidebar-visible');

            }
        });

        // Toggle metric bar visibility
        var toggleMetricButton = document.getElementById('metricButton');
        toggleMetricButton.addEventListener('click', function() {
            isVisibleMetricBar = !isVisibleMetricBar; 
            this.querySelector('img').classList.toggle('clicked-image-border');
            if (isVisibleMetricBar) {
                metricBar.classList.remove('hidden'); // Remove hidden class to show metricbar
            } else {
                metricBar.classList.add('hidden'); // Add hidden class to hide metricbar
            }
        });

        // Toggle image container visibility
        var toggleImageButton = document.getElementById('imageButton');
        toggleImageButton.addEventListener('click', function() {
            isVisibleImageContainer = !isVisibleImageContainer; 
            // this.querySelector('img').classList.toggle('clicked-image-border');
            if (isVisibleImageContainer) {
                sidebar.classList.toggle('sidebar-visible');

                imageContainer.classList.toggle('image-visible'); 
                isVisibleImageContainer = true;
            } else {
                sidebar.classList.toggle('sidebar-visible');
                imageContainer.classList.toggle('image-visible'); // Add hidden class to hide image container
            }
        });
    });
}
