import distance from '@turf/distance';
import turfBBox from '@turf/bbox';
import { point, featureCollection } from '@turf/helpers';
import inside from '@turf/inside';
import { getType } from '@turf/invariant';

/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {Array<number>|FeatureCollection|Feature<any>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide the distance between points
 * @param {string} [units=kilometers] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {boolean} [centered=true] adjust points position to center the grid into bbox. **This parameter is going to be removed** in the next major release, having the output always centered into bbox.
 * @param {boolean} [bboxIsMask=false] if true, and bbox is a Polygon or MultiPolygon, the grid Point will be created
 * only if inside the bbox Polygon(s)
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSide = 3;
 * var units = 'miles';
 *
 * var grid = turf.pointGrid(extent, cellSide, units);
 *
 * //addToMap
 * var addToMap = [grid];
 */
export default function (bbox, cellSide, units, centered, bboxIsMask) {
    var results = [];

    var bboxMask = bbox;
    // validation
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');

    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    var xFraction = cellSide / (distance(point([west, south]), point([east, south]), units));
    var cellWidth = xFraction * (east - west);
    var yFraction = cellSide / (distance(point([west, south]), point([west, north]), units));
    var cellHeight = yFraction * (north - south);

    if (centered !== false) {
        var bboxHorizontalSide = (east - west);
        var bboxVerticalSide = (north - south);
        var columns = Math.floor(bboxHorizontalSide / cellWidth);
        var rows = Math.floor(bboxVerticalSide / cellHeight);
        // adjust origin of the grid
        var deltaX = (bboxHorizontalSide - columns * cellWidth) / 2;
        var deltaY = (bboxVerticalSide - rows * cellHeight) / 2;
    }

    var isPoly = !Array.isArray(bboxMask) && (getType(bboxMask) === 'Polygon' || getType(bboxMask) === 'MultiPolygon');

    var currentX = west;
    if (centered !== false) currentX += deltaX;
    while (currentX <= east) {
        var currentY = south;
        if (centered !== false) currentY += deltaY;
        while (currentY <= north) {
            var pt = point([currentX, currentY]);
            if (bboxIsMask === true && isPoly) {
                if (inside(pt, bboxMask)) {
                    results.push(pt);
                }
            } else {
                results.push(pt);
            }
            currentY += cellHeight;
        }
        currentX += cellWidth;
    }

    return featureCollection(results);
}
