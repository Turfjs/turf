import { center } from "@turf/center";
import { geoAzimuthalEquidistant } from "d3-geo";
import {
  feature,
  featureCollection,
  radiansToLength,
  lengthToRadians,
  earthRadius,
  Units,
} from "@turf/helpers";
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  MultiPolygon,
  Polygon,
} from "geojson";
import {
  inflatePaths,
  JoinType,
  EndType,
  Paths64,
  Path64,
  area,
  pointInPolygon,
  PointInPolygonResult,
} from "clipper2-ts";

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
function buffer<T extends GeoJSON.GeoJSON>(
  geojson: GeoJSON.GeoJSON,
  radius?: number,
  options?: { units?: Units; steps?: number }
): T extends FeatureCollection | GeometryCollection
  ? FeatureCollection<Polygon, MultiPolygon> | undefined
  : Feature<Polygon | MultiPolygon> | undefined {
  // Optional params
  if (typeof options !== "object" && options != null) {
    throw new Error("options must be an object");
  }

  // TODO steps is unused
  const { units = "kilometers", steps = 8 } = options ?? {};

  // validation
  if (!geojson) throw new Error("geojson is required");

  if (typeof steps !== "number") throw new Error("steps must be an number");

  // Allow negative buffers ("erosion") or zero-sized buffers ("repair geometry")
  if (radius === undefined) throw new Error("radius is required");
  if (steps <= 0) throw new Error("steps must be greater than 0");

  switch (geojson.type) {
    case "FeatureCollection":
      return featureCollection(
        geojson.features.map((f) =>
          feature(
            bufferGeometryWrapper(f.geometry, radius, units),
            f.properties,
            { id: f.id }
          )
        )
      ) as any;
    case "GeometryCollection":
      return featureCollection(
        geojson.geometries.map((g) =>
          feature(bufferGeometryWrapper(g, radius, units))
        )
      ) as any;
    case "Feature":
      return feature(
        bufferGeometryWrapper(geojson.geometry, radius, units),
        geojson.properties,
        { id: geojson.id }
      ) as any;
    case "Point":
    case "LineString":
    case "Polygon":
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
      return feature(bufferGeometryWrapper(geojson, radius, units)) as any;
    default: {
      geojson satisfies never;
    }
  }
}

function bufferGeometryWrapper(
  geojson: Geometry,
  radius: number,
  units: Units
) {
  // define our coordinate projection
  const coords = center(geojson).geometry.coordinates;
  const rotation: [number, number] = [-coords[0], -coords[1]];
  const proj = geoAzimuthalEquidistant().rotate(rotation).scale(earthRadius);

  function project(poly: number[][][]): Paths64 {
    return poly.map((ring) => {
      const result: Path64 = [];
      // geojson should follow right hand rule (outer ring counter-clockwise, inner rings clockwise)
      // clipper2 expects the opposite (clockwise outer ring, counter-clockwise inner rings)
      for (let i = ring.length - 1; i >= 0; i--) {
        const [x, y] = proj(ring[i] as [number, number])!;
        result.push({ x, y });
      }
      return result;
    });
  }

  function unproject(poly: Paths64): [number, number][][] {
    return poly.map((ring) => {
      const result: [number, number][] = [];
      // similar to project(), we need to reverse ring orders
      for (let i = ring.length - 1; i >= 0; i--) {
        const { x, y } = ring[i];
        result.push(proj.invert!([x, y])!);
      }
      // we also need to close the rings coming out of clipper2
      result.push(result[0].slice() as [number, number]);
      return result;
    });
  }

  const distance = radiansToLength(lengthToRadians(radius, units), "meters");

  return bufferGeometry(geojson, { distance, project, unproject });
}

