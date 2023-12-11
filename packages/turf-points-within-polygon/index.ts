import type {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
  MultiPoint,
  Point,
  GeoJsonProperties,
  Position,
} from "geojson";
import { booleanPointInPolygon as pointInPolygon } from "@turf/boolean-point-in-polygon";
import { featureCollection, multiPoint } from "@turf/helpers";
import { geomEach, featureEach, coordEach } from "@turf/meta";

/**
 * Finds {@link Points} or {@link MultiPoint} coordinate positions that fall within {@link (Multi)Polygon(s)}.
 *
 * @name pointsWithinPolygon
 * @param {Feature|FeatureCollection<Point|MultiPoint>} points Point(s) or MultiPoint(s) as input search
 * @param {FeatureCollection|Geometry|Feature<Polygon|MultiPolygon>} polygons (Multi)Polygon(s) to check if points are within
 * @returns {FeatureCollection<Point|MultiPoint>} Point(s) or MultiPoint(s) with positions that land within at least one polygon.  The geometry type will match what was passsed in
 * @example
 * var points = turf.points([
 *     [-46.6318, -23.5523],
 *     [-46.6246, -23.5325],
 *     [-46.6062, -23.5513],
 *     [-46.663, -23.554],
 *     [-46.643, -23.557]
 * ]);
 *
 * var searchWithin = turf.polygon([[
 *     [-46.653,-23.543],
 *     [-46.634,-23.5346],
 *     [-46.613,-23.543],
 *     [-46.614,-23.559],
 *     [-46.631,-23.567],
 *     [-46.653,-23.560],
 *     [-46.653,-23.543]
 * ]]);
 *
 * var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
 *
 * //addToMap
 * var addToMap = [points, searchWithin, ptsWithin]
 * turf.featureEach(ptsWithin, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
function pointsWithinPolygon<
  G extends Polygon | MultiPolygon,
  P extends GeoJsonProperties,
>(
  points:
    | Feature<Point | MultiPoint, P>
    | FeatureCollection<Point | MultiPoint, P>,
  polygons: Feature<G> | FeatureCollection<G> | G
): FeatureCollection<Point | MultiPoint, P> {
  const results: Feature<Point | MultiPoint, P>[] = [];
  featureEach(points, function (point) {
    let contained = false;
    if (point.geometry.type === "Point") {
      geomEach(polygons, function (polygon) {
        if (pointInPolygon(point as Feature<Point, P>, polygon)) {
          contained = true;
        }
      });
      if (contained) {
        results.push(point);
      }
    } else if (point.geometry.type === "MultiPoint") {
      var pointsWithin: Position[] = [];
      geomEach(polygons, function (polygon) {
        coordEach(point as Feature<MultiPoint>, function (pointCoord) {
          if (pointInPolygon(pointCoord, polygon)) {
            contained = true;
            pointsWithin.push(pointCoord);
          }
        });
      });
      if (contained) {
        results.push(
          multiPoint(pointsWithin, point.properties) as Feature<MultiPoint, P>
        );
      }
    } else {
      throw new Error("Input geometry must be a Point or MultiPoint");
    }
  });
  return featureCollection(results);
}

export { pointsWithinPolygon };
export default pointsWithinPolygon;
