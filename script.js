var map = L.map('map').setView([52.6426, 5.0590], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

var markerClusterGroup = L.markerClusterGroup();
map.addLayer(markerClusterGroup);

// Function to create a custom marker icon with a custom color using L.divIcon
function createMarkerIcon(color) {
    return L.divIcon({
      className: 'custom-icon',
      html: `<i class="fa fa-camera" style="color: ${color}; font-size: 20px;"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
}
  
document.getElementById("hoorn").addEventListener("change", function (event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
    var csvData = e.target.result;
    // Now you can parse the CSV data and add markers to the map
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Your parsing and marker creation logic here
        var markersAtSameLocation = {};

        // Loop through the data and create markers
        results.data.forEach(function (dataPoint) {
          var latitude = parseFloat(dataPoint["Column 2 http://schema.org/latitude"]);
          var longitude = parseFloat(dataPoint["Column 2 http://schema.org/longitude"]);

          // Check if the latitude and longitude are valid numbers
          if (!isNaN(latitude) && !isNaN(longitude)) {
            var streetName = dataPoint["Column 2 http://schema.org/name"];
            var title = dataPoint["Column 1 http://purl.org/dc/elements/1.1/title"];
            var description = dataPoint["Column 1 http://purl.org/dc/elements/1.1/description"];
            var thumbnailUrl = dataPoint["Column 1 http://schema.org/thumbnail"];
            var sourceUrl = dataPoint["Column 1 http://purl.org/dc/elements/1.1/source"];

            // Create a unique identifier for the marker location
            var locationIdentifier = latitude + "|" + longitude;

            // Create a new marker and add it to the markerClusterGroup
            var numPhotographs = getNumPhotographsForLocation(results.data, latitude, longitude);
            var marker;

            // Define the color scale to map the number of photographs to marker colors
            var colorScale = chroma.scale(['#FF5733', '#FF0000']).domain([1, 10]); // Example: Red (#FF5733) for 1 photo, Dark Red (#FF0000) for 10 photos

            // Use the color scale to get the marker color based on the number of photographs
            var markerColor = colorScale(numPhotographs).hex();

            marker = L.marker([latitude, longitude], { icon: createMarkerIcon(markerColor) });

            var popupContent = `<div class="popup-scrollable-content">`;
            popupContent += `<div class="popup-street-name">${streetName}</div>`;
            popupContent += `<strong>${title}</strong><br>${description}`;
            popupContent += `<br><img src="${thumbnailUrl}" alt="${title}" style="max-width: 100px;">`;
            popupContent += `<br><a href="${sourceUrl}" target="_blank">More Info</a>`;
            popupContent += `</div>`;
            marker.bindPopup(popupContent, { autoPan: true });
            markerClusterGroup.addLayer(marker);

            // Store the marker at this location
            markersAtSameLocation[locationIdentifier] = marker;
          }
        });
      }
    });
  };
  reader.readAsText(file);
});

// Function to get the number of photographs at a given location
function getNumPhotographsForLocation(data, latitude, longitude) {
  var numPhotographs = 0;
  data.forEach(function (dataPoint) {
    if (
      parseFloat(dataPoint["Column 2 http://schema.org/latitude"]) === latitude &&
      parseFloat(dataPoint["Column 2 http://schema.org/longitude"]) === longitude
    ) {
      numPhotographs++;
    }
  });
  return numPhotographs;
}
