const { Graph } = require('./util');
/** Implementation of GEOSPolygonizel function (geos::operation::polygonize::Polygonizer)
 * @param FeatureCollection<LineString>: TODO: preconditions!
 * @return FeatureCollection<Polygon>
 */
module.export = function polygonize(geoJson) {
  const graph = Graph.fromGeoJson(geoJson);

  graph.deleteDangles();
  graph.deleteCutEdges();
};
