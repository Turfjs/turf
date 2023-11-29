import { Feature, FeatureCollection, Polygon } from "geojson";
import { featureCollection, isObject, multiPolygon } from "@turf/helpers";
import { collectionOf } from "@turf/invariant";
import { featureEach } from "@turf/meta";
import { flatten } from "@turf/flatten";
import polygonClipping, { Geom } from "polygon-clipping";

/**
 * Dissolves a FeatureCollection of {@link polygon} features, filtered by an optional property name:value.
 * Note that {@link mulitpolygon} features within the collection are not supported
 *
 * @name dissolve
 * @param {FeatureCollection<Polygon>} featureCollection input feature collection to be dissolved
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.propertyName] features with the same `propertyName` value will be dissolved.
 * @returns {FeatureCollection<Polygon>} a FeatureCollection containing the dissolved polygons
 * @example
 * var features = turf.featureCollection([
 *   turf.polygon([[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]], {combine: 'yes'}),
 *   turf.polygon([[[0, -1], [0, 0], [1, 0], [1, -1], [0,-1]]], {combine: 'yes'}),
 *   turf.polygon([[[1,-1],[1, 0], [2, 0], [2, -1], [1, -1]]], {combine: 'no'}),
 * ]);
 *
 * var dissolved = turf.dissolve(features, {propertyName: 'combine'});
 *
 * //addToMap
 * var addToMap = [features, dissolved]
 */
function dissolve(
  fc: FeatureCollection<Polygon>,
  options: {
    propertyName?: string;
  } = {}
): FeatureCollection<Polygon> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  const { propertyName } = options;

  // Input validation
  collectionOf(fc, "Polygon", "dissolve");

  // Main
  const outFeatures = [];
  if (!propertyName) {
    return flatten(
      multiPolygon(
        polygonClipping.union.apply(
          null,
          // List of polygons expressed as Position[][][] a.k.a. Geom[]
          fc.features.map(function (f) {
            return f.geometry.coordinates;
          }) as [Geom, ...Geom[]]
        )
      )
    );
  } else {
    // Group polygons by the value of their property named by propertyName
    const uniquePropertyVals: { [key: string]: Feature[] } = {};
    featureEach(fc, function (feature) {
      if (feature.properties) {
        if (
          !Object.prototype.hasOwnProperty.call(
            uniquePropertyVals,
            feature.properties[propertyName]
          )
        ) {
          uniquePropertyVals[feature.properties[propertyName]] =
            [] as Feature[];
        }
        uniquePropertyVals[feature.properties[propertyName]].push(feature);
      }
    });
    const vals = Object.keys(uniquePropertyVals);

    // Export each group of polygons as a separate feature.
    for (let i = 0; i < vals.length; i++) {
      const mp = multiPolygon(
        polygonClipping.union.apply(
          null,
          // List of polygons expressed as Position[][][] a.k.a. Geom[]
          (uniquePropertyVals[vals[i]] as Feature<Polygon>[]).map(function (f) {
            return f.geometry.coordinates;
          }) as [Geom, ...Geom[]]
        )
      );
      if (mp && mp.properties) {
        mp.properties[propertyName] = vals[i];
        outFeatures.push(mp);
      }
    }
  }

  return flatten(featureCollection(outFeatures));
}

export { dissolve };
export default dissolve;
