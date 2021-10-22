import turfBBox from "@turf/bbox";
import { getCoords, getGeom } from "@turf/invariant";
import {
  polygon,
  multiPolygon,
  lineString,
  Feature,
  FeatureCollection,
  MultiLineString,
  LineString,
  Properties,
  BBox,
  Position,
} from "@turf/helpers";
import clone from "@turf/clone";

/**
 * Converts (Multi)LineString(s) to Polygon(s).
 *
 * @name lineToPolygon
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} lines Features to convert
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] translates GeoJSON properties to Feature
 * @param {boolean} [options.autoComplete=true] auto complete linestrings (matches first & last coordinates)
 * @param {boolean} [options.orderCoords=true] sorts linestrings to place outer ring at the first position of the coordinates
 * @param {boolean} [options.mutate=false] mutate the original linestring using autoComplete (matches first & last coordinates)
 * @returns {Feature<Polygon|MultiPolygon>} converted to Polygons
 * @example
 * var line = turf.lineString([[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]);
 *
 * var polygon = turf.lineToPolygon(line);
 *
 * //addToMap
 * var addToMap = [polygon];
 */
function lineToPolygon<G extends LineString | MultiLineString>(
  lines: Feature<G> | FeatureCollection<G> | G,
  options: {
    properties?: Properties;
    autoComplete?: boolean;
    orderCoords?: boolean;
    mutate?: boolean;
  } = {}
) {
  // Optional parameters
  var properties = options.properties;
  var autoComplete = options.autoComplete ?? true;
  var orderCoords = options.orderCoords ?? true;
  var mutate = options.mutate ?? false;

  if (!mutate) {
    lines = clone(lines);
  }

  switch (lines.type) {
    case "FeatureCollection":
      var coords: number[][][][] = [];
      lines.features.forEach(function (line) {
        coords.push(
          getCoords(lineStringToPolygon(line, {}, autoComplete, orderCoords))
        );
      });
      return multiPolygon(coords, properties);
    default:
      return lineStringToPolygon(lines, properties, autoComplete, orderCoords);
  }
}

/**
 * LineString to Polygon
 *
 * @private
 * @param {Feature<LineString|MultiLineString>} line line
 * @param {Object} [properties] translates GeoJSON properties to Feature
 * @param {boolean} [autoComplete=true] auto complete linestrings
 * @param {boolean} [orderCoords=true] sorts linestrings to place outer ring at the first position of the coordinates
 * @returns {Feature<Polygon>} line converted to Polygon
 */
function lineStringToPolygon<G extends LineString | MultiLineString>(
  line: Feature<G> | G,
  properties: Properties | undefined,
  autoComplete: boolean,
  orderCoords: boolean
) {
  properties = properties
    ? properties
    : line.type === "Feature"
    ? line.properties
    : {};
  var geom = getGeom(line);
  var coords: Position[] | Position[][] = geom.coordinates;
  var type = geom.type;

  if (!coords.length) throw new Error("line must contain coordinates");

  switch (type) {
    case "LineString":
      if (autoComplete) coords = autoCompleteCoords(coords as Position[]);
      return polygon([coords as Position[]], properties);
    case "MultiLineString":
      var multiCoords: number[][][] = [];
      var largestArea = 0;

      (coords as Position[][]).forEach(function (coord) {
        if (autoComplete) coord = autoCompleteCoords(coord);

        // Largest LineString to be placed in the first position of the coordinates array
        if (orderCoords) {
          var area = calculateArea(turfBBox(lineString(coord)));
          if (area > largestArea) {
            multiCoords.unshift(coord);
            largestArea = area;
          } else multiCoords.push(coord);
        } else {
          multiCoords.push(coord);
        }
      });
      return polygon(multiCoords, properties);
    default:
      throw new Error("geometry type " + type + " is not supported");
  }
}

/**
 * Auto Complete Coords - matches first & last coordinates
 *
 * @private
 * @param {Array<Array<number>>} coords Coordinates
 * @returns {Array<Array<number>>} auto completed coordinates
 */
function autoCompleteCoords(coords: Position[]) {
  var first = coords[0];
  var x1 = first[0];
  var y1 = first[1];
  var last = coords[coords.length - 1];
  var x2 = last[0];
  var y2 = last[1];
  if (x1 !== x2 || y1 !== y2) {
    coords.push(first);
  }
  return coords;
}

/**
 * area - quick approximate area calculation (used to sort)
 *
 * @private
 * @param {Array<number>} bbox BBox [west, south, east, north]
 * @returns {number} very quick area calculation
 */
function calculateArea(bbox: BBox) {
  var west = bbox[0];
  var south = bbox[1];
  var east = bbox[2];
  var north = bbox[3];
  return Math.abs(west - east) * Math.abs(south - north);
}

export default lineToPolygon;
