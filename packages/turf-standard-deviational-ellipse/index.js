import { coordAll, featureEach } from '@turf/meta';
import { getCoords } from '@turf/invariant';
import { radiansToLength, radiansToDegrees } from '@turf/helpers';
import centerMean from '@turf/center-mean';
import pointsWithinPolygon from '@turf/points-within-polygon';
import ellipse from '@turf/ellipse';

/**
 * Takes a {@link FeatureCollection} and returns a standard deviational ellipse,
 * also known as a “directional distribution.” The standard deviational ellipse
 * aims to show the direction and the distribution of a dataset by drawing
 * an ellipse that contains about one standard deviation’s worth (~ 70%) of the
 * data. 
 * 
 * This module was created in consultation with the following articles:
 *
 * • Robert S. Yuill, “The Standard Deviational Ellipse; An Updated Tool for 
 * Spatial Description,” _Geografiska Annaler_ 53, no. 1 (1971): 28–39, 
 * doi:{@link https://doi.org/10.2307/490885|10.2307/490885}.
 *
 * • Paul Hanly Furfey, “A Note on Lefever’s “Standard Deviational Ellipse,” 
 * _American Journal of Sociology_ 33, no. 1 (1927): 94—98, 
 * doi:{@link https://doi.org/10.1086/214336|10.1086/214336}.
 *
 * It mirrors the functionality of {@link http://desktop.arcgis.com/en/arcmap/10.3/tools/spatial-statistics-toolbox/directional-distribution.htm|Directional Distribution} in ArcGIS and the {@link http://arken.nmbu.no/~havatv/gis/qgisplugins/SDEllipse/|QGIS Standard Deviational Ellipse Plugin}.
 *
 * @name standardDeviationalEllipse
 * @param {Geometry|FeatureCollection<Point>} points GeoJSON points
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.weight] the property name used to weight the center
 * @param {number} [options.steps=64] number of steps for the polygon
 * @param {Object} [options.properties={}] properties to pass to the resulting ellipse
 * @returns {Feature<Polygon>} an elliptical Polygon that includes approximately 1 SD of the dataset within it.
 * @example
 *
 * var bbox = [-74, 40.72, -73.98, 40.74];
 * var points = turf.randomPoint(400, {bbox: bbox});
 * var sdEllipse = turf.standardDeviationalEllipse(points, options);
 * 
 * //addToMap
 * var addToMap = [points, sdEllipse];
 *
 */
function standardDeviationalEllipse(points, options) {
    // Optional params
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var steps = options.steps || 64;
    var weight = options.weight;
    var properties = options.properties || {};

    // Validation:
    if (!isNumber(steps)) throw new Error('steps must be a number');
    if (!isObject(properties)) throw new Error('properties must be a number');

    // Calculate mean center:
    var meanCenter = centerMean(points, {weight: weight});

    // Calculate angle of rotation:
    // [X, Y] = mean center of all [x, y].
    // theta = arctan( (A + B) / C )
    // A = sum((x - X)^2) - sum((y - Y)^2)
    // B = sqrt(A^2 + 4(sum((x - X)(y - Y))^2))
    // C = 2(sum((x - X)(y - Y)))

    var xDeviationSquaredSum = 0;
    var yDeviationSquaredSum = 0;
    var xyDeviationSum = 0;

    featureEach(points, function(point){
      xDeviation = getCoords(point)[0] - getCoords(theMeanCenter)[0];
      yDeviation = getCoords(point)[1] - getCoords(theMeanCenter)[1];
      xDeviationSquaredSum += Math.pow(xDeviation, 2);
      yDeviationSquaredSum += Math.pow(yDeviation, 2);
      xyDeviationSum += xDeviation * yDeviation;
    });

    var bigA = xDeviationSquaredSum - yDeviationSquaredSum;
    var bigB = Math.sqrt(Math.pow(bigA, 2) + 4 * Math.pow(xyDeviationSum, 2));
    var bigC = 2 * xyDeviationSum;
    var theta = Math.atan((bigA + bigB) / bigC);

    // Calculate axes:
    // sigmaX = sqrt((1 / n - 2) * sum((((x - X) * cos(theta)) - ((y - Y) * sin(theta)))^2))
    // sigmaY = sqrt((1 / n - 2) * sum((((x - X) * sin(theta)) - ((y - Y) * cos(theta)))^2))
    var sigmaXsum = 0;
    var sigmaYsum = 0;
    featureEach(points, function(point){
      xDeviation = getCoords(point)[0] - getCoords(theMeanCenter)[0];
      yDeviation = getCoords(point)[1] - getCoords(theMeanCenter)[1];
      sigmaXsum += Math.pow((xDeviation * Math.cos(theta)) - (yDeviation * Math.sin(theta)), 2);
      sigmaYsum += Math.pow((xDeviation * Math.sin(theta)) - (yDeviation * Math.cos(theta)), 2);
    });

    var sigmaX = Math.sqrt(sigmaXsum * (1 / (n)));
    var sigmaY = Math.sqrt(sigmaYsum * (1 / (n)));
    sigmaX = radiansToLength(degreesToRadians(sigmaX));
    sigmaY = radiansToLength(degreesToRadians(sigmaY));

    theta = radiansToDegrees(theta);
    var semiMajorAxis, semiMinorAxis;
    if (sigmaX > sigmaY) {
      semiMajorAxis = sigmaX;
      semiMinorAxis = sigmaY;
    } else {
      semiMinorAxis = sigmaX;
      semiMajorAxis = sigmaY;
      theta = theta - 90;
    }

    var theEllipse = ellipse(meanCenter, semiMajorAxis, semiMinorAxis, {angle: theta, steps: steps, properties: properties});
    var eccentricity = (Math.sqrt(Math.pow(semiMajorAxis, 2) - Math.pow(semiMinorAxis, 2))) / semiMajorAxis;
    var pointsWithinEllipse = pointsWithinPolygon(points, turf.featureCollection([theEllipse]));
    var standardDeviationalEllipseProperties = {
        meanCenterCoordinates: getCoord(theMeanCenter),
        semiMajorAxis: semiMajorAxis,
        semiMinorAxis: semiMinorAxis,
        angle: theta,
        eccentricity: eccentricity,
        pctWithinEllipse: 100 * turf.coordAll(pointsWithinEllipse).length / n
    };
    theEllipse.properties.standardDeviationalEllipse = standardDeviationalEllipseProperties;

    return theEllipse;
};

export default standardDeviationalEllipse;
