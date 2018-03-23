import intersect from "@turf/boolean-intersects";
import distance from "@turf/distance";
import {
    BBox, Feature, featureCollection,
    FeatureCollection, isNumber, MultiPolygon, polygon, Polygon, Properties, Units,
} from "@turf/helpers";
import {getType} from "@turf/invariant";

/**
 * Creates a square grid from a bounding box, {@link Feature} or {@link FeatureCollection}.
 *
 * @name squareGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees,
 * radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon,
 * the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var bbox = [-95, 30 ,-85, 40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var squareGrid = turf.squareGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [squareGrid]
 */
function squareGrid<P = Properties>(bbox: BBox, cellSide: number, options: {
    units?: Units,
    properties?: P,
    mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
} = {}): FeatureCollection<Polygon, P> {
    // Containers
    const results = [];
    const west = bbox[0];
    const south = bbox[1];
    const east = bbox[2];
    const north = bbox[3];

    const xFraction = cellSide / (distance([west, south], [east, south], options));
    const cellWidth = xFraction * (east - west);
    const yFraction = cellSide / (distance([west, south], [west, north], options));
    const cellHeight = yFraction * (north - south);

    // rows & columns
    const bboxWidth = (east - west);
    const bboxHeight = (north - south);
    const columns = Math.floor(bboxWidth / cellWidth);
    const rows = Math.floor(bboxHeight / cellHeight);

    // adjust origin of the grid
    const deltaX = (bboxWidth - columns * cellWidth) / 2;
    const deltaY = (bboxHeight - rows * cellHeight) / 2;

    // iterate over columns & rows
    let currentX = west + deltaX;
    for (let column = 0; column < columns; column++) {
        let currentY = south + deltaY;
        for (let row = 0; row < rows; row++) {
            const cellPoly = polygon([[
                [currentX, currentY],
                [currentX, currentY + cellHeight],
                [currentX + cellWidth, currentY + cellHeight],
                [currentX + cellWidth, currentY],
                [currentX, currentY],
            ]], options.properties);
            if (options.mask) {
                if (intersect(options.mask, cellPoly)) { results.push(cellPoly); }
            } else {
                results.push(cellPoly);
            }

            currentY += cellHeight;
        }
        currentX += cellWidth;
    }
    return featureCollection(results);
}

export default squareGrid;
