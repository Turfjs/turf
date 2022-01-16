import {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  Polygon,
} from "geojson";
import { featureCollection } from "@turf/helpers";
import Graph from "./lib/Graph";
import EdgeRing from "./lib/EdgeRing";

/**
 * Polygonizes {@link LineString|(Multi)LineString(s)} into {@link Polygons}.
 *
 * Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).
 *
 * Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
 * noded, i.e., they must only meet at their endpoints.
 *
 * The implementation correctly handles:
 *
 * - Dangles: edges which have one or both ends which are not incident on another edge endpoint.
 * - Cut Edges (bridges): edges that are connected at both ends but which do not form part of a polygon.
 *
 * @name polygonize
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} geoJson Lines in order to polygonize
 * @returns {FeatureCollection<Polygon>} Polygons created
 * @throws {Error} if geoJson is invalid.
 */
export default function polygonize<T extends LineString | MultiLineString>(
  geoJson: Feature<T> | FeatureCollection<T> | T
): FeatureCollection<Polygon> {
  const graph = Graph.fromGeoJson(geoJson);

  // 1. Remove dangle node
  graph.deleteDangles();

  // 2. Remove cut-edges (bridge edges)
  graph.deleteCutEdges();

  // 3. Get all holes and shells
  const holes: EdgeRing[] = [],
    shells: EdgeRing[] = [];

  graph
    .getEdgeRings()
    .filter((edgeRing) => edgeRing.isValid())
    .forEach((edgeRing) => {
      if (edgeRing.isHole()) holes.push(edgeRing);
      else shells.push(edgeRing);
    });

  // 4. Assign Holes to Shells
  holes.forEach((hole) => {
    if (EdgeRing.findEdgeRingContaining(hole, shells)) shells.push(hole);
  });

  // 5. EdgeRings to Polygons
  return featureCollection(shells.map((shell) => shell.toPolygon()));
}
