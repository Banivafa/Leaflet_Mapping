
//   // Store API query variables
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
  var API_KEY = "pk.eyJ1IjoiYnZhZmFlZW5pYSIsImEiOiJjazBlbmIxbjgwMXpjM2JteGdidXlqOGRpIn0.FJBTZ8yS9rF0fWR85KaWPw"

  
  d3.json(baseURL, function(data) {
  
   // Create a new marker cluster group
   createFeatures(data.features);
  });
 

  function createFeatures(earthquakeData){
      // create popup for each click 
    //   var magnitude = L.geoJSON(magnitudeData, {
  function onEachFeature( feature, layer){
              layer.bindPopup("<h3>"+ feature.properties.place + 
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
   // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
function createMap(earthquakes) {

//     // Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

  // create basemap layer 
  var baseMap = {
      "Street Map" : streetmap,
      "Dark Map" : darkmap
  };
  var overlayMaps ={
      Earthquakes : earthquakes
  };
  
// Creating map object with streetmap
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });



// create layer control

L.control.layers(baseMap, overlayMaps, {
  collapsed : false
}).addTo(myMap);

// create legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'info legend'),
		grades = [ "0-3", "3-4", "4-5", "5-6","6-8"],
     labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
      `<i style="background:${getColor(i + 1)}"></i>
      <span>${grades[i]}</span>
      <br>
      `
	}

	return div;
};
// Use this method to find radius, pass your current earthquake object
function getCircleSize(earthquakes) {
  var circleSize = earthquakes.properties.mag * 30000
  return circleSize;
}

    // Use this method to determine the color, pass your current earthquake object
    
    function getCircleColor(earthquakes) {
      var color = ""
          if (earthquake.properties.mag > 5) {
                  color ="#FF0000";
              }
              else if(earthquake.properties.mag > 4) {
                  color ="#FF4500";
              }
              else if(earthquake.properties.mag > 3) {
                  color ="#FFA500";
              }
              else if(earthquake.properties.mag > 2) {
                  color ="#FFD700";
              }
              else if(earthquake.properties.mag > 1) {
                  color ="#F0E68C";
              }
              else {
                  color ="#ADFF2F"
              } 
      return color;
  }

  function getLocation(earthquakes) {
      var obj = [earthquakes.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      return obj;
  }
  // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < earthquakes.length; i++) {
      L.circle(getLocation([i]), {
          fillOpacity: 0.8,
          color: "black",
          weight: 0.5,
          fillColor: getCircleColor(data[i]),
          radius: getCircleSize(data[i])
      }).bindPopup(`<h3>${data[i].properties.place}</h3><hr><p>${new Date(data[i].properties.time)} </p>`).addTo(earthquakes)
  }
  //Show earthquakes by default
  earthquakes.addTo(myMap);

  function getColor (d)  {
      return  d > 5 ? "#FF0000":
              d > 4 ? "#FF4500":
              d > 3 ? "#FFA500":
              d > 2 ? "#FFD700":
              d > 1 ? "#F0E68C":
              d > 0 ? "#ADFF2F": "#FFEDA0F";
  }

  
  var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (myMap) {
      
      var div = L.DomUtil.create('div', 'info legend');
          grades = [0, 1, 2, 3, 4, 5],
          labels = [`<strong>Magnitudes</strong>`];
          // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i class = "circle"  style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
         
      return div;
      
  };

  legend.addTo(myMap);
}

  