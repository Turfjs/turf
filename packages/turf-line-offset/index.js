import { center } from "@turf/center";
import { flattenEach } from "@turf/meta";
import { getCoords, getType } from "@turf/invariant";
import { geoAzimuthalEquidistant } from "d3-geo";
import {
  isObject,
  lineString,
  multiLineString,
  radiansToLength,
  lengthToRadians,
  earthRadius,
} from "@turf/helpers";
import intersection from "./lib/intersection";

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString|MultiLineString>} geojson input GeoJSON
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, kilometers, inches, yards, meters
 * @returns {Feature<LineString|MultiLineString>} Line offset from the input line
 * @example
 * var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]], { "stroke": "#F00" });
 *
 * var offsetLine = turf.lineOffset(line, 2, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [offsetLine, line]
 * offsetLine.properties.stroke = "#00F"
 */
function lineOffset(geojson, distance, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var units = options.units;

  // Valdiation
  if (!geojson) throw new Error("geojson is required");
  if (distance === undefined || distance === null || isNaN(distance))
    throw new Error("distance is required");

  var type = getType(geojson);
  var properties = geojson.properties;

  switch (type) {
    case "LineString":
      return lineOffsetFeature(geojson, distance, units);
    case "MultiLineString":
      var coords = [];
      flattenEach(geojson, function (feature) {
        coords.push(
          lineOffsetFeature(feature, distance, units).geometry.coordinates
        );
      });
      return multiLineString(coords, properties);
    default:
      throw new Error("geometry " + type + " is not supported");
  }
}

/**
 * Line Offset
 *
 * @private
 * @param {Geometry|Feature<LineString>} line input line
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] units
 * @returns {Feature<LineString>} Line offset from the input line
 */
function lineOffsetFeature(line, distance, units) {
  var segments = [];
  var distance = radiansToLength(lengthToRadians(distance, units), "meters");

  // Project GeoJSON to Azimuthal Equidistant projection (convert to Meters)
  var projection = defineProjection(line);
  var projected = {
    type: line.type,
    coordinates: projectCoords(line.coordinates, projection),
  };

  //offset the line
  var coords = getCoords(projected);
  var offsetLine = [];
  coords.forEach(function (currentCoords, index) {
    if (index !== coords.length - 1) {
      var segment = processSegment(currentCoords, coords[index + 1], distance);
      segments.push(segment);
      if (index > 0) {
        var seg2Coords = segments[index - 1];
        var intersects = intersection(segment, seg2Coords);

        // Handling for line segments that aren't straight
        if (intersects !== false) {
          seg2Coords[1] = intersects;
          segment[0] = intersects;
        }

        offsetLine.push(seg2Coords[0]);
        if (index === coords.length - 2) {
          offsetLine.push(segment[0]);
          offsetLine.push(segment[1]);
        }
      }
      // Handling for lines that only have 1 segment
      if (coords.length === 2) {
        offsetLine.push(segment[0]);
        offsetLine.push(segment[1]);
      }
    }
  });
  // Unproject coordinates (convert to Degrees)

  var result = {
    type: line.type,
    coordinates: unprojectCoords(offsetLine, projection),
  };
  return lineString(result, line.properties);
}

/**
 * Process Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
function processSegment(point1, point2, offset) {
  var L = Math.sqrt(
    (point1[0] - point2[0]) * (point1[0] - point2[0]) +
      (point1[1] - point2[1]) * (point1[1] - point2[1])
  );

  var out1x = point1[0] + (offset * (point2[1] - point1[1])) / L;
  var out2x = point2[0] + (offset * (point2[1] - point1[1])) / L;
  var out1y = point1[1] + (offset * (point1[0] - point2[0])) / L;
  var out2y = point2[1] + (offset * (point1[0] - point2[0])) / L;
  return [
    [out1x, out1y],
    [out2x, out2y],
  ];
}

/**
 * Project coordinates to projection
 *
 * @private
 * @param {Array<any>} coords to project
 * @param {GeoProjection} proj D3 Geo Projection
 * @returns {Array<any>} projected coordinates
 */
function projectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj(coords);
  return coords.map(function (coord) {
    return projectCoords(coord, proj);
  });
}

/**
 * Un-Project coordinates to projection
 *
 * @private
 * @param {Array<any>} coords to un-project
 * @param {GeoProjection} proj D3 Geo Projection
 * @returns {Array<any>} un-projected coordinates
 */
function unprojectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj.invert(coords);
  return coords.map(function (coord) {
    return unprojectCoords(coord, proj);
  });
}

/**
 * Define Azimuthal Equidistant projection
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Base projection on center of GeoJSON
 * @returns {GeoProjection} D3 Geo Azimuthal Equidistant Projection
 */
function defineProjection(geojson) {
  var coords = center(geojson).geometry.coordinates;
  var rotation = [-coords[0], -coords[1]];
  return geoAzimuthalEquidistant().rotate(rotation).scale(earthRadius);
}
export default lineOffset;
