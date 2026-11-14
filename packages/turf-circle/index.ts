import { GeoJsonProperties, Feature, Point, Polygon } from "geojson";
import { destination } from "@turf/destination";
import {
  calculateNumberOfRegularPolygonSidesToApproximateCircle,
  calculatePolygonCircumRadius,
  ArcApproximationMethod,
  polygon,
  Units,
} from "@turf/helpers";

/**
 * Takes a {@link Point} and calculates the circle polygon given a radius in {@link https://turfjs.org/docs/api/types/Units Units}; and steps for precision.
 *
 * @function
 * @param {Feature<Point>|number[]} center center point
 * @param {number} radius radius of the circle
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.steps=64] number of steps
 * @param {number} [options.arcTolerance] if provided, will ignore steps and use a number of steps such that the returned approximate regular polygon is at most this far away from the true circle
 * @param {ArcApproximationMethod} [options.method='equalarea'] how the returned regular polygon approximates the circle: 'inscribed' places every vertex on the circle, 'circumscribed' places every edge tangent to the circle, and 'equalarea' matches the polygon's area to the circle's area
 * @param {Units} [options.units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} circle polygon
 * @example
 * var center = [-75.343, 39.984];
 * var radius = 5;
 * var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
 * var circle = turf.circle(center, radius, options);
 *
 * //addToMap
 * var addToMap = [turf.point(center), circle]
 */
function circle<P extends GeoJsonProperties = GeoJsonProperties>(
  center: number[] | Point | Feature<Point, P>,
  radius: number,
  options: {
    steps?: number;
    arcTolerance?: number;
    method?: ArcApproximationMethod;
    units?: Units;
    properties?: P;
  } = {}
): Feature<Polygon, P> {
  // default params
  const method = options.method ?? "equalarea";
  let steps = options.steps ?? 64;
  if (options.arcTolerance && options.arcTolerance > 0) {
    steps = calculateNumberOfRegularPolygonSidesToApproximateCircle(
      radius,
      options.arcTolerance,
      method
    );
  }

  const circumRadius = calculatePolygonCircumRadius(radius, steps, method);
  const properties = (options.properties ??
    (!Array.isArray(center) && center.type === "Feature"
      ? center.properties
      : {}) ??
    {}) as P;

  // main
  const coordinates = [];
  for (let i = 0; i < steps; i++) {
    coordinates.push(
      destination(center, circumRadius, (i * -360) / steps, options).geometry
        .coordinates
    );
  }
  coordinates.push(coordinates[0]);

  return polygon([coordinates], properties);
}

export { circle };
export default circle;
