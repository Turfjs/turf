var flatten = require('@turf/flatten');
var featureEach = require('@turf/meta').featureEach;
var lineString = require('@turf/helpers').lineString;
var featureCollection = require('@turf/helpers').featureCollection;
var getCoords = require('@turf/invariant').getCoords;

/**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a {@link LineString}, {@link MultiLineString}, {@link MultiPolygon} or {@link Polygon}.
 *
 * @name lineSegment
 * @param {FeatureCollection|Feature<LineString|MultiLineString|MultiPolygon|Polygon>} geojson GeoJSON Polygon or LineString
 * @returns {FeatureCollection<LineString>} 2-vertex line segments
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]
 *   }
 * }
 * var segments = turf.lineSegment(polygon);
 * //=segments
 */
module.exports = function (geojson) {
    var results = [];
    var index = 0;
    featureEach(geojson, function (multiFeature) {
        featureEach(flatten(multiFeature), function (feature) {
            var coords = [];
            var type = (feature.geometry) ? feature.geometry.type : feature.type;
            switch (type) {
            case 'Polygon':
                coords = getCoords(feature);
                break;
            case 'LineString':
                coords = [getCoords(feature)];
            }
            coords.forEach(function (coord) {
                var segments = createSegments(coord, feature.properties);
                segments.forEach(function (segment) {
                    segment.id = index;
                    results.push(segment);
                    index++;
                });
            });
        });
    });
    return featureCollection(results);
};

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
 * @param {[number, number]} coords1 Point coordinate
 * @param {[number, number]} coords2 Point coordinate
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
