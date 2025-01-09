import {
  BBox,
  Feature,
  Polygon,
  MultiPolygon,
  FeatureCollection,
  Point,
  GeoJsonProperties,
} from "geojson";
import { booleanWithin as within } from "@turf/boolean-within";
import { distance } from "@turf/distance";
import { point, featureCollection, Units } from "@turf/helpers";

/**
 * Creates a grid of points
 *
 * @function
 * @param {BBox} bbox Extent of grid in [minX, minY, maxX, maxY] order
 * @param {number} cellSide Distance between points
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] Units in which linear values are expressed
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {GeoJsonProperties} [options.properties={}] Properties to set on each point of the returned grid
 * @returns {FeatureCollection<Point>} Grid of points
 * @example
 * const extent = [-70.823364, -33.553984, -70.473175, -33.302986];
 * const cellSide = 3;
 * const options = {units: 'miles'};
 *
 * const grid = turf.pointGrid(extent, cellSide, options);
 *
 * //addToMap
 * const addToMap = [grid];
 */
function pointGrid<P extends GeoJsonProperties = GeoJsonProperties>(
  bbox: BBox,
  cellSide: number,
  options: {
    units?: Units;
    mask?: Feature<Polygon | MultiPolygon>;
    properties?: P;
  } = {}
): FeatureCollection<Point, P> {
  // Default parameters
  if (options.mask && !options.units) options.units = "kilometers";

  // Containers
  var results = [];

  // Typescript handles the Type Validation
  // if (cellSide === null || cellSide === undefined) throw new Error('cellSide is required');
  // if (!isNumber(cellSide)) throw new Error('cellSide is invalid');
  // if (!bbox) throw new Error('bbox is required');
  // if (!Array.isArray(bbox)) throw new Error('bbox must be array');
  // if (bbox.length !== 4) throw new Error('bbox must contain 4 numbers');
  // if (mask && ['Polygon', 'MultiPolygon'].indexOf(getType(mask)) === -1) throw new Error('options.mask must be a (Multi)Polygon');

  var west = bbox[0];
  var south = bbox[1];
  var east = bbox[2];
  var north = bbox[3];

  var xFraction = cellSide / distance([west, south], [east, south], options);
  var cellWidth = xFraction * (east - west);
  var yFraction = cellSide / distance([west, south], [west, north], options);
  var cellHeight = yFraction * (north - south);

  var bboxWidth = east - west;
  var bboxHeight = north - south;
  var columns = Math.floor(bboxWidth / cellWidth);
  var rows = Math.floor(bboxHeight / cellHeight);

  // adjust origin of the grid
  var deltaX = (bboxWidth - columns * cellWidth) / 2;
  var deltaY = (bboxHeight - rows * cellHeight) / 2;

  var currentX = west + deltaX;
  while (currentX <= east) {
    var currentY = south + deltaY;
    while (currentY <= north) {
      var cellPt = point([currentX, currentY], options.properties);
      if (options.mask) {
        if (within(cellPt, options.mask)) results.push(cellPt);
      } else {
        results.push(cellPt);
      }
      currentY += cellHeight;
    }
    currentX += cellWidth;
  }

  return featureCollection(results);
}

export { pointGrid };
export default pointGrid;
