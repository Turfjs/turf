import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { Coord, Units } from "@turf/helpers";
import { clone } from "@turf/clone";
import { distance } from "@turf/distance";
import { featureEach } from "@turf/meta";

interface NearestPoint<P extends GeoJsonProperties = GeoJsonProperties>
  extends Feature<Point> {
  properties: {
    featureIndex: number;
    distanceToPoint: number;
  } & P;
}

/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @function
 * @param {Coord} targetPoint the reference point
 * @param {FeatureCollection<Point>} points against input point set
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] the units of the numeric result. Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @returns {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var targetPoint = turf.point([28.965797, 41.010086], {"marker-color": "#0F0"});
 * var points = turf.featureCollection([
 *     turf.point([28.973865, 41.011122]),
 *     turf.point([28.948459, 41.024204]),
 *     turf.point([28.938674, 41.013324])
 * ]);
 *
 * var nearest = turf.nearestPoint(targetPoint, points);
 *
 * //addToMap
 * var addToMap = [targetPoint, points, nearest];
 * nearest.properties['marker-color'] = '#F00';
 */
function nearestPoint<P extends GeoJsonProperties = GeoJsonProperties>(
  targetPoint: Coord,
  points: FeatureCollection<Point, P>,
  options: {
    units?: Units;
  } = {}
): NearestPoint<P> {
  // Input validation
  if (!targetPoint) throw new Error("targetPoint is required");
  if (!points) throw new Error("points is required");

  let minDist = Infinity;
  let bestFeatureIndex = 0;
  featureEach(points, (pt, featureIndex) => {
    const distanceToPoint = distance(targetPoint, pt, options);
    if (distanceToPoint < minDist) {
      bestFeatureIndex = featureIndex;
      minDist = distanceToPoint;
    }
  });
  const nearestPoint = clone(points.features[bestFeatureIndex]);

  return {
    ...nearestPoint,
    properties: {
      ...nearestPoint.properties,
      featureIndex: bestFeatureIndex,
      distanceToPoint: minDist,
    },
  };
}

export { nearestPoint, NearestPoint };
export default nearestPoint;
