var filter = require('turf-filter');
var distance = require('turf-distance');
var squareGrid = require('turf-square-grid');
var centroid = require('turf-centroid');
var extent = require('turf-extent');

/**
 *
 *  Takes a set of known points, a power parameter, a cell depth, a unit of measurement
 * and returns a set of square polygons in a grid with a property IDW for each cell
 *
 * @param  {FeatureCollection<Point>} controlPoints Sampled points with known value
 * @param  {String} valueField    GeoJson field containing the data value to interpolate on
 * @param  {Number} b             Exponent regulating the distance weighting
 * @param  {Number} cellWidth     The distance across each cell
 * @param  {String} units         Used in calculating cellWidth ('miles' or 'kilometers')
 * @return {FeatureCollection<Polygon>} grid A grid of polygons where each cell has an IDW value
 */
module.exports = function (controlPoints, valueField, b, cellWidth, units) {
  // check if field containing data exists..
  var filtered = filter(controlPoints, valueField);
  //alternative method
  // console.log(controlPoints.features.map(function (feat) { return valueField in feat.properties}));
  if (filtered.features.length === 0) {
    // create a sample square grid
    // compared to a point grid helps visualizing the output (like a raster..)
    var samplingGrid = squareGrid(extent(controlPoints), cellWidth, units);
    var N = samplingGrid.features.length;
    // for every sampling point..
    for (var i = 0; i < N; i++) {
      var w;
      var zw = 0;
      var sw = 0;
      // calculate the distance from each control point to cell's centroid
      controlPoints.features.map(function (point) {
        var d = distance(centroid(samplingGrid.features[i]), point, units);
        if (d === 0) {
          zw = point.properties[valueField];
          return;
        }
        w = 1.0 / Math.pow(d, b);
        sw += w;
        zw += w * point.properties[valueField];
      });
      // write IDW value for each grid cell
      samplingGrid.features[i].properties.z = zw / sw;
    }
    return samplingGrid;

  } else {
    console.log('Specified Data Field is Missing');
  }

};
