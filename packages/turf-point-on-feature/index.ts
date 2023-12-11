import type { Feature, Point } from "geojson";
import type { AllGeoJSON } from "@turf/helpers";
import { explode } from "@turf/explode";
import { center as centroid } from "@turf/center";
import { nearestPoint } from "@turf/nearest-point";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { featureCollection, feature, point } from "@turf/helpers";

/**
 * Takes a Feature or FeatureCollection and returns a {@link Point} guaranteed to be on the surface of the feature.
 *
 * * Given a {@link Polygon}, the point will be in the area of the polygon
 * * Given a {@link LineString}, the point will be along the string
 * * Given a {@link Point}, the point will the same as the input
 *
 * @name pointOnFeature
 * @param {GeoJSON} geojson any Feature or FeatureCollection
 * @returns {Feature<Point>} a point on the surface of `input`
 * @example
 * var polygon = turf.polygon([[
 *   [116, -36],
 *   [131, -32],
 *   [146, -43],
 *   [155, -25],
 *   [133, -9],
 *   [111, -22],
 *   [116, -36]
 * ]]);
 *
 * var pointOnPolygon = turf.pointOnFeature(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, pointOnPolygon];
 */
function pointOnFeature(geojson: AllGeoJSON): Feature<Point> {
  // normalize
  const fc = normalize(geojson);

  // get centroid
  const cent = centroid(fc);

  // check to see if centroid is on surface
  let onSurface = false;
  let i = 0;
  while (!onSurface && i < fc.features.length) {
    const geom = fc.features[i].geometry;
    let x, y, x1, y1, x2, y2;
    let onLine = false;
    if (geom.type === "Point") {
      if (
        cent.geometry.coordinates[0] === geom.coordinates[0] &&
        cent.geometry.coordinates[1] === geom.coordinates[1]
      ) {
        onSurface = true;
      }
    } else if (geom.type === "MultiPoint") {
      let onMultiPoint = false;
      let k = 0;
      while (!onMultiPoint && k < geom.coordinates.length) {
        if (
          cent.geometry.coordinates[0] === geom.coordinates[k][0] &&
          cent.geometry.coordinates[1] === geom.coordinates[k][1]
        ) {
          onSurface = true;
          onMultiPoint = true;
        }
        k++;
      }
    } else if (geom.type === "LineString") {
      let k = 0;
      while (!onLine && k < geom.coordinates.length - 1) {
        x = cent.geometry.coordinates[0];
        y = cent.geometry.coordinates[1];
        x1 = geom.coordinates[k][0];
        y1 = geom.coordinates[k][1];
        x2 = geom.coordinates[k + 1][0];
        y2 = geom.coordinates[k + 1][1];
        if (pointOnSegment(x, y, x1, y1, x2, y2)) {
          onLine = true;
          onSurface = true;
        }
        k++;
      }
    } else if (geom.type === "MultiLineString") {
      let j = 0;
      while (j < geom.coordinates.length) {
        onLine = false;
        let k = 0;
        const line = geom.coordinates[j];
        while (!onLine && k < line.length - 1) {
          x = cent.geometry.coordinates[0];
          y = cent.geometry.coordinates[1];
          x1 = line[k][0];
          y1 = line[k][1];
          x2 = line[k + 1][0];
          y2 = line[k + 1][1];
          if (pointOnSegment(x, y, x1, y1, x2, y2)) {
            onLine = true;
            onSurface = true;
          }
          k++;
        }
        j++;
      }
    } else if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
      if (booleanPointInPolygon(cent, geom)) {
        onSurface = true;
      }
    }
    i++;
  }
  if (onSurface) {
    return cent;
  } else {
    const vertices = featureCollection<Point>([]);
    for (let f = 0; f < fc.features.length; f++) {
      vertices.features = vertices.features.concat(
        explode(fc.features[f]).features
      );
    }
    // Remove distanceToPoint properties from nearestPoint()
    return point(nearestPoint(cent, vertices).geometry.coordinates);
  }
}

/**
 * Normalizes any GeoJSON to a FeatureCollection
 *
 * @private
 * @name normalize
 * @param {GeoJSON} geojson Any GeoJSON
 * @returns {FeatureCollection} FeatureCollection
 */
function normalize(geojson: AllGeoJSON) {
  if (geojson.type !== "FeatureCollection") {
    if (geojson.type !== "Feature") {
      return featureCollection([feature(geojson)]);
    }
    return featureCollection([geojson]);
  }
  return geojson;
}

function pointOnSegment(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const ab = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  const ap = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
  const pb = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
  return ab === ap + pb;
}

export { pointOnFeature };
export default pointOnFeature;
