var map = L.map('map').setView([52.6426, 5.0590], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

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
          console.log(results.data);
        }
      });
    };
    reader.readAsText(file);
  });