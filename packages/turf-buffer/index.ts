import { center } from "@turf/center";
import jsts from "@turf/jsts";
import { geomEach, featureEach } from "@turf/meta";
import { geoAzimuthalEquidistant, GeoProjection } from "d3-geo";
import {
  feature,
  featureCollection,
  radiansToLength,
  lengthToRadians,
  earthRadius,
  Units,
  AllGeoJSON,
} from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  MultiPolygon,
  Polygon,
} from "geojson";

const { BufferOp, GeoJSONReader, GeoJSONWriter } = jsts;

/**
 * Calculates a buffer for input features for a given radius.
 *
 * When using a negative radius, the resulting geometry may be invalid if
 * it's too small compared to the radius magnitude. If the input is a
 * FeatureCollection, only valid members will be returned in the output
 * FeatureCollection - i.e., the output collection may have fewer members than
 * the input, or even be empty.
 *
 * @function
 * @param {FeatureCollection|Geometry|Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer (negative values are allowed)
 * @param {Object} [options={}] Optional parameters
 * @param {Units} [options.units="kilometers"] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @param {number} [options.steps=8] number of steps
 * @returns {FeatureCollection|Feature<Polygon|MultiPolygon>|undefined} buffered features
 * @example
 * var point = turf.point([-90.548630, 14.616599]);
 * var buffered = turf.buffer(point, 500, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [point, buffered]
 */
function buffer<T extends Geometry | Feature | FeatureCollection>(
  geojson: T,
  radius?: number,
  options: {
    units?: Units;
    steps?: number;
  } = {}
): T extends FeatureCollection | GeometryCollection
  ? FeatureCollection<Polygon | MultiPolygon> | undefined
  : Feature<Polygon | MultiPolygon> | undefined {
  // validation
  if (!geojson) throw new Error("geojson is required");
  if (typeof options !== "object") throw new Error("options must be an object");

  // use user supplied options or default values
  const { units = "kilometers", steps = 8 } = options;

  if (typeof steps !== "number") throw new Error("steps must be an number");

  // Allow negative buffers ("erosion") or zero-sized buffers ("repair geometry")
  if (radius === undefined) throw new Error("radius is required");
  if (steps <= 0) throw new Error("steps must be greater than 0");

  var results: Feature<Polygon | MultiPolygon>[] = [];
  switch (geojson.type) {
    case "GeometryCollection":
      geomEach(geojson, function (geometry) {
        var buffered = bufferFeature(geometry, radius, units, steps);
        if (buffered) {
          if (buffered.type === "Feature") {
            results.push(buffered);
          } else {
            for (const feature of buffered.features) {
              results.push(feature);
            }
          }
        }
      });
      return featureCollection(results) as T extends
        | FeatureCollection
        | GeometryCollection
        ? FeatureCollection<Polygon | MultiPolygon> | undefined
        : Feature<Polygon | MultiPolygon> | undefined;
    case "FeatureCollection":
      featureEach(geojson, function (feature) {
        var multiBuffered = bufferFeature(feature, radius, units, steps);
        if (multiBuffered) {
          featureEach(multiBuffered, function (buffered) {
            if (buffered) results.push(buffered);
          });
        }
      });
      return featureCollection(results) as T extends
        | FeatureCollection
        | GeometryCollection
        ? FeatureCollection<Polygon | MultiPolygon> | undefined
        : Feature<Polygon | MultiPolygon> | undefined;
  }
  return bufferFeature(geojson, radius, units, steps) as T extends
    | FeatureCollection
    | GeometryCollection
    ? FeatureCollection<Polygon | MultiPolygon> | undefined
    : Feature<Polygon | MultiPolygon> | undefined;
}

/**
 * Buffer single Feature/Geometry
 *
 * @private
 * @param {Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {Units} [units='kilometers'] Supports all valid Turf {@link https://turfjs.org/docs/api/types/Units Units}.
 * @param {number} [steps=8] number of steps
 * @returns {Feature<Polygon|MultiPolygon>} buffered feature
 */
