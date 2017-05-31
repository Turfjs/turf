var polygonize = require('polygonize');

/**
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints. LineStrings must only have two coordinate points.
 *
 * Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 *
 * The implementation correctly handles:
 *
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part
 *     of a polygon.
 *
 * @name polygonize
 * @param {FeatureCollection<LineString>} lines Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} Polygons created
 */
module.exports = function (lines) {
    if (lines.type !== 'FeatureCollection') throw new Error('lines must be a FeatureCollection');
    return polygonize(lines);
};
