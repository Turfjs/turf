import { convex } from "@turf/convex";
import type { AllGeoJSON } from "@turf/helpers";
import { coordAll } from "@turf/meta";
import { centroid } from "@turf/centroid";
import { transformRotate } from "@turf/transform-rotate";
import { bearing } from "@turf/bearing";
import { envelope } from "@turf/envelope";
import { area } from "@turf/area";
import { distance } from "@turf/distance";
import type { Feature, Polygon } from "geojson";

/**
 * Takes any number of features and returns a rotated rectangular {@link Polygon} that encompasses all vertices.
 *
 * Based on the [geojson-minimum-bounding-rectangle](https://www.npmjs.com/package/geojson-minimum-bounding-rectangle)
 * package by Matthias Feist.
 *
 * @function
 * @param {GeoJSON} geojson input features
 * @param {boolean} [options.minimizeWidth=false] return the oriented envelope with minimal width not minimal area
 * @returns {Feature<Polygon>} a rotated rectangular Polygon feature that encompasses all vertices
 * @example
 * var features = turf.featureCollection([
 *   turf.point([-75.343, 39.984], {"name": "Location A"}),
 *   turf.point([-75.833, 39.284], {"name": "Location B"}),
 *   turf.point([-75.534, 39.123], {"name": "Location C"})
 * ]);
 *
 * var enveloped = turf.orientedEnvelope(features);
 *
 * //addToMap
 * var addToMap = [features, enveloped];
 */
function orientedEnvelope(
  geoJsonInput: AllGeoJSON,
  options: {
    minimizeWidth?: boolean;
  } = {}
): Feature<Polygon> {
  const convexHull = convex(geoJsonInput);
  if (!convexHull) {
    throw new Error(`Can't calculate orientedEnvelope for given geometry`);
  }

  const centroidCoords = centroid(convexHull);
  const allHullCoords = coordAll(convexHull);
  if (allHullCoords.length < 2) {
    throw new Error(`Can't calculate orientedEnvelope for given geometry`);
  }

  let minAngle = 0;
  let minValue = Number.MAX_SAFE_INTEGER;
  let resultPolygon = null;
  let value;
  let envelopeOfHull;

  for (let index = 0; index < allHullCoords.length - 1; index++) {
    let angle = bearing(allHullCoords[index], allHullCoords[index + 1]);

    let rotatedHull = transformRotate(convexHull, -1.0 * angle, {
      pivot: centroidCoords,
    });

    envelopeOfHull = envelope(rotatedHull);

    if (options.minimizeWidth) {
      let envelopeCoords = coordAll(envelopeOfHull);
      let side1 = distance(envelopeCoords[0], envelopeCoords[1]);
      let side2 = distance(envelopeCoords[1], envelopeCoords[2]);
      // Use the smaller side as the value for comparison
      value = Math.min(side1, side2);
    } else {
      // Calculate area of the envelope
      value = area(envelopeOfHull);
    }

    if (value < minValue) {
      minAngle = angle;
    }
  }

  if (!envelopeOfHull) {
    throw new Error(`Can't calculate orientedEnvelope for given geometry`);
  }
  resultPolygon = transformRotate(envelopeOfHull, minAngle, {
    pivot: centroidCoords,
  });

  return resultPolygon;
}

export { orientedEnvelope };
export default orientedEnvelope;
