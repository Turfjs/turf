var flatten = require('@turf/flatten');
var featureEach = require('@turf/meta').featureEach;
var lineString = require('@turf/helpers').lineString;
var featureCollection = require('@turf/helpers').featureCollection;
var getCoords = require('@turf/invariant').getCoords;

/**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a {@link LineString}, {@link MultiLineString}, {@link MultiPolygon} or {@link Polygon}.
 *
 * @name lineSegment
 * @param {Feature<LineString|MultiLineString|MultiPolygon|Polygon>} geojson input GeoJSON Feature
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
    featureEach(geojson, function (multiFeature) {
        featureEach(flatten(multiFeature), function (feature) {
            var linestrings;
            var type = (feature.geometry) ? feature.geometry.type : feature.type;
            switch (type) {
            case 'Polygon':
                linestrings = getCoords(feature);
                break;
            case 'LineString':
                linestrings = [getCoords(feature)];
            }
            linestrings.forEach(function (linestring) {
                linestring.reduce(function (previousCoords, currentCoords) {
                    results.push(lineString([previousCoords, currentCoords], feature.properties));
                    return currentCoords;
                });
            });
        });
    });
    return featureCollection(results);
};
