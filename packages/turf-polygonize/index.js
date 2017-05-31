var polygonize = require('polygonize');
var lineSegment = require('@turf/line-segment');

/**
 * Polygonizes {@link LineString|(Multi)LineString(s)} into {@link Polygons}.
 *
 * Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 *
 * The implementation correctly handles:
 *
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part of a polygon.
 *
 * @name polygonize
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} lines Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} Polygons created
 */
module.exports = function (lines) {
    return polygonize(lineSegment(lines));
};
