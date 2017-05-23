const { Graph, findValidEdgeRings } = require('./util');

/** Implementation of GEOSPolygonizel function (geos::operation::polygonize::Polygonizer)
 * @param FeatureCollection<LineString>: TODO: preconditions!
 * @return FeatureCollection<Polygon>
 */
module.export = function polygonize(geoJson) {
  const graph = Graph.fromGeoJson(geoJson);

  // 1. Remove dangle node
  graph.deleteDangles();

  // 2. Remove cut-edges (bridge edges)
  graph.deleteCutEdges();

  // 3. Get all holes and shells
  const holes = [],
    shells = [];

  graph.getEdgeRings().forEach(edgeRing => {
    if (edgeRing.isHole())
      holes.push(edgeRing);
    else
      shells.push(edgeRing);
  });

  // 4. Assign Holes to Shells

  // 5. EdgeRings to Polygons
};
