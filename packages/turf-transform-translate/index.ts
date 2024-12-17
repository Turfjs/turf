import { FeatureCollection, GeoJSON, GeometryCollection } from "geojson";
import { coordEach, featureEach } from "@turf/meta";
import { isObject, Units } from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import { clone } from "@turf/clone";
import { rhumbDestination } from "@turf/rhumb-destination";
import { bearing } from "@turf/bearing";
import { centroid } from "@turf/centroid";
import { destination } from "@turf/destination";
import { distance } from "@turf/distance";

/**
 * Moves any geojson Feature or Geometry of a specified distance along a Rhumb Line
 * on the provided direction angle.
 *
 * @function
 * @param {GeoJSON|GeometryCollection} geojson object to be translated
 * @param {number} distance length of the motion; negative values determine motion in opposite direction
 * @param {number} direction of the motion; angle from North in decimal degrees, positive clockwise
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] in which `distance` will be express; miles, kilometers, degrees, or radians
 * @param {number} [options.zTranslation=0] length of the vertical motion, same unit of distance
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @param {boolean} [options.aroundCenter=false] when set to true, for each feature the center is translated and the geometry reconstructed around it. Otherwise, points are independently translated.
 * @returns {GeoJSON|GeometryCollection} the translated GeoJSON object
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var translatedPoly = turf.transformTranslate(poly, 100, 35);
 *
 * //addToMap
 * var addToMap = [poly, translatedPoly];
 * translatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
function transformTranslate<T extends GeoJSON | GeometryCollection>(
  geojson: T,
  distance: number,
  direction: number,
  options?: {
    units?: Units;
    zTranslation?: number;
    mutate?: boolean;
    aroundCenter?: boolean;
  }
): T {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var units = options.units;
  var zTranslation = options.zTranslation;
  var mutate = options.mutate;
  var aroundCenter = options.aroundCenter;

  // Input validation
  if (!geojson) throw new Error("geojson is required");
  if (distance === undefined || distance === null || isNaN(distance))
    throw new Error("distance is required");
  if (zTranslation && typeof zTranslation !== "number" && isNaN(zTranslation))
    throw new Error("zTranslation is not a number");

  // Shortcut no-motion
  zTranslation = zTranslation !== undefined ? zTranslation : 0;
  if (distance === 0 && zTranslation === 0) return geojson;

  if (direction === undefined || direction === null || isNaN(direction))
    throw new Error("direction is required");

  // Invert with negative distances
  if (distance < 0) {
    distance = -distance;
    direction = direction + 180;
  }

  // Clone geojson to avoid side effects
  if (mutate === false || mutate === undefined) geojson = clone(geojson);

  if (aroundCenter === false || aroundCenter === undefined) {
    // Translate each coordinate
    coordEach(geojson, function (pointCoords) {
      var newCoords = getCoords(
        rhumbDestination(pointCoords, distance, direction, { units: units })
      );
      pointCoords[0] = newCoords[0];
      pointCoords[1] = newCoords[1];
      if (zTranslation && pointCoords.length === 3)
        pointCoords[2] += zTranslation;
    });
  } else {
    /// Translate each feature using its center
    if (geojson.type === "FeatureCollection") {
      featureEach(geojson, function (feature, index) {
        // The type guard above is not recognised in the callback so we have to
        // cast to accept responsibility.
        (geojson as FeatureCollection).features[index] =
          translateAroundCentroid(
            feature,
            distance,
            direction,
            zTranslation,
            units
          );
      });
    } else {
      geojson = translateAroundCentroid(
        geojson,
        distance,
        direction,
        zTranslation,
        units
      );
    }
  }

  return geojson;
}

/**
 * Translate Feature/Geometry
 *
 * @private
 * @param {GeoJSON|GeometryCollection} feature feature or geometry collection to translate
 * @param {number} distance of translation greater than 0
 * @param {number} direction of translation
 * @param {number} zTranslation
 * @param {Units} units in which the distance is expressed
 * @returns {GeoJSON|GeometryCollection} translated GeoJSON Feature/Geometry
 */
function translateAroundCentroid<T extends GeoJSON | GeometryCollection>(
  feature: T,
  distanceTranslation: number,
  directionTranslation: number,
  zTranslation?: number,
  units?: Units
): T {
  if (
    distanceTranslation === undefined ||
    distanceTranslation === null ||
    isNaN(distanceTranslation)
  )
    throw new Error("distance is required");
  if (distanceTranslation < 0)
    throw new Error("distance should be greater than 0");
  if (
    directionTranslation === undefined ||
    directionTranslation === null ||
    isNaN(directionTranslation)
  )
    throw new Error("direction is required");
  zTranslation = zTranslation !== undefined ? zTranslation : 0;

  if (distanceTranslation === 0) return feature;

  const featureCentroid = centroid(feature);
  const newCentroid = getCoords(
    rhumbDestination(
      featureCentroid,
      distanceTranslation,
      directionTranslation,
      { units: units }
    )
  );

  // Scale each coordinate
  coordEach(feature, function (coord) {
    const originalDistance = distance(featureCentroid, coord);
    const originalBearing = bearing(featureCentroid, coord);
    const newCoord = getCoords(
      destination(newCentroid, originalDistance, originalBearing)
    );
    coord[0] = newCoord[0];
    coord[1] = newCoord[1];
    if (zTranslation && coord.length === 3) coord[2] += zTranslation;
  });

  return feature;
}

export { transformTranslate };
export default transformTranslate;
