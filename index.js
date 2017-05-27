const { Graph, EdgeRing } = require('./util'),
  { featureCollection } = require('@turf/helpers');

/** Implementation of GEOSPolygonizel function (geos::operation::polygonize::Polygonizer)
 *
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints.
 *
 * LineStrings must only have to coordinate points.
 *
 * @param {FeatureCollection<LineString>} geoJson - Lines in order to polygonize
 * @return {FeatureCollection<Polygon>}
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
