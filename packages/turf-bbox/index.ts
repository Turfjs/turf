import { BBox } from "geojson";
import { AllGeoJSON } from "@turf/helpers";
import { coordEach } from "@turf/meta";

/**
 * Calculates the bounding box for any GeoJSON object, including FeatureCollection.
 * Uses geojson.bbox if available and options.recompute is not set.
 *
 * @name bbox
 * @param {GeoJSON} geojson any GeoJSON object
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.recompute] Whether to ignore an existing bbox property on geojson
 * @returns {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
function bbox(
  geojson: AllGeoJSON,
  options: {
    recompute?: boolean;
  } = {}
): BBox {
  if (geojson.bbox != null && true !== options.recompute) {
    return geojson.bbox;
  }
  const result: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  coordEach(geojson, (coord) => {
    if (result[0] > coord[0]) {
      result[0] = coord[0];
    }
    if (result[1] > coord[1]) {
      result[1] = coord[1];
    }
    if (result[2] < coord[0]) {
      result[2] = coord[0];
    }
    if (result[3] < coord[1]) {
      result[3] = coord[1];
    }
  });
  return result;
}

bbox["default"] = bbox;
export default bbox;
