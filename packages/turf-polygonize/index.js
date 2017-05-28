const Graph = require('./src/Graph'),
    EdgeRing = require('./src/EdgeRing'),
    {featureCollection} = require('@turf/helpers');

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
module.exports = function polygonize(geoJson) {
    const graph = Graph.fromGeoJson(geoJson);

    // 1. Remove dangle node
    graph.deleteDangles();

    // 2. Remove cut-edges (bridge edges)
    graph.deleteCutEdges();

    // 3. Get all holes and shells
    const holes = [],
        shells = [];

    graph.getEdgeRings()
        .filter(edgeRing => edgeRing.isValid())
        .forEach(edgeRing => {
            if (edgeRing.isHole())
                holes.push(edgeRing);
            else
                shells.push(edgeRing);
        });

    // 4. Assign Holes to Shells
    holes.forEach(hole => {
        if (EdgeRing.findEdgeRingContaining(hole, shells))
            shells.push(hole);
    });

    // 5. EdgeRings to Polygons
    return featureCollection(shells.map(shell => shell.toPolygon()));
};
