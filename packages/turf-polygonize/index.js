import polygonize from 'polygonize';

/**
 * Polygonizes {@link LineString|(Multi)LineString(s)} into {@link Polygons}. Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints. (NOTE: while TurfJS has no specific function, an easy way to
 * ensure this is to use the QGis library and call unaryUnion() on the set of input geometries and then pass the
 * result to turf-polygonize).
 * The implementation correctly handles:
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part of a polygon.
 *
 * @name polygonize
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} geojson Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} Polygons created
 * @throws {Error} if GeoJSON is invalid.
 * @example
 * var lines = {
 *  "type": "FeatureCollection",
 *  "features": [
 *    {
 *      "type": "Feature",
 *      "properties": {},
 *      "geometry": {
 *        "type": "LineString",
 *        "coordinates": [
 *          [
 *            119.00390625,
 *            -22.024545601240337
 *          ],
 *          [
 *            120.58593749999999,
 *            -28.613459424004414
 *          ],
 *          [
 *            125.595703125,
 *            -32.99023555965107
 *          ],
 *          [
 *            133.330078125,
 *            -32.99023555965107
 *          ],
 *          [
 *            142.646484375,
 *            -30.977609093348676
 *          ],
 *          [
 *            142.294921875,
 *            -24.126701958681668
 *          ],
 *          [
 *            139.04296875,
 *            -16.299051014581817
 *          ],
 *          [
 *            128.84765625,
 *            -15.199386048559994
 *          ]
 *        ]
 *      }
 *    },
 *    {
 *      "type": "Feature",
 *      "properties": {},
 *      "geometry": {
 *        "type": "LineString",
 *        "coordinates": [
 *          [
 *            142.646484375,
 *            -30.977609093348676
 *          ],
 *          [
 *            132.451171875,
 *            -27.449790329784214
 *          ],
 *          [
 *            128.671875,
 *            -23.1605633090483
 *          ],
 *          [
 *            119.00390625,
 *            -22.024545601240337
 *          ]
 *        ]
 *      }
 *    }
 *  ]
 * }
 * var outPolygon = turf.polygonize(lines)
 * //addToMap
 * var addToMap = [lines, outPolygon];
 */
export default polygonize;
