import {
  FeatureCollection,
  Feature,
  Position,
  Polygon,
  GeoJsonProperties,
  Point,
} from "geojson";
import { coordAll, featureEach } from "@turf/meta";
import { getCoords } from "@turf/invariant";
import { featureCollection, isObject, isNumber } from "@turf/helpers";
import { centerMean } from "@turf/center-mean";
import { pointsWithinPolygon } from "@turf/points-within-polygon";
import { ellipse } from "@turf/ellipse";

declare interface SDEProps {
  meanCenterCoordinates: Position;
  semiMajorAxis: number;
  semiMinorAxis: number;
  numberOfFeatures: number;
  angle: number;
  percentageWithinEllipse: number;
}

declare interface StandardDeviationalEllipse extends Feature<Polygon> {
  properties: {
    standardDeviationalEllipse: SDEProps;
    [key: string]: any;
  } | null;
}

/**
 * Takes a collection of features and returns a standard deviational ellipse,
 * also known as a “directional distribution.” The standard deviational ellipse
 * aims to show the direction and the distribution of a dataset by drawing
 * an ellipse that contains about one standard deviation’s worth (~ 70%) of the
 * data.
 *
 * This module mirrors the functionality of {@link http://desktop.arcgis.com/en/arcmap/10.3/tools/spatial-statistics-toolbox/directional-distribution.htm|Directional Distribution}
 * in ArcGIS and the {@link http://arken.nmbu.no/~havatv/gis/qgisplugins/SDEllipse/|QGIS Standard Deviational Ellipse Plugin}
 *
 * **Bibliography**
 *
 * • Robert S. Yuill, “The Standard Deviational Ellipse; An Updated Tool for
 * Spatial Description,” _Geografiska Annaler_ 53, no. 1 (1971): 28–39,
 * doi:{@link https://doi.org/10.2307/490885|10.2307/490885}.
 *
 * • Paul Hanly Furfey, “A Note on Lefever’s “Standard Deviational Ellipse,”
 * _American Journal of Sociology_ 33, no. 1 (1927): 94—98,
 * doi:{@link https://doi.org/10.1086/214336|10.1086/214336}.
 *
 *
 * @function
 * @param {FeatureCollection<Point>} points GeoJSON points
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.steps=64] number of steps for the polygon
 * @param {Object} [options.properties={}] properties to pass to the resulting ellipse
 * @returns {Feature<Polygon>} an elliptical Polygon that includes approximately 1 SD of the dataset within it.
 * @example
 *
 * const bbox = [-74, 40.72, -73.98, 40.74];
 * const points = turf.randomPoint(400, {bbox: bbox});
 * const sdEllipse = turf.standardDeviationalEllipse(points);
 *
 * //addToMap
 * const addToMap = [points, sdEllipse];
 *
 */
function standardDeviationalEllipse(
  points: FeatureCollection<Point>,
  options?: {
    properties?: GeoJsonProperties;
    weight?: string;
    steps?: number;
  }
): StandardDeviationalEllipse {
  // Optional params
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const steps = options.steps || 64;
  const weightTerm = options.weight;
  const properties = options.properties || {};

  // Validation:
  if (!isNumber(steps)) throw new Error("steps must be a number");
  if (!isObject(properties)) throw new Error("properties must be a number");

  // Calculate mean center & number of features:
  const numberOfFeatures = coordAll(points).length;
  const meanCenter = centerMean(points, { weight: weightTerm });

  // Calculate angle of rotation:
  // [X, Y] = mean center of all [x, y].
  // theta = arctan( (A + B) / C )
  // A = sum((x - X)^2) - sum((y - Y)^2)
  // B = sqrt(A^2 + 4(sum((x - X)(y - Y))^2))
  // C = 2(sum((x - X)(y - Y)))

  let xDeviationSquaredSum = 0;
  let yDeviationSquaredSum = 0;
  let xyDeviationSum = 0;

  featureEach(points, function (point) {
    // weightTerm or point.properties might be undefined, hence this check.
    const weight = weightTerm ? point.properties?.[weightTerm] || 1 : 1;
    const deviation = getDeviations(getCoords(point), getCoords(meanCenter));
    xDeviationSquaredSum += Math.pow(deviation.x, 2) * weight;
    yDeviationSquaredSum += Math.pow(deviation.y, 2) * weight;
    xyDeviationSum += deviation.x * deviation.y * weight;
  });

  const bigA = xDeviationSquaredSum - yDeviationSquaredSum;
  const bigB = Math.sqrt(Math.pow(bigA, 2) + 4 * Math.pow(xyDeviationSum, 2));
  const bigC = 2 * xyDeviationSum;
  const theta = Math.atan((bigA + bigB) / bigC);
  const thetaDeg = (theta * 180) / Math.PI;

  // Calculate axes:
  // sigmaX = sqrt((1 / n - 2) * sum((((x - X) * cos(theta)) - ((y - Y) * sin(theta)))^2))
  // sigmaY = sqrt((1 / n - 2) * sum((((x - X) * sin(theta)) - ((y - Y) * cos(theta)))^2))
  let sigmaXsum = 0;
  let sigmaYsum = 0;
  let weightsum = 0;
  featureEach(points, function (point) {
    // weightTerm or point.properties might be undefined, hence this check.
    const weight = weightTerm ? point.properties?.[weightTerm] || 1 : 1;
    const deviation = getDeviations(getCoords(point), getCoords(meanCenter));
    sigmaXsum +=
      Math.pow(
        deviation.x * Math.cos(theta) - deviation.y * Math.sin(theta),
        2
      ) * weight;
    sigmaYsum +=
      Math.pow(
        deviation.x * Math.sin(theta) + deviation.y * Math.cos(theta),
        2
      ) * weight;
    weightsum += weight;
  });

  const sigmaX = Math.sqrt((2 * sigmaXsum) / weightsum);
  const sigmaY = Math.sqrt((2 * sigmaYsum) / weightsum);

  const theEllipse: Feature<Polygon> = ellipse(meanCenter, sigmaX, sigmaY, {
    units: "degrees",
    angle: thetaDeg,
    steps: steps,
    properties: properties,
  });
  const pointsWithinEllipse = pointsWithinPolygon(
    points,
    featureCollection([theEllipse])
  );
  const standardDeviationalEllipseProperties = {
    meanCenterCoordinates: getCoords(meanCenter),
    semiMajorAxis: sigmaX,
    semiMinorAxis: sigmaY,
    numberOfFeatures: numberOfFeatures,
    angle: thetaDeg,
    percentageWithinEllipse:
      (100 * coordAll(pointsWithinEllipse).length) / numberOfFeatures,
  };
  // Make sure properties object exists.
  theEllipse.properties = theEllipse.properties ?? {};
  theEllipse.properties.standardDeviationalEllipse =
    standardDeviationalEllipseProperties;

  // We have added the StandardDeviationalEllipse specific properties, so
  // confirm this to Typescript with a cast.
  return theEllipse as StandardDeviationalEllipse;
}

/**
 * Get x_i - X and y_i - Y
 *
 * @private
 * @param {Position} coordinates Array of [x_i, y_i]
 * @param {Position} center Array of [X, Y]
 * @returns {Object} { x: n, y: m }
 */
function getDeviations(coordinates: Position, center: Position) {
  return {
    x: coordinates[0] - center[0],
    y: coordinates[1] - center[1],
  };
}

export { standardDeviationalEllipse, SDEProps, StandardDeviationalEllipse };
export default standardDeviationalEllipse;
