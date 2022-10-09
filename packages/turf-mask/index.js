import { polygon as createPolygon, multiPolygon } from "@turf/helpers";
import polygonClipping from "polygon-clipping";

/**
 * Takes any type of {@link Polygon|polygon} and an optional mask and returns a {@link Polygon|polygon} exterior ring with holes. If the input polygon has holes
 * and you'd like to retain them then set `ignoreHoles=false` and a {@link MultiPolygon|multipolygon} will be returned where the holes will be returned as outer rings.
 *
 * @name mask
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Polygon used as interior rings or holes.
 * @param {Feature<Polygon>} [mask] GeoJSON Polygon used as the exterior ring (if undefined, the world extent is used)
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreHoles=true] Ignore holes in the input polygon. If false then they are converted to outer rings and a MultiPolygon is returned.
 * @returns {Feature<Polygon|MultiPolygon>} Masked Polygon (exterior ring with holes).
 * @example
 * var polygon = turf.polygon([[[112, -21], [116, -36], [146, -39], [153, -24], [133, -10], [112, -21]]]);
 * var mask = turf.polygon([[[90, -55], [170, -55], [170, 10], [90, 10], [90, -55]]]);
 *
 * var masked = turf.mask(polygon, mask);
 *
 * //addToMap
 * var addToMap = [masked]
 */
function mask(polygon, mask, options) {
  options = options || {};
  var ignoreHoles = "ignoreHoles" in options ? options.ignoreHoles : true;
  // Define mask
  var maskPolygon = createMask(mask, ignoreHoles);

  var polygonOuters = null;
  if (polygon.type === "FeatureCollection") polygonOuters = unionFc(polygon);
  else
    polygonOuters = createGeomFromPolygonClippingOutput(
      polygonClipping.union(polygon.geometry.coordinates)
    );

  polygonOuters.geometry.coordinates.forEach(function (contour) {
    if (ignoreHoles) {
      maskPolygon.geometry.coordinates.push(contour[0]);
    } else {
      for (let index = 0; index < contour.length; index++) {
        const ring = contour[index];
        if (index === 0) maskPolygon.geometry.coordinates[0].push(ring);
        else maskPolygon.geometry.coordinates.push([ring]);
      }
    }
  });

  return maskPolygon;
}

function unionFc(fc) {
  var unioned =
    fc.features.length === 2
      ? polygonClipping.union(
          fc.features[0].geometry.coordinates,
          fc.features[1].geometry.coordinates
        )
      : polygonClipping.union.apply(
          polygonClipping,
          fc.features.map(function (f) {
            return f.geometry.coordinates;
          })
        );
  return createGeomFromPolygonClippingOutput(unioned);
}

function createGeomFromPolygonClippingOutput(unioned) {
  return multiPolygon(unioned);
}

/**
 * Create Mask Coordinates
 *
 * @private
 * @param {Feature<Polygon>} [mask] default to world if undefined
 * @param {Boolean} [ignoreHoles] whether to ignore holes or not. If false we return a MultiPolygon
 * @returns {Feature<Polygon>} mask coordinate
 */
function createMask(mask, ignoreHoles) {
  var world = [
    [
      [180, 90],
      [-180, 90],
      [-180, -90],
      [180, -90],
      [180, 90],
    ],
  ];

  var coordinates = (mask && mask.geometry.coordinates) || world;

  return ignoreHoles ? createPolygon(coordinates) : multiPolygon([coordinates]);
}

export default mask;
