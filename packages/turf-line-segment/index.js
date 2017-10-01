import { lineString, featureCollection } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import { flattenEach } from '@turf/meta';

/**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon}.
 *
 * @name lineSegment
 * @param {Geometry|FeatureCollection|Feature<LineString|MultiLineString|MultiPolygon|Polygon>} geojson GeoJSON Polygon or LineString
 * @returns {FeatureCollection<LineString>} 2-vertex line segments
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 * var segments = turf.lineSegment(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, segments]
 */
function lineSegment(geojson) {
    if (!geojson) throw new Error('geojson is required');

    var results = [];
    flattenEach(geojson, function (feature) {
        lineSegmentFeature(feature, results);
    });
    return featureCollection(results);
}

/**
 * Line Segment
 *
 * @private
 * @param {Feature<LineString|Polygon>} geojson Line or polygon feature
 * @param {Array} results push to results
 * @returns {void}
 */
function lineSegmentFeature(geojson, results) {
    var coords = [];
    var geometry = geojson.geometry;
    switch (geometry.type) {
    case 'Polygon':
        coords = getCoords(geometry);
        break;
    case 'LineString':
        coords = [getCoords(geometry)];
    }
    coords.forEach(function (coord) {
        var segments = createSegments(coord, geojson.properties);
        segments.forEach(function (segment) {
            segment.id = results.length;
            results.push(segment);
        });
    });
}

/**
 * Create Segments from LineString coordinates
 *
 * @private
 * @param {LineString} coords LineString coordinates
 * @param {*} properties GeoJSON properties
 * @returns {Array<Feature<LineString>>} line segments
 */
function createSegments(coords, properties) {
    var segments = [];
    coords.reduce(function (previousCoords, currentCoords) {
        var segment = lineString([previousCoords, currentCoords], properties);
        segment.bbox = bbox(previousCoords, currentCoords);
        segments.push(segment);
        return currentCoords;
    });
    return segments;
}

/**
 * Create BBox between two coordinates (faster than @turf/bbox)
 *
 * @private
 * @param {Array<number>} coords1 Point coordinate
 * @param {Array<number>} coords2 Point coordinate
 * @returns {BBox} [west, south, east, north]
 */
function bbox(coords1, coords2) {
    var x1 = coords1[0];
    var y1 = coords1[1];
    var x2 = coords2[0];
    var y2 = coords2[1];
    var west = (x1 < x2) ? x1 : x2;
    var south = (y1 < y2) ? y1 : y2;
    var east = (x1 > x2) ? x1 : x2;
    var north = (y1 > y2) ? y1 : y2;
    return [west, south, east, north];
}

export default lineSegment;
