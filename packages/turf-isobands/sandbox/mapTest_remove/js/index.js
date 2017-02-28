var isobands = require('@turf/isobands');

function styleMap() {
    map.data.setStyle(function (feature) {
        //default colors
        var fillColor = 'gray';
        var strokeColor = 'black';
        //if the color property of the feature is defined set as style
        if (feature.getProperty('color')) {
            fillColor = feature.getProperty('color');
            strokeColor = fillColor;
        }
        return ({
            fillColor: fillColor,
            fillOpacity: 0.4,
            strokeColor: strokeColor,
            strokeWeight: 1
        });
    });
    
    map.data.addListener('mouseover', function (event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 4});
    }.bind(this));
    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
    }.bind(this));
    
}

//create the grid of points on the map
//    var extent = [8, 37, 18, 47];
//    var cellWidth = 50;
//    var units = 'miles';
//    var pointGrid = turf.pointGrid(extent, cellWidth, units);
//    for (var i = 0; i < pointGrid.features.length; i++) {
//        pointGrid.features[i].properties.elevation = Math.random() * 10;
//    }
//console.log('pointGrid: ', JSON.stringify(pointGrid));

//init map
var map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(41, 12),
    //        center: new google.maps.LatLng(46.57, -119.4),
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    zoom: 6
    //        zoom: 9
});

//set contours parameters
var breaks = [0, 2, 5, 9, 10];
var zValue = 'elevation';
//create the contours
var contours = isobands(pointGrid, zValue, breaks);
//add a color to the features
contours.features.forEach(function (band) {
    var color;
    switch (band.properties[zValue]) {
        case breaks[1]:
            color = 'blue';
            break;
        case breaks[2]:
            color = 'green';
            break;
        case breaks[3]:
            color = 'yellow';
            break;
        case breaks[4]:
            color = 'red';
            break;
    }
    band.properties.color = color;
});

//add the contour to the map
map.data.addGeoJson(contours);
//set styles to the contour map
styleMap();

//    console.log(contours.features.map(function(feature) {
//        return feature.geometry.coordinates.map(function(line) {
//            return line.length;
//        });
//    }));

// console.log('contours: ', JSON.stringify(contours));
