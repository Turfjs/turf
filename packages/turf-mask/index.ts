import {
  Feature,
  FeatureCollection,
  Polygon,
  Position,
  MultiPolygon,
} from "geojson";
import { polygon as createPolygon, multiPolygon } from "@turf/helpers";
import * as polyclip from "polyclip-ts";
import { clone } from "@turf/clone";

/**
 * Takes polygons or multipolygons and an optional mask, and returns an exterior
 * ring polygon with holes.
 *
 * @function
 * @param {Polygon|MultiPolygon|Feature<Polygon|MultiPolygon>|FeatureCollection<Polygon|MultiPolygon>} polygon GeoJSON polygon used as interior rings or holes
 * @param {Polygon|Feature<Polygon>} [mask] GeoJSON polygon used as the exterior ring (if undefined, the world extent is used)
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] allows the `mask` GeoJSON input to be mutated (performance improvement if true)
 * @returns {Feature<Polygon>} Masked Polygon (exterior ring with holes)
 * @example
 * const polygon = turf.polygon([[[112, -21], [116, -36], [146, -39], [153, -24], [133, -10], [112, -21]]]);
 * const mask = turf.polygon([[[90, -55], [170, -55], [170, 10], [90, 10], [90, -55]]]);
 *
 * const masked = turf.mask(polygon, mask);
 *
 * //addToMap
 * const addToMap = [masked]
 */
function mask<T extends Polygon | MultiPolygon>(
  polygon: T | Feature<T> | FeatureCollection<T>,
  mask?: Polygon | Feature<Polygon>,
  options?: { mutate?: boolean }
): Feature<Polygon> {
  const mutate = options?.mutate ?? false; // by default, do not mutate

  let maskTemplate = mask;
  if (mask && mutate === false) {
    // Clone mask if requested to avoid side effects
    maskTemplate = clone(mask);
  }

  // Define initial mask
  const maskPolygon = createMask(maskTemplate);

  let polygonOuters = null;
  if (polygon.type === "FeatureCollection") {
    polygonOuters = unionFc(polygon);
  } else if (polygon.type === "Feature") {
    // Need to cast below as Position[][] isn't quite as strict as Geom, even
    // though they should be equivalent.
    polygonOuters = createGeomFromPolygonClippingOutput(
      polyclip.union(polygon.geometry.coordinates as polyclip.Geom)
    );
  } else {
    // Geometry
    // Need to cast below as Position[][] isn't quite as strict as Geom, even
    // though they should be equivalent.
    polygonOuters = createGeomFromPolygonClippingOutput(
      polyclip.union(polygon.coordinates as polyclip.Geom)
    );
  }

  polygonOuters.geometry.coordinates.forEach(function (contour) {
    maskPolygon.geometry.coordinates.push(contour[0]);
  });

  return maskPolygon;
}

function unionFc(fc: FeatureCollection<Polygon | MultiPolygon>) {
  // Need to cast below as Position[][] isn't quite as strict as Geom, even
  // though they should be equivalent.

  // Stick with apply() below as spread operator degrades performance. Have
  // to disable prefer-spread lint rule though.
  /* eslint-disable prefer-spread */
  const unioned =
    fc.features.length === 2
      ? polyclip.union(
          fc.features[0].geometry.coordinates as polyclip.Geom,
          fc.features[1].geometry.coordinates as polyclip.Geom
        )
      : polyclip.union.apply(
          polyclip,
          fc.features.map(function (f) {
            return f.geometry.coordinates;
          }) as [polyclip.Geom, ...polyclip.Geom[]]
        );
  /* eslint-enable */
  return createGeomFromPolygonClippingOutput(unioned);
}

function createGeomFromPolygonClippingOutput(unioned: Position[][][]) {
  return multiPolygon(unioned);
}

/**
 * Create Mask Coordinates
 *
 * @private
 * @param {Feature<Polygon>} [mask] default to world if undefined
 * @returns {Feature<Polygon>} mask as a polygon
 */
function createMask(mask: Feature<Polygon> | Polygon | undefined) {
  const world = [
    [
      [180, 90],
      [-180, 90],
      [-180, -90],
      [180, -90],
      [180, 90],
    ],
  ];
  let coordinates = world;
  if (mask) {
    if (mask.type === "Feature") {
      // polygon feature
      coordinates = mask.geometry.coordinates;
    } else {
      // polygon geometry
      coordinates = mask.coordinates;
    }
  }
  return createPolygon(coordinates);
}

export { mask };
export default mask;
