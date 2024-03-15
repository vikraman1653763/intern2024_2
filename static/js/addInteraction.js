 function addInteraction(intType) {
            map.removeInteraction(draw);

            draw = new ol.interaction.Draw({
                source: source,
                type: intType,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(200, 200, 200, 0.6)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [1, 20],
                        width: 2,
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)',
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)',
                        }),
                    }),
                }),
            });
            map.addInteraction(draw);

            createMeasureTooltip();
            createHelpTooltip();
            storePolygonAndLine();
  
   
    
            /**
            * Currently drawn feature.
            * @type {import("../src/ol/Feature.js").default}
            */
            var sketch;

            /**
            * Handle pointer move.
            * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
            */
            var pointerMoveHandler = function (evt) {
                if (evt.dragging) {
                    return;
                }
                /** @type {string} */
                var helpMsg = 'Click to start drawing';

                if (sketch) {
                    var geom = sketch.getGeometry();
                    // if (geom instanceof ol.geom.Polygon) {
                    //   helpMsg = continuePolygonMsg;
                    // } else if (geom instanceof ol.geom.LineString) {
                    //   helpMsg = continueLineMsg;
                    // }
                }

                //helpTooltipElement.innerHTML = helpMsg;
                //helpTooltip.setPosition(evt.coordinate);

                //helpTooltipElement.classList.remove('hidden');
            };

            map.on('pointermove', pointerMoveHandler);

            // var listener;
            draw.on('drawstart', function (evt) {
                // set sketch
                sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                //listener = sketch.getGeometry().on('change', function (evt) {
                sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });

            draw.on('drawend', function () {
                var feature = event.feature;
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                //ol.Observable.unByKey(listener);
               
            });
        }