import distance from '@turf/distance';

/**
 * Takes a bounding box and calculates the minimum square bounding box that
 * would contain the input.
 *
 * @name square
 * @param {BBox} bbox extent in [west, south, east, north] order
 * @returns {BBox} a square surrounding `bbox`
 * @example
 * var bbox = [-20, -20, -15, 0];
 * var squared = turf.square(bbox);
 *
 * //addToMap
 * var addToMap = [turf.bboxPolygon(bbox), turf.bboxPolygon(squared)]
 */
function square(bbox) {
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
            verticalMidpoint - ((east - west) / 2),
            east,
            verticalMidpoint + ((east - west) / 2)
        ];
    } else {
        var horizontalMidpoint = (west + east) / 2;
        return [
            horizontalMidpoint - ((north - south) / 2),
            south,
            horizontalMidpoint + ((north - south) / 2),
            north
        ];
    }
}

export default square;
