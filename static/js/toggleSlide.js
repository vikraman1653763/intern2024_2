 function toggleSlide(){
 document.addEventListener("DOMContentLoaded", function() {
        // Initially show the tooly
        var metricBar = document.querySelector('.metricbar');
        var toolyDiv = document.querySelector('.tooly');
        var togImage = document.querySelector('#toggleButton img');
        var toggleButton = document.querySelector('#toggleButton');
        var sidebar = document.getElementById('sidebar');
        var isVisible = true;
        toggleButton.addEventListener('click', function() {
            document.querySelector('.tooly').classList.toggle('hide');
            this.querySelector('img').classList.toggle('clicked-image-border');
        });
        document.getElementById('togglelayer').addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-visible');
        });

        var toggleButton = document.getElementById('metricButton');
        toggleButton.addEventListener('click', function() {
            isVisible = !isVisible; 
            this.querySelector('img').classList.toggle('clicked-image-border');
            if (isVisible) {
                metricBar.classList.remove('hidden'); // Remove hidden class to show metricbar
            } else {
                metricBar.classList.add('hidden'); // Add hidden class to hide metricbar
            }
        });        
    });

 }