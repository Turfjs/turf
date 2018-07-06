import intersect from "../boolean-intersects";
import distance from "../distance";
import {isNumber, polygon, featureCollection} from "../helpers";
import {getType} from "../invariant";

/**
 * Creates a grid of rectangles from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name rectangleGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellWidth of each cell, in units
 * @param {number} cellHeight of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] units ("degrees", "radians", "miles", "kilometers") that the given cellWidth 
 * and cellHeight are expressed in. Converted at the southern border.
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon,
 * the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellWidth = 50;
 * var cellHeight = 20;
 * var options = {units: 'miles'};
 *
 * var rectangleGrid = turf.rectangleGrid(bbox, cellWidth, cellHeight, options);
 *
 * //addToMap
 * var addToMap = [rectangleGrid]
 */
function rectangleGrid(bbox, cellWidth, cellHeight, options) {
    // Containers
    const results = [];
    const west = bbox[0];
    const south = bbox[1];
    const east = bbox[2];
    const north = bbox[3];

    const xFraction = cellWidth / (distance([west, south], [east, south], options));
    const cellWidthDeg = xFraction * (east - west);
    const yFraction = cellHeight / (distance([west, south], [west, north], options));
    const cellHeightDeg = yFraction * (north - south);

    // rows & columns
    const bboxWidth = (east - west);
    const bboxHeight = (north - south);
    const columns = Math.floor(bboxWidth / cellWidthDeg);
    const rows = Math.floor(bboxHeight / cellHeightDeg);

    // if the grid does not fill the bbox perfectly, center it.
    const deltaX = (bboxWidth - columns * cellWidthDeg) / 2;
    const deltaY = (bboxHeight - rows * cellHeightDeg) / 2;

    // iterate over columns & rows
    let currentX = west + deltaX;
    for (let column = 0; column < columns; column++) {
        let currentY = south + deltaY;
        for (let row = 0; row < rows; row++) {
            const cellPoly = polygon([[
                [currentX, currentY],
                [currentX, currentY + cellHeightDeg],
                [currentX + cellWidthDeg, currentY + cellHeightDeg],
                [currentX + cellWidthDeg, currentY],
                [currentX, currentY],
            ]], options.properties);
            if (options.mask) {
                if (intersect(options.mask, cellPoly)) { results.push(cellPoly); }
            } else {
                results.push(cellPoly);
            }

            currentY += cellHeightDeg;
        }
        currentX += cellWidthDeg;
    }
    return featureCollection(results);
}

export default rectangleGrid;