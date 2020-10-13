// default map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});
// satellite map
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}??access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-streets-v11",
  accessToken: API_KEY
});
// outdoor map
var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// layers for earthquakes and techtonic plates
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// baseMap object to hold the 3 maps
var baseMaps = {
  "Light Map": lightmap,
  "Satellite Map": satellitemap,
  "Outdoor Map": outdoormap
};

// Create the map object
var map = L.map("map-id", {
  center: [37.0902, -95.7129],
  zoom: 10,
  layers: [lightmap, satellitemap, outdoormap]
});

// Create an overlayMaps object to hold the layers of data
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicplates
};
  
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, { 
  collapsed: false
}).addTo(map);

// json pull for all earthquakes 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {
  // function to retrieve magnitude of earthquake
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.3
    };
  }
  // function to assign colors for each magnitude size
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#a63603";
      case magnitude > 4:
        return "#e6550d";
      case magnitude > 3:
        return "#fd8d3c";
      case magnitude > 2:
        return "#fdae6b";
      case magnitude > 1:
        return "#fdd0a2";
      default:
        return "#feedde";
    }
  }
  //function for radius of magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // add GeoJSON layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Place: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);

  // pull tectonic data
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(techtonicdata) {
 
      L.geoJson(techtonicdata, {
        color: "red",
        weight: 1
      })
      .addTo(tectonicplates);

      // add the tectonicplates layer
      tectonicplates.addTo(map);
    });
});