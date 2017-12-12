import explode from '@turf/explode';
import centroid from '@turf/center';
import nearestPoint from '@turf/nearest-point';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { featureCollection, feature, point } from '@turf/helpers';

/**
 * Takes a Feature or FeatureCollection and returns a {@link Point} guaranteed to be on the surface of the feature.
 *
 * * Given a {@link Polygon}, the point will be in the area of the polygon
 * * Given a {@link LineString}, the point will be along the string
 * * Given a {@link Point}, the point will the same as the input
 *
 * @name pointOnFeature
 * @param {GeoJSON} geojson any Feature or FeatureCollection
 * @returns {Feature<Point>} a point on the surface of `input`
 * @example
 * var polygon = turf.polygon([[
 *   [116, -36],
 *   [131, -32],
 *   [146, -43],
 *   [155, -25],
 *   [133, -9],
 *   [111, -22],
 *   [116, -36]
 * ]]);
 *
 * var pointOnPolygon = turf.pointOnFeature(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, pointOnPolygon];
 */
function pointOnFeature(geojson) {
    // normalize
    var fc = normalize(geojson);

    // get centroid
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
            if (booleanPointInPolygon(cent, geom)) {
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
        // Remove distanceToPoint properties from nearestPoint()
        return point(nearestPoint(cent, vertices).geometry.coordinates);
    }
}

/**
 * Normalizes any GeoJSON to a FeatureCollection
 *
 * @private
 * @name normalize
 * @param {GeoJSON} geojson Any GeoJSON
 * @returns {FeatureCollection} FeatureCollection
 */
function normalize(geojson) {
    if (geojson.type !== 'FeatureCollection') {
        if (geojson.type !== 'Feature') {
            return featureCollection([feature(geojson)]);
        }
        return featureCollection([geojson]);
    }
    return geojson;
}

function pointOnSegment(x, y, x1, y1, x2, y2) {
    var ab = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ap = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    var pb = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
    return ab === ap + pb;
}

export default pointOnFeature;
