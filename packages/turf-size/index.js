/**
 * Takes a bounding box and returns a new bounding box with a size expanded or contracted
 * by a factor of X.
 *
 * @module turf/size
 * @category measurement
 * @param {Array<number>} bbox a bounding box
 * @param {Number} factor the ratio of the new bbox to the input bbox
 * @return {Array<number>} the resized bbox
 * @example
 * var bbox = [0, 0, 10, 10]
 *
 * var resized = turf.size(bbox, 2);
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     turf.bboxPolygon(bbox),
 *     turf.bboxPolygon(resized)
 *   ]
 * };
 *
 * //=features
 */
module.exports = function(bbox, factor) {
  var currentXDistance = (bbox[2] - bbox[0]);
  var currentYDistance = (bbox[3] - bbox[1]);
  var newXDistance = currentXDistance * factor;
  var newYDistance = currentYDistance * factor;
  var xChange = newXDistance - currentXDistance;
  var yChange = newYDistance - currentYDistance;

  var lowX = bbox[0] - (xChange / 2);
  var lowY = bbox[1] - (yChange / 2);
  var highX = (xChange / 2) + bbox[2];
  var highY = (yChange / 2) + bbox[3];

  var sized = [lowX, lowY, highX, highY];
  return sized;
};
