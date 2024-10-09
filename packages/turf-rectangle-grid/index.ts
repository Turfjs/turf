import { booleanIntersects as intersect } from "@turf/boolean-intersects";
import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import {
  convertLength,
  featureCollection,
  polygon,
  Units,
} from "@turf/helpers";
/**
 * Creates a grid of rectangular polygons with width and height consistent in degrees
 *
 * @function
 * @param {BBox} bbox extent of grid in [minX, minY, maxX, maxY] order.  If the grid does not fill the bbox perfectly, it is centered.
 * @param {number} cellWidth width of each cell, in units
 * @param {number} cellHeight height of each cell, in units
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units='kilometers'] the units of the cell width and height value.
 * Supports all valid Turf {@link https://github.com/Turfjs/turf/blob/master/packages/turf-helpers/README_UNITS.md Units}.
 * If you are looking for rectangles with equal width and height in linear units (e.g. kilometers) this is not the module for you.
 * The cellWidth and cellHeight is converted from units provided to degrees internally, so the width and height of resulting polygons will be consistent only in degrees.
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
function rectangleGrid<P extends GeoJsonProperties = GeoJsonProperties>(
  bbox: BBox,
  cellWidth: number,
  cellHeight: number,
  options: {
    units?: Units;
    properties?: P;
    mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon;
  } = {}
): FeatureCollection<Polygon, P> {
  // Containers
  const results = [];
  const west = bbox[0];
  const south = bbox[1];
  const east = bbox[2];
  const north = bbox[3];

  const bboxWidth = east - west;
  const cellWidthDeg = convertLength(cellWidth, options.units, "degrees");

  const bboxHeight = north - south;
  const cellHeightDeg = convertLength(cellHeight, options.units, "degrees");

  const columns = Math.floor(Math.abs(bboxWidth) / cellWidthDeg);
  const rows = Math.floor(Math.abs(bboxHeight) / cellHeightDeg);

  // if the grid does not fill the bbox perfectly, center it.
  const deltaX = (bboxWidth - columns * cellWidthDeg) / 2;
  const deltaY = (bboxHeight - rows * cellHeightDeg) / 2;

  // iterate over columns & rows
  let currentX = west + deltaX;
  for (let column = 0; column < columns; column++) {
    let currentY = south + deltaY;
    for (let row = 0; row < rows; row++) {
      const cellPoly = polygon(
        [
          [
            [currentX, currentY],
            [currentX, currentY + cellHeightDeg],
            [currentX + cellWidthDeg, currentY + cellHeightDeg],
            [currentX + cellWidthDeg, currentY],
            [currentX, currentY],
          ],
        ],
        options.properties
      );
      if (options.mask) {
        if (intersect(options.mask, cellPoly)) {
          results.push(cellPoly);
        }
      } else {
        results.push(cellPoly);
      }

      currentY += cellHeightDeg;
    }
    currentX += cellWidthDeg;
  }
  return featureCollection(results);
}

export { rectangleGrid };
export default rectangleGrid;
