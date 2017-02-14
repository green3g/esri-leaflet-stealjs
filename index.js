import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {BasemapLayer} from 'esri-leaflet/src/Layers/BasemapLayer';
import {DynamicMapLayer} from 'esri-leaflet/src/Layers/DynamicMapLayer';

var map = L.map('map', {
  minZoom: 5
}).setView([38.5, -96.8], 6);
new BasemapLayer('Gray').addTo(map);

var soil = new DynamicMapLayer({
  url: 'https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer',
  opacity: 0.7
}).addTo(map);

var identifiedFeature;
var pane = document.getElementById('selectedFeatures');

map.on('click', function (e) {
  pane.innerHTML = 'Loading';
  if (identifiedFeature){
    map.removeLayer(identifiedFeature);
  }
  soil.identify().on(map).at(e.latlng).run(function(error, featureCollection){
    // make sure at least one feature was identified.
    if (featureCollection.features.length > 0) {
      identifiedFeature = L.geoJSON(featureCollection.features[0]).addTo(map);
      var soilDescription =
        featureCollection.features[0].properties['Dominant Order'] +
        ' - ' +
        featureCollection.features[0].properties['Dominant Sub-Order'];
      pane.innerHTML = soilDescription;
    }
    else {
      pane.innerHTML = 'No features identified.';
    }
  });
});
