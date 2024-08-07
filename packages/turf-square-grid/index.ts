import {
  FeatureCollection,
  Polygon,
  BBox,
  Feature,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import { Units } from "@turf/helpers";
import { rectangleGrid } from "@turf/rectangle-grid";

/**
 * Creates a square grid, with polygon cells with equal length sides in degrees.
 *
 * @name squareGrid
 * @param {Array<number>} bbox extent of grid in [minX, minY, maxX, maxY] order.  If the grid does not fill the bbox perfectly, it is centered.
 * @param {number} cellSide length of each cell side.
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] the units the cellSide value is expressed in. Internally cellSide value is converted to degrees, regardless of units specified.
 * radians, miles, or kilometers
 * @param {Feature<Polygon|MultiPolygon>} [options.mask] if passed a Polygon or MultiPolygon,
 * the grid Points will be created only inside it
 * @param {Object} [options.properties={}] passed to each point of the grid
 * @returns {FeatureCollection<Polygon>} a grid of polygons with equal width and height in degrees.
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

function squareGrid<P extends GeoJsonProperties = GeoJsonProperties>(
  bbox: BBox,
  cellSide: number,
  options: {
    units?: Units;
    properties?: P;
    mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;
  } = {}
): FeatureCollection<Polygon, P> {
  return rectangleGrid(bbox, cellSide, cellSide, options);
}

export { squareGrid };
export default squareGrid;
