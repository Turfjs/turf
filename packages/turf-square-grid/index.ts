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
 * Creates a grid of square polygons with cell length consistent in degrees
 *
 * @function
 * @param {BBox} bbox extent of grid in [minX, minY, maxX, maxY] order.  If the grid does not fill the bbox perfectly, it is centered.
 * @param {number} cellSide length of each cell side.
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] the units of the cellSide value.
 * Supports all valid Turf {@link https://github.com/Turfjs/turf/blob/master/packages/turf-helpers/README_UNITS.md Units}.
 * If you are looking for squares with sides of equal lengths in linear units (e.g. kilometers) this is not the module for you.
 * The cellSide is converted from units provided to degrees internally, so the width and height of resulting polygons will be consistent only in degrees.
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