function bufferGeometry(
  geojson: Geometry,
  options: {
    distance: number;
    project: (poly: number[][][]) => Paths64;
    unproject: (poly: Paths64) => [number, number][][];
  }
): Polygon | MultiPolygon {
  switch (geojson.type) {
    case "GeometryCollection": {
      const coordinates: number[][][][] = [];
      for (const geometry of geojson.geometries) {
        const buffered = bufferGeometry(geometry, options);
        if (buffered.type === "Polygon") {
          coordinates.push(buffered.coordinates);
        } else {
          for (const p of buffered.coordinates) {
            coordinates.push(p);
          }
        }
      }

      return {
        type: "MultiPolygon",
        coordinates,
      };
    }

    case "Point": {
      const inflated = inflatePaths(
        options.project([[geojson.coordinates]]),
        options.distance,
        JoinType.Round,
        EndType.Round
      );

      return {
        type: "Polygon",
        coordinates: options.unproject(inflated),
      };
    }
    case "LineString": {
      const inflated = inflatePaths(
        options.project([geojson.coordinates]),
        options.distance,
        JoinType.Round,
        EndType.Round
      );
      return {
        type: "Polygon",
        coordinates: options.unproject(inflated),
      };
    }
    case "Polygon": {
      const inflated = inflatePaths(
        options.project(geojson.coordinates),
        options.distance,
        JoinType.Round,
        EndType.Polygon
      );
      return {
        type: "Polygon",
        coordinates: options.unproject(inflated),
      };
    }

    case "MultiPoint": {
      const inflated = inflatePaths(
        options.project(geojson.coordinates.map((p) => [p])),
        options.distance,
        JoinType.Round,
        EndType.Round
      );

      // inflated can contain many rings, but they should all be outer rings
      const multiCoords = inflated.map((path) => options.unproject([path]));
      if (multiCoords.length === 1) {
        // TODO just return MultiPolygon always?
        return {
          type: "Polygon",
          coordinates: multiCoords[0],
        };
      } else {
        // TODO this is wrong I think
        return {
          type: "MultiPolygon",
          coordinates: multiCoords,
        };
      }
    }

    case "MultiLineString": {
      const inflated = inflatePaths(
        options.project(geojson.coordinates),
        options.distance,
        JoinType.Round,
        EndType.Round
      );

      // inflated now contains inner and outer rings for any number of polygons.
      // We need to work out what the groupings are before turning it back into geojson.
      const polygons: Paths64[] = [];
      const holes: Path64[] = [];
      for (const ring of inflated) {
        if (area(ring) > 0) {
          // outer ring, add it to the output
          polygons.push([ring]);
        } else {
          holes.push(ring);
        }
      }

      HOLES: for (const hole of holes) {
        for (const poly of polygons) {
          if (
            PointInPolygonResult.IsInside === pointInPolygon(hole[0], poly[0])
          ) {
            poly.push(hole);
            continue HOLES;
          }
        }
        throw new Error("Unable to find parent for hole: " + hole);
      }

      return {
        type: "MultiPolygon",
        coordinates: polygons.map((poly) => options.unproject(poly)),
      };
    }

    case "MultiPolygon": {
      const inflated = inflatePaths(
        geojson.coordinates.flatMap((poly) => options.project(poly)),
        options.distance,
        JoinType.Round,
        EndType.Polygon
      );

      // inflated now contains inner and outer rings for any number of polygons.
      // We need to work out what the groupings are before turning it back into geojson.
      const polygons: Paths64[] = [];
      const holes: Path64[] = [];
      for (const ring of inflated) {
        if (area(ring) > 0) {
          // outer ring, add it to the output
          polygons.push([ring]);
        } else {
          holes.push(ring);
        }
      }

      HOLES: for (const hole of holes) {
        for (const poly of polygons) {
          if (
            PointInPolygonResult.IsInside === pointInPolygon(hole[0], poly[0])
          ) {
            poly.push(hole);
            continue HOLES;
          }
        }
        throw new Error("Unable to find parent for hole: " + hole);
      }

      return {
        type: "MultiPolygon",
        coordinates: polygons.map((poly) => options.unproject(poly)),
      };
    }
  }
}

export { buffer };
export default buffer;
