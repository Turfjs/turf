import { coordEach } from "@turf/meta";
import { point, AllGeoJSON, Feature, Point, Properties } from "@turf/helpers";

/**
 * Takes one or more features and calculates the centroid using the mean of all vertices.
 * This lessens the effect of small islands and artifacts when calculating the centroid of a set of polygons.
 *
 * @name centroid
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] an Object that is used as the {@link Feature}'s properties
 * @returns {Feature<Point>} the centroid of the input features
 * @example
 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
 *
 * var centroid = turf.centroid(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, centroid]
 */
function centroid<P = Properties>(
  geojson: AllGeoJSON,
  options: {
    properties?: P;
  } = {}
): Feature<Point, P> {
  let xSum = 0;
  let ySum = 0;
  let len = 0;
  coordEach(
    geojson,
    function (coord) {
      xSum += coord[0];
      ySum += coord[1];
      len++;
    },
    true
  );
  return point([xSum / len, ySum / len], options.properties);
}

export default centroid;