function bufferFeature<T extends AllGeoJSON>(
  geojson: T,
  radius: number,
  units: Units,
  steps: number
):
  | (T extends GeometryCollection
      ? FeatureCollection<Polygon | MultiPolygon>
      : Feature<Polygon | MultiPolygon>)
  | undefined {
  var properties = (geojson as Feature).properties ?? {};
  var geometry = geojson.type === "Feature" ? geojson.geometry : geojson;

  // Geometry Types faster than jsts
  if (geometry.type === "GeometryCollection") {
    var results: Feature<Polygon | MultiPolygon>[] = [];
    geomEach(geojson, function (geometry) {
      var buffered = bufferFeature(geometry, radius, units, steps);
      if (buffered) {
        if (buffered.type === "Feature") {
          results.push(buffered);
        } else {
          for (const feature of buffered.features) {
            results.push(feature);
          }
        }
      }
    });
    return featureCollection(results) as T extends GeometryCollection
      ? FeatureCollection<Polygon | MultiPolygon>
      : Feature<Polygon | MultiPolygon>;
  }

  // Project GeoJSON to Azimuthal Equidistant projection (convert to Meters)
  var projection = defineProjection(geometry);
  var projected = {
    type: geometry.type,
    coordinates: projectCoords(
      (geometry as Exclude<Geometry, GeometryCollection>).coordinates,
      projection
    ),
  };

  // JSTS buffer operation
  var reader = new GeoJSONReader();
  var geom = reader.read(projected);
  var distance = radiansToLength(lengthToRadians(radius, units), "meters");
  var buffered = BufferOp.bufferOp(geom, distance, steps);
  var writer = new GeoJSONWriter();
  const bufferResult = writer.write(buffered) as Polygon | MultiPolygon;

  // Detect if empty geometries
  if (coordsIsNaN(bufferResult.coordinates)) return undefined;

  // Unproject coordinates (convert to Degrees)
  var result = {
    type: bufferResult.type,
    coordinates: unprojectCoords(bufferResult.coordinates, projection),
  } as Polygon | MultiPolygon;

  return feature(result, properties) as T extends GeometryCollection
    ? FeatureCollection<Polygon | MultiPolygon>
    : Feature<Polygon | MultiPolygon>;
}

/**
 * Coordinates isNaN
 *
 * @private
 * @param {Array<any>} coords GeoJSON Coordinates
 * @returns {boolean} if NaN exists
 */
function coordsIsNaN(coords: any[]) {
  if (Array.isArray(coords[0])) return coordsIsNaN(coords[0]);
  return isNaN(coords[0]);
}

/**
 * Project coordinates to projection
 *
 * @private
 * @param {Array<any>} coords to project
 * @param {GeoProjection} proj D3 Geo Projection
 * @returns {Array<any>} projected coordinates
 */
function projectCoords<C extends any[]>(coords: C, proj: GeoProjection): C {
  if (typeof coords[0] !== "object") {
    return proj(coords as unknown as [number, number]) as any;
  }
  return coords.map(function (coord) {
    return projectCoords(coord, proj);
  }) as C;
}

/**
 * Un-Project coordinates to projection
 *
 * @private
 * @param {Array<any>} coords to un-project
 * @param {GeoProjection} proj D3 Geo Projection
 * @returns {Array<any>} un-projected coordinates
 */
function unprojectCoords<C extends any[]>(coords: C, proj: GeoProjection): C {
  if (typeof coords[0] !== "object") {
    return proj.invert!(coords as unknown as [number, number]) as any;
  }
  return coords.map(function (coord) {
    return unprojectCoords(coord, proj);
  }) as C;
}

/**
 * Define Azimuthal Equidistant projection
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Base projection on center of GeoJSON
 * @returns {GeoProjection} D3 Geo Azimuthal Equidistant Projection
 */
function defineProjection(geojson: AllGeoJSON): GeoProjection {
  var coords = center(geojson).geometry.coordinates;
  var rotation: [number, number] = [-coords[0], -coords[1]];
  return geoAzimuthalEquidistant().rotate(rotation).scale(earthRadius);
}

export { buffer };
export default buffer;
