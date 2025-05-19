import {
  BBox,
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  Position,
} from "geojson";
import { polygon, featureCollection, isObject } from "@turf/helpers";
import { collectionOf } from "@turf/invariant";
import { cloneProperties } from "@turf/clone";
import * as d3voronoi from "d3-voronoi";

/**
 * Creates a polygon from a list of coordinates. Ensures the polygon is closed.
 *
 * @private
 * @param {Position[]} coords representing a polygon
 * @returns {Feature<Polygon>} polygon
 */
function coordsToPolygon(coords: Position[]) {
  coords = coords.slice();
  coords.push(coords[0]);
  return polygon([coords]);
}

/**
 * Takes a collection of points and a bounding box, and returns a collection
 * of Voronoi polygons.
 *
 * The Voronoi algorithim used comes from the d3-voronoi package.
 *
 * @function
 * @param {FeatureCollection<Point>} points points around which to calculate the Voronoi polygons
 * @param {Object} [options={}] Optional parameters
 * @param {BBox} [options.bbox=[-180, -85, 180, -85]] clipping rectangle, in [minX, minY, maxX, MaxY] order
 * @returns {FeatureCollection<Polygon>} a set of polygons, one per input point
 * @example
 * const options = {
 *   bbox: [-70, 40, -60, 60]
 * };
 * const points = turf.randomPoint(100, options);
 * const voronoiPolygons = turf.voronoi(points, options);
 *
 * //addToMap
 * const addToMap = [voronoiPolygons, points];
 */
function voronoi(
  points: FeatureCollection<Point>,
  options?: { bbox?: BBox }
): FeatureCollection<Polygon> {
  // Optional params
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const bbox = options.bbox || [-180, -85, 180, 85];

  // Input Validation
  if (!points) throw new Error("points is required");
  if (!Array.isArray(bbox)) throw new Error("bbox is invalid");
  collectionOf(points, "Point", "points");

  // Main
  return featureCollection(
    d3voronoi
      .voronoi<Feature<Point>>()
      .x((feature) => feature.geometry.coordinates[0])
      .y((feature) => feature.geometry.coordinates[1])
      .extent([
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ])
      .polygons(points.features)
      .map(function (coords, index) {
        return Object.assign(coordsToPolygon(coords), {
          properties: cloneProperties(points.features[index].properties),
        });
      })
  );
}

export { voronoi };
export default voronoi;
