import { distance } from "@turf/distance";
import { BBox } from "geojson";

/**
 * Takes a bounding box and calculates the minimum square bounding box that
 * would contain the input.
 *
 * @function
 * @param {BBox} bbox extent in [west, south, east, north] order
 * @returns {BBox} a square surrounding `bbox`
 * @example
 * const bbox = [-20, -20, -15, 0];
 * const squared = turf.square(bbox);
 *
 * //addToMap
 * const addToMap = [turf.bboxPolygon(bbox), turf.bboxPolygon(squared)]
 */
function square(bbox: BBox): BBox {
  var west = bbox[0];
  var south = bbox[1];
  var east = bbox[2];
  var north = bbox[3];

  var horizontalDistance = distance(bbox.slice(0, 2), [east, south]);
  var verticalDistance = distance(bbox.slice(0, 2), [west, north]);
  if (horizontalDistance >= verticalDistance) {
    var verticalMidpoint = (south + north) / 2;
    return [
      west,
      verticalMidpoint - (east - west) / 2,
      east,
      verticalMidpoint + (east - west) / 2,
    ];
  } else {
    var horizontalMidpoint = (west + east) / 2;
    return [
      horizontalMidpoint - (north - south) / 2,
      south,
      horizontalMidpoint + (north - south) / 2,
      north,
    ];
  }
}

export { square };
export default square;
