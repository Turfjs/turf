var polygonize = require('polygonize');

/** Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 *
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints. LineStrings must only have two coordinate
 * points.
 *
 * The implementation correctly handles:
 *
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part
 *     of a polygon.
 *
 * @param {FeatureCollection<LineString>} geoJson - Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} - Polygons created
 */
module.exports = polygonize;
