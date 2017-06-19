var bbox = require('@turf/bbox');
var distance = require('@turf/distance');
var centroid = require('@turf/centroid');
var squareGrid = require('@turf/square-grid');

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
 * @param {number} weight Exponent regulating the distance-decay weighting
 * @param {number} cellWidth The distance across each cell
 * @param {string} [units=kilometers] used in calculating cellSize, can be degrees, radians, miles, or kilometers
 * @returns {FeatureCollection<Polygon>} grid A grid of polygons with a property field named as `valueField`
 */
module.exports = function (controlPoints, valueField, weight, cellWidth, units) {
    // validation
    if (!valueField) throw new Error('valueField is required');
    if (weight === undefined || weight === null) throw new Error('weight is required');
    if (cellWidth === undefined || cellWidth === null) throw new Error('cellWidth is required');

    // check if field containing data exists.
    var filtered = controlPoints.features.filter(function (feature) {
        return feature.properties &&
            feature.properties.hasOwnProperty(valueField);
    });
    if (filtered.length === 0) throw new Error('Specified Data Field is Missing');

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
            var w = 1.0 / Math.pow(d, weight);
            sw += w;
            zw += w * controlPoints.features[j].properties[valueField];
        }
        // write IDW value for each grid cell
        samplingGrid.features[i].properties[valueField] = zw / sw;
    }
    return samplingGrid;
};
