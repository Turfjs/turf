var featureCollection = require('turf-helpers').featureCollection;
var centroid = require('turf-center');
var distance = require('turf-distance');
var inside = require('turf-inside');
var explode = require('turf-explode');

/**
 * Takes a feature and returns a {@link Point} guaranteed to be on the surface of the feature.
 *
 * * Given a {@link Polygon}, the point will be in the area of the polygon
 * * Given a {@link LineString}, the point will be along the string
 * * Given a {@link Point}, the point will the same as the input
 *
 * @param {(Feature|FeatureCollection)} fc any feature or set of features
 * @returns {Feature} a point on the surface of `input`
 * @example
 * // create a random polygon
 * var polygon = turf.random('polygon');
 *
 * //=polygon
 *
 * var pointOnPolygon = turf.pointOnSurface(polygon);
 *
* var resultFeatures = polygon.features.concat(pointOnPolygon);
* var result = {
*   "type": "FeatureCollection",
*   "features": resultFeatures
* };
 *
 * //=result
 */
function pointOnSurface(fc) {
    // normalize
    if (fc.type !== 'FeatureCollection') {
        if (fc.type !== 'Feature') {
            fc = {
                type: 'Feature',
                geometry: fc,
                properties: {}
            };
        }
        fc = featureCollection([fc]);
    }

    //get centroid
    var cent = centroid(fc);

    // check to see if centroid is on surface
    var onSurface = false;
    var i = 0;
    while (!onSurface && i < fc.features.length) {
        var geom = fc.features[i].geometry;
        var x, y, x1, y1, x2, y2, k;
        var onLine = false;
        if (geom.type === 'Point') {
            if (cent.geometry.coordinates[0] === geom.coordinates[0] &&
        cent.geometry.coordinates[1] === geom.coordinates[1]) {
                onSurface = true;
            }
        } else if (geom.type === 'MultiPoint') {
            var onMultiPoint = false;
            k = 0;
            while (!onMultiPoint && k < geom.coordinates.length) {
                if (cent.geometry.coordinates[0] === geom.coordinates[k][0] &&
          cent.geometry.coordinates[1] === geom.coordinates[k][1]) {
                    onSurface = true;
                    onMultiPoint = true;
                }
                k++;
            }
        } else if (geom.type === 'LineString') {
            k = 0;
            while (!onLine && k < geom.coordinates.length - 1) {
                x = cent.geometry.coordinates[0];
                y = cent.geometry.coordinates[1];
                x1 = geom.coordinates[k][0];
                y1 = geom.coordinates[k][1];
                x2 = geom.coordinates[k + 1][0];
                y2 = geom.coordinates[k + 1][1];
                if (pointOnSegment(x, y, x1, y1, x2, y2)) {
                    onLine = true;
                    onSurface = true;
                }
                k++;
            }
        } else if (geom.type === 'MultiLineString') {
            var j = 0;
            while (j < geom.coordinates.length) {
                onLine = false;
                k = 0;
                var line = geom.coordinates[j];
                while (!onLine && k < line.length - 1) {
                    x = cent.geometry.coordinates[0];
                    y = cent.geometry.coordinates[1];
                    x1 = line[k][0];
                    y1 = line[k][1];
                    x2 = line[k + 1][0];
                    y2 = line[k + 1][1];
                    if (pointOnSegment(x, y, x1, y1, x2, y2)) {
                        onLine = true;
                        onSurface = true;
                    }
                    k++;
                }
                j++;
            }
        } else if (geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
            var f = {
                type: 'Feature',
                geometry: geom,
                properties: {}
            };
            if (inside(cent, f)) {
                onSurface = true;
            }
        }
        i++;
    }
    if (onSurface) {
        return cent;
    } else {
        var vertices = featureCollection([]);
        for (i = 0; i < fc.features.length; i++) {
            vertices.features = vertices.features.concat(explode(fc.features[i]).features);
        }
        var closestVertex;
        var closestDistance = Infinity;
        for (i = 0; i < vertices.features.length; i++) {
            var dist = distance(cent, vertices.features[i], 'miles');
            if (dist < closestDistance) {
                closestDistance = dist;
                closestVertex = vertices.features[i];
            }
        }
        return closestVertex;
    }
}

function pointOnSegment(x, y, x1, y1, x2, y2) {
    var ab = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ap = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    var pb = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
    if (ab === ap + pb) {
        return true;
    }
}

module.exports = pointOnSurface;
