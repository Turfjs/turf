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

  // Spans are compared in degrees, the same units they are grown in below, so
  // that the result always surrounds the input.
  var horizontalSpan = east - west;
  var verticalSpan = north - south;
  if (horizontalSpan >= verticalSpan) {
    var verticalMidpoint = (south + north) / 2;
    return [
      west,
      verticalMidpoint - horizontalSpan / 2,
      east,
      verticalMidpoint + horizontalSpan / 2,
    ];
  } else {
    var horizontalMidpoint = (west + east) / 2;
    return [
      horizontalMidpoint - verticalSpan / 2,
      south,
      horizontalMidpoint + verticalSpan / 2,
      north,
    ];
  }
}

export { square };
export default square;
