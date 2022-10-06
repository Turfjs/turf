import { Feature, GeoJsonProperties } from "geojson";
import { AllGeoJSON } from "@turf/helpers";

/**
 * Returns a cloned copy of the passed GeoJSON Object, including possible 'Foreign Members'.
 * ~3-5x faster than the common JSON.parse + JSON.stringify combo method.
 *
 * @name clone
 * @param {GeoJSON} geojson GeoJSON Object
 * @returns {GeoJSON} cloned GeoJSON Object
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]], {color: 'red'});
 *
 * var lineCloned = turf.clone(line);
 */
function clone<T extends AllGeoJSON>(geojson: T): T {
  if (!geojson) {
    throw new Error("geojson is required");
  }

  switch (geojson.type) {
    case "Feature":
      return cloneFeature(geojson);
    case "FeatureCollection":
      return cloneFeatureCollection(geojson);
    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
    case "GeometryCollection":
      return cloneGeometry(geojson);
    default:
      throw new Error("unknown GeoJSON type");
  }
}

/**
 * Clone Feature
 *
 * @private
 * @param {Feature<any>} geojson GeoJSON Feature
 * @returns {Feature<any>} cloned Feature
 */
function cloneFeature(geojson: any) {
  const cloned: any = { type: "Feature" };
  // Preserve Foreign Members
  Object.keys(geojson).forEach((key) => {
    switch (key) {
      case "type":
      case "properties":
      case "geometry":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  // Add properties & geometry last
  cloned.properties = cloneProperties(geojson.properties);
  if (geojson.geometry == null) {
    cloned.geometry = null;
  } else {
    cloned.geometry = cloneGeometry(geojson.geometry);
  }
  return cloned;
}

/**
 * Clone Properties
 *
 * @private
 * @param {Object} properties GeoJSON Properties
 * @returns {Object} cloned Properties
 */
function cloneProperties(properties: GeoJsonProperties) {
  const cloned: { [key: string]: any } = {};
  if (!properties) {
    return cloned;
  }
  Object.keys(properties).forEach((key) => {
    const value = properties[key];
    if (typeof value === "object") {
      if (value === null) {
        // handle null
        cloned[key] = null;
      } else if (Array.isArray(value)) {
        // handle Array
        cloned[key] = value.map((item) => {
          return item;
        });
      } else {
        // handle generic Object
        cloned[key] = cloneProperties(value);
      }
    } else {
      cloned[key] = value;
    }
  });
  return cloned;
}

/**
 * Clone Feature Collection
 *
 * @private
 * @param {FeatureCollection<any>} geojson GeoJSON Feature Collection
 * @returns {FeatureCollection<any>} cloned Feature Collection
 */
function cloneFeatureCollection(geojson: any) {
  const cloned: any = { type: "FeatureCollection" };

  // Preserve Foreign Members
  Object.keys(geojson).forEach((key) => {
    switch (key) {
      case "type":
      case "features":
        return;
      default:
        cloned[key] = geojson[key];
    }
  });
  // Add features
  cloned.features = geojson.features.map((feature: Feature<any>) => {
    return cloneFeature(feature);
  });
  return cloned;
}

/**
 * Clone Geometry
 *
 * @private
 * @param {Geometry<any>} geometry GeoJSON Geometry
 * @returns {Geometry<any>} cloned Geometry
 */
function cloneGeometry(geometry: any) {
  const geom: any = { type: geometry.type };
  if (geometry.bbox) {
    geom.bbox = geometry.bbox;
  }

  if (geometry.type === "GeometryCollection") {
    geom.geometries = geometry.geometries.map((g: any) => {
      return cloneGeometry(g);
    });
    return geom;
  }
  geom.coordinates = deepSlice(geometry.coordinates);
  return geom;
}

/**
 * Deep Slice coordinates
 *
 * @private
 * @param {Coordinates} coords Coordinates
 * @returns {Coordinates} all coordinates sliced
 */
function deepSlice<C = any[]>(coords: C): C {
  const cloned: any = coords;
  if (typeof cloned[0] !== "object") {
    return cloned.slice();
  }
  return cloned.map((coord: any) => {
    return deepSlice(coord);
  });
}

export default clone;
