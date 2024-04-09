function toggleSlide() {
    document.addEventListener("DOMContentLoaded", function() {
        var sidebar = document.getElementById('sidebar');
        var metricBar = document.querySelector('.metricbar');
        var toolyDiv = document.querySelector('.tooly');
        var togImage = document.querySelector('#toggleButton img');
        var imageContainer = document.getElementById('imageContainer');
        var docsContainer = document.getElementById('documentListContainer'); 
        var metrciContainer =document.getElementById('metricbar');
        var isVisibleSidebar = true;
        var isVisibleMetricBar = false;
        var isVisibleImageContainer = false;
        var isVisibleDocsContainer = false;
        document.getElementById('toolButton').addEventListener('click', function() {
            toolyDiv.classList.toggle('show');
            // this.querySelector('img').classList.toggle('clicked-image-border');
        });
        // Toggle sidebar visibility
        document.getElementById('togglelayer').addEventListener('click', function() {
            isVisibleSidebar = !isVisibleSidebar;
            sidebar.classList.toggle('sidebar-visible');
            if (isVisibleImageContainer) {
                imageContainer.classList.toggle('image-visible');
                isVisibleImageContainer=false;
            }
            if(isVisibleDocsContainer){
                docsContainer.classList.toggle('docs-visible'); 
                isVisibleDocsContainer=false;
            };
            if(isVisibleMetricBar){
                metricBar.classList.toggle('metricbar-visible'); 
                isVisibleMetricBar=false;
            };
});

        // Toggle metric bar visibility
        var toggleMetricButton = document.getElementById('metricButton');
        toggleMetricButton.addEventListener('click', function() {
            isVisibleMetricBar = !isVisibleMetricBar; 
            metricBar.classList.toggle('metricbar-visible');  
            if (isVisibleSidebar) {
                sidebar.classList.toggle('sidebar-visible');
                isVisibleSidebar=false; 
            }
            if (isVisibleImageContainer) {
                imageContainer.classList.toggle('image-visible');
                isVisibleImageContainer=false;
            }
            if(isVisibleDocsContainer){
                docsContainer.classList.toggle('docs-visible'); 
                isVisibleDocsContainer=false;
            };
        });

        // Toggle image container visibility
        var toggleImageButton = document.getElementById('imageButton');
        toggleImageButton.addEventListener('click', function() {
            isVisibleImageContainer = !isVisibleImageContainer; 
            imageContainer.classList.toggle('image-visible'); 
            if (isVisibleSidebar) {
                sidebar.classList.toggle('sidebar-visible');
                isVisibleSidebar=false; 
            }
            if(isVisibleDocsContainer){
                docsContainer.classList.toggle('docs-visible');
                isVisibleDocsContainer=false;
            }
            if(isVisibleMetricBar){
                metricBar.classList.toggle('metricbar-visible'); 
                isVisibleMetricBar=false;
            };
        });

        var toggleDocsButton = document.getElementById('docsButton');
        toggleDocsButton.addEventListener('click', function() {
            isVisibleDocsContainer = !isVisibleDocsContainer; 
            // this.querySelector('img').classList.toggle('clicked-image-border');
            docsContainer.classList.toggle('docs-visible'); 
            if (isVisibleSidebar) {
                sidebar.classList.toggle('sidebar-visible');
                isVisibleSidebar=false; 

            }
            if(isVisibleImageContainer){
                imageContainer.classList.toggle('image-visible'); 
                isVisibleImageContainer=false;
            }
            if(isVisibleMetricBar){
                metricBar.classList.toggle('metricbar-visible'); 
                isVisibleMetricBar=false;
            };
        });
    });
}
