import { Feature, FeatureCollection, Point } from "geojson";
import { Coord, Units } from "@turf/helpers";
import clone from "@turf/clone";
import distance from "@turf/distance";
import { featureEach } from "@turf/meta";

export interface NearestPoint extends Feature<Point> {
  properties: {
    featureIndex: number;
    distanceToPoint: number;
    [key: string]: any;
  };
}

/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @name nearestPoint
 * @param {Coord} targetPoint the reference point
 * @param {FeatureCollection<Point>} points against input point set
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] the units of the numeric result
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
function nearestPoint(
  targetPoint: Coord,
  points: FeatureCollection<Point>,
  options: {
    units?: Units;
  } = {}
): NearestPoint {
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

export default nearestPoint;
