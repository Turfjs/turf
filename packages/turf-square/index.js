var midpoint = require('turf-midpoint');
var point = require('turf-helpers').point;
var distance = require('turf-distance');

/**
 * Takes a bounding box and calculates the minimum square bounding box that would contain the input.
 *
 * @module turf/square
 * @category measurement
 * @param {Array<number>} bbox a bounding box
 * @return {Array<number>} a square surrounding `bbox`
 * @example
 * var bbox = [-20,-20,-15,0];
 *
 * var squared = turf.square(bbox);
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     turf.bboxPolygon(bbox),
 *     turf.bboxPolygon(squared)
 *   ]
 * };
 *
 * //=features
 */
module.exports = function(bbox) {
  var squareBbox = [0,0,0,0];
  var lowLeft = point([bbox[0], bbox[1]]);
  var topLeft = point([bbox[0], bbox[3]]);
  var lowRight = point([bbox[2], bbox[1]]);

  var horizontalDistance = distance(lowLeft, lowRight, 'miles');
  var verticalDistance = distance(lowLeft, topLeft, 'miles');
  if(horizontalDistance >= verticalDistance) {
    squareBbox[0] = bbox[0];
    squareBbox[2] = bbox[2];
    var verticalMidpoint = midpoint(lowLeft, topLeft);
    squareBbox[1] = verticalMidpoint.geometry.coordinates[1] - ((bbox[2] - bbox[0]) / 2);
    squareBbox[3] = verticalMidpoint.geometry.coordinates[1] + ((bbox[2] - bbox[0]) / 2);
    return squareBbox;
  } else {
    squareBbox[1] = bbox[1];
    squareBbox[3] = bbox[3];
    var horzontalMidpoint = midpoint(lowLeft, lowRight);
    squareBbox[0] = horzontalMidpoint.geometry.coordinates[0] - ((bbox[3] - bbox[1]) / 2);
    squareBbox[2] = horzontalMidpoint.geometry.coordinates[0] + ((bbox[3] - bbox[1]) / 2);
    return squareBbox;
  }
};
