var distance = require('turf-distance');

/**
 * Takes a bounding box and calculates the minimum square bounding box that
 * would contain the input.
 *
 * @name square
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
module.exports = function (bbox) {
    var horizontalDistance = distance(bbox.slice(0, 2), [bbox[2], bbox[1]], 'miles');
    var verticalDistance = distance(bbox.slice(0, 2), [bbox[0], bbox[3]], 'miles');
    if (horizontalDistance >= verticalDistance) {
        var verticalMidpoint = (bbox[1] + bbox[3]) / 2;
        return [
            bbox[0],
            verticalMidpoint - ((bbox[2] - bbox[0]) / 2),
            bbox[2],
            verticalMidpoint + ((bbox[2] - bbox[0]) / 2)
        ];
    } else {
        var horizontalMidpoint = (bbox[0] + bbox[2]) / 2;
        return [
            horizontalMidpoint - ((bbox[3] - bbox[1]) / 2),
            bbox[1],
            horizontalMidpoint + ((bbox[3] - bbox[1]) / 2),
            bbox[3]
        ];
    }
};
