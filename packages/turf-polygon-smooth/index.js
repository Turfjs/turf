import { coordEach, geomEach } from '@turf/meta';
import { featureCollection, polygon, isObject } from '@turf/helpers';

/**
 * Smooths a {@link Polygon}. Based on [Chaikin's algorithm](http://graphics.cs.ucdavis.edu/education/CAGDNotes/Chaikins-Algorithm/Chaikins-Algorithm.html).
 * Warning: may create degenerate polygons.
 *
 * @name polygonSmooth
 * @param {FeatureCollection<Polygon>} inputPolys to smooth
 * @param {Object} [options] Optional parameters
 * @param {string} [options.iterations] THe number of times to smooth the polygon. A higher value means a smoother polygon.
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
    options = options || {iterations: 1};
    if (!isObject(options)) throw new Error('options is invalid');
    if (!inputPolys) throw new Error('inputPolys is required');

    geomEach(inputPolys, function (geom, geomIndex, properties) {
        var outCoords = [];
        for (var i = 0; i < options.iterations; i++) {
            var tempOutput = [];
            var poly = geom;
            if (i > 0) {
                poly = polygon([outCoords]).geometry;
            }
            coordEach(poly, function (currentCoord, currentIndex) {

                var p1 = poly.coordinates[0][currentIndex + 1];
                var p0x = currentCoord[0];
                var p0y = currentCoord[1];
                var p1x = p1[0];
                var p1y = p1[1];

                tempOutput.push([0.75 * p0x + 0.25 * p1x, 0.75 * p0y + 0.25 * p1y]);
                tempOutput.push([0.25 * p0x + 0.75 * p1x, 0.25 * p0y + 0.75 * p1y]);

            }, true);
            tempOutput.push(tempOutput[0]);
            outCoords = tempOutput.slice(0);
        }
        outPolys.push(polygon([outCoords], properties));
    });
    return featureCollection(outPolys);
}

export default polygonSmooth;
