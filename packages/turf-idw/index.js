var distance = require('@turf/distance');
var squareGrid = require('@turf/square-grid');
var centroid = require('@turf/centroid');
var bbox = require('@turf/bbox');

/**
 *
 * Takes a FeatureCollection of points with known value, a power parameter, a cell depth, a unit of measurement
 * and returns a FeatureCollection of polygons in a square-grid with an interpolated value property "IDW" for each grid cell.
 * It finds application when in need of creating a continuous surface (i.e. rainfall, temperature, chemical dispersion surface...)
 * from a set of spatially scattered points.
 *
 * @name idw
 * @param {FeatureCollection<Point>} controlPoints Sampled points with known value
 * @param {string} valueField GeoJSON field containing the known value to interpolate on
 * @param {number} b Exponent regulating the distance-decay weighting
 * @param {number} cellWidth The distance across each cell
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @returns {FeatureCollection<Polygon>} grid A grid of polygons with a property field "IDW"
 */
module.exports = function (controlPoints, valueField, b, cellWidth, units) {
    // check if field containing data exists..
    var filtered = controlPoints.features.filter(function (feature) {
        return feature.properties &&
            feature.properties.hasOwnProperty(valueField);
    });
    if (filtered.length !== 0) {
      // create a sample square grid
      // compared to a point grid helps visualizing the output (like a raster..)
        var samplingGrid = squareGrid(bbox(controlPoints), cellWidth, units);
        var N = samplingGrid.features.length;
        for (var i = 0; i < N; i++) {
            var zw = 0;
            var sw = 0;
            // calculate the distance from each control point to cell's centroid
            for (var j = 0; j < controlPoints.features.length; j++) {
                var d = distance(centroid(samplingGrid.features[i]), controlPoints.features[j], units);
                if (d === 0) {
                    zw = controlPoints.features[j].properties[valueField];
                }
                var w = 1.0 / Math.pow(d, b);
                sw += w;
                zw += w * controlPoints.features[j].properties[valueField];
            }
            // write IDW value for each grid cell
            samplingGrid.features[i].properties.z = zw / sw;
        }
        return samplingGrid;
    } else {
        console.log('Specified Data Field is Missing');
    }
};
