import { geomEach, coordEach } from '../meta';
import { polygon, multiPolygon, featureCollection } from '../helpers';

/**
 * Smooths a {@link Polygon}. Based on [Chaikin's algorithm](http://graphics.cs.ucdavis.edu/education/CAGDNotes/Chaikins-Algorithm/Chaikins-Algorithm.html).
 * Warning: may create degenerate polygons.
 *
 * @name polygonSmooth
 * @param {FeatureCollection<Polygon>} inputPolys to smooth
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.iterations=1] THe number of times to smooth the polygon. A higher value means a smoother polygon.
 * @returns {FeatureCollection<Polygon>} FeatureCollection containing the smoothed polygon/poylgons
 * @example
 * var polygon = turf.polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
 *
 * var smoothed = turf.polygonSmooth(polygon)
 *
 * //addToMap
 * var addToMap = [smoothed, polygon];
 */
function polygonSmooth(inputPolys, options) {
    var outPolys = [];
    // Optional parameters
    var iterations = options.iterations || 1;
    if (!inputPolys) throw new Error('inputPolys is required');

    geomEach(inputPolys, function (geom, geomIndex, properties) {
        var type = geom.type === 'Polygon' ? 'Polygon' : 'MultiPolygon';
        var outCoords = type === 'Polygon' ? [] : [[]];

        for (var i = 0; i < iterations; i++) {
            var tempOutput  = type === 'Polygon' ? [[]] : [[[]]];
            var poly = geom;
            if (i > 0) {
                poly = type === 'Polygon' ? polygon(outCoords).geometry : multiPolygon(outCoords).geometry;
            }
            if (type === 'Polygon') processPolygon(poly, tempOutput);
            else processMultiPolygon(poly, tempOutput);
            outCoords = tempOutput.slice(0);
        }
        if (type === 'Polygon') outPolys.push(polygon(outCoords, properties));
        else outPolys.push(multiPolygon(outCoords, properties));
    });
    return featureCollection(outPolys);
}

/**
 * @private
 */
function processPolygon(poly, tempOutput) {
    var prevGeomIndex = 0;
    var subtractCoordIndex = 0;
    coordEach(poly, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
        if (geometryIndex > prevGeomIndex) {
            prevGeomIndex = geometryIndex;
            subtractCoordIndex = coordIndex;
            tempOutput.push([]);
        }
        var realCoordIndex = coordIndex - subtractCoordIndex;
        var p1 = poly.coordinates[geometryIndex][realCoordIndex + 1];
        var p0x = currentCoord[0];
        var p0y = currentCoord[1];
        var p1x = p1[0];
        var p1y = p1[1];
        tempOutput[geometryIndex].push([0.75 * p0x + 0.25 * p1x, 0.75 * p0y + 0.25 * p1y]);
        tempOutput[geometryIndex].push([0.25 * p0x + 0.75 * p1x, 0.25 * p0y + 0.75 * p1y]);
    }, true);
    tempOutput.forEach(function (ring) {
        ring.push(ring[0]);
    });
}

/**
 * @private
 */
function processMultiPolygon(poly, tempOutput) {
    var prevGeomIndex = 0;
    var subtractCoordIndex = 0;
    var prevMultiIndex = 0;
    coordEach(poly, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
        if (multiFeatureIndex > prevMultiIndex) {
            prevMultiIndex = multiFeatureIndex;
            subtractCoordIndex = coordIndex;
            tempOutput.push([[]]);
        }
        if (geometryIndex > prevGeomIndex) {
            prevGeomIndex = geometryIndex;
            subtractCoordIndex = coordIndex;
            tempOutput[multiFeatureIndex].push([]);
        }
        var realCoordIndex = coordIndex - subtractCoordIndex;
        var p1 = poly.coordinates[multiFeatureIndex][geometryIndex][realCoordIndex + 1];
        var p0x = currentCoord[0];
        var p0y = currentCoord[1];
        var p1x = p1[0];
        var p1y = p1[1];
        tempOutput[multiFeatureIndex][geometryIndex].push([0.75 * p0x + 0.25 * p1x, 0.75 * p0y + 0.25 * p1y]);
        tempOutput[multiFeatureIndex][geometryIndex].push([0.25 * p0x + 0.75 * p1x, 0.25 * p0y + 0.75 * p1y]);
    }, true);

    tempOutput.forEach(function (poly) {
      poly.forEach(function (ring) {
        ring.push(ring[0]);
      });
    });
}

export default polygonSmooth;
