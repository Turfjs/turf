import {
  Feature,
  FeatureCollection,
  Polygon,
  Position,
  MultiPolygon,
} from "geojson";
import { polygon as createPolygon, multiPolygon } from "@turf/helpers";
import polygonClipping, { Geom } from "polygon-clipping";

/**
 * Takes polygons or multipolygons and an optional mask, and returns an exterior
 * ring polygon with holes.
 *
 * @name mask
 * @param {Polygon|MultiPolygon|Feature<Polygon|MultiPolygon>|FeatureCollection<Polygon|MultiPolygon>} polygon GeoJSON polygon used as interior rings or holes
 * @param {Polygon|Feature<Polygon>} [mask] GeoJSON polygon used as the exterior ring (if undefined, the world extent is used)
 * @returns {Feature<Polygon>} Masked Polygon (exterior ring with holes).
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
  mask?: Polygon | Feature<Polygon>
): Feature<Polygon> {
  // Define mask
  const maskPolygon = createMask(mask);

  var polygonOuters = null;
  if (polygon.type === "FeatureCollection") {
    polygonOuters = unionFc(polygon);
  } else if (polygon.type === "Feature") {
    // Need to cast below as Position[][] isn't quite as strict as Geom, even
    // though they should be equivalent.
    polygonOuters = createGeomFromPolygonClippingOutput(
      polygonClipping.union(polygon.geometry.coordinates as Geom)
    );
  } else {
    // Geometry
    // Need to cast below as Position[][] isn't quite as strict as Geom, even
    // though they should be equivalent.
    polygonOuters = createGeomFromPolygonClippingOutput(
      polygonClipping.union(polygon.coordinates as Geom)
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
  const unioned =
    fc.features.length === 2
      ? polygonClipping.union(
          fc.features[0].geometry.coordinates as Geom,
          fc.features[1].geometry.coordinates as Geom
        )
      : polygonClipping.union(
          ...(fc.features.map(function (f) {
            return f.geometry.coordinates;
          }) as [Geom, ...Geom[]])
        );
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
  var world = [
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
