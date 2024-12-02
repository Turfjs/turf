import { Feature, GeoJsonProperties, Point } from "geojson";
import {
  point,
  degreesToRadians,
  radiansToDegrees,
  earthRadius,
  AllGeoJSON,
} from "@turf/helpers";
import { coordEach } from "@turf/meta";

/**
 * Computes the centroid as the mean of all vertices within the object.
 *
 * @function
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] an Object that is used as the {@link Feature}'s properties
 * @returns {Feature<Point>} the centroid of the input object
 * @example
 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
 *
 * var centroid = turf.centroid(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, centroid]
 */
function centroid<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: AllGeoJSON,
  options: {
    properties?: P;
  } = {}
): Feature<Point, P> {
  let xSum = 0;
  let ySum = 0;
  let zSum = 0;
  let len = 0;
  coordEach(
    geojson,
    function (coord) {
      xSum +=
        Math.cos(degreesToRadians(coord[0])) *
        Math.cos(degreesToRadians(coord[1])) *
        earthRadius;
      ySum +=
        Math.sin(degreesToRadians(coord[0])) *
        Math.cos(degreesToRadians(coord[1])) *
        earthRadius;
      zSum += Math.sin(degreesToRadians(coord[1])) * earthRadius;
      len++;
    },
    true
  );
  return point(
    [
      radiansToDegrees(Math.atan2(ySum / len, xSum / len)),
      radiansToDegrees(
        Math.asin(
          zSum /
            len /
            Math.sqrt(
              Math.pow(xSum / len, 2) +
                Math.pow(ySum / len, 2) +
                Math.pow(zSum / len, 2)
            )
        )
      ),
    ],
    options.properties
  );
}

export { centroid };
export default centroid;
