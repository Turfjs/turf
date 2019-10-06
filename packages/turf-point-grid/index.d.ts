import { BBox, Feature, Polygon, MultiPolygon, FeatureCollection, Point, Properties, Units } from '@turf/helpers';
/**
 * Creates a {@link Point} grid from a bounding box, {@link FeatureCollection} or {@link Feature}.
 *
 * @name pointGrid
 * @param {Array<number>} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide the distance between points, in units
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cellSide, can be degrees, radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Point>} grid of points
 * @example
 * var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * var cellSide = 3;
 * var options = {units: 'miles'};
 *
 * var grid = turf.pointGrid(extent, cellSide, options);
 *
 * //addToMap
 * var addToMap = [grid];
 */
declare function pointGrid<P = Properties>(bbox: BBox, cellSide: number, options?: {
    units?: Units;
    mask?: Feature<Polygon | MultiPolygon>;
    properties?: P;
}): FeatureCollection<Point, P>;
export default pointGrid;
