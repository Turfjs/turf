import distance from '@turf/distance';
import turfBBox from '@turf/bbox';
import { point, featureCollection, isObject } from '@turf/helpers';
import inside from '@turf/inside';
import { getType } from '@turf/invariant';

/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {BBox|FeatureCollection|Feature} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide the distance between points
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {number} [options.bboxIsMask=false] if true, and bbox is a Polygon or MultiPolygon, the grid Point will be created
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSide = 3;
 *
 * var grid = turf.pointGrid(extent, cellSide, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [grid];
 */
function pointGrid(bbox, cellSide, options) {
    options = options || {};
    var  results = [];
    var  bboxMask = bbox;

    // validation
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) bbox = turfBBox(bbox); // Convert GeoJSON to bbox
    if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
    if (!isObject(options)) throw new Error('options is invalid');

    var  units = options.units;
    var  bboxIsMask = options.bboxIsMask || false;
    var  properties = options.properties || {};

    var  west = bbox[0];
    var  south = bbox[1];
    var  east = bbox[2];
    var  north = bbox[3];

    var  xFraction = cellSide / (distance(point([west, south]), point([east, south]), units));
    var  cellWidth = xFraction * (east - west);
    var  yFraction = cellSide / (distance(point([west, south]), point([west, north]), units));
    var  cellHeight = yFraction * (north - south);

    var  bboxHorizontalSide = (east - west);
    var  bboxVerticalSide = (north - south);
    var  columns = Math.floor(bboxHorizontalSide / cellWidth);
    var  rows = Math.floor(bboxVerticalSide / cellHeight);
    // adjust origin of the grid
    var  deltaX = (bboxHorizontalSide - columns * cellWidth) / 2;
    var  deltaY = (bboxVerticalSide - rows * cellHeight) / 2;

    var  bboxIsPoly = !Array.isArray(bboxMask) && (getType(bboxMask) === 'Polygon' || getType(bboxMask) === 'MultiPolygon');

    var  currentX = west + deltaX;
    while (currentX <= east) {
        var  currentY = south + deltaY;
        while (currentY <= north) {
            var  pt = point([currentX, currentY], properties);
            if (bboxIsMask === true && bboxIsPoly) {
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

export default pointGrid;
