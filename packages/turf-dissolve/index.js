import { featureCollection, multiPolygon, isObject } from "@turf/helpers";
import { collectionOf } from "@turf/invariant";
import { featureEach } from "@turf/meta";
import flatten from "@turf/flatten";
import polygonClipping from "polygon-clipping";

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
function dissolve(fc, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var propertyName = options.propertyName;

  // Input validation
  collectionOf(fc, "Polygon", "dissolve");

  // Main
  var outFeatures = [];
  if (!options.propertyName) {
    return flatten(
      multiPolygon(
        polygonClipping.union.apply(
          null,
          fc.features.map(function (f) {
            return f.geometry.coordinates;
          })
        )
      )
    );
  } else {
    var uniquePropertyVals = {};
    featureEach(fc, function (feature) {
      if (
        !Object.prototype.hasOwnProperty.call(
          uniquePropertyVals,
          feature.properties[propertyName]
        )
      ) {
        uniquePropertyVals[feature.properties[propertyName]] = [];
      }
      uniquePropertyVals[feature.properties[propertyName]].push(feature);
    });
    var vals = Object.keys(uniquePropertyVals);
    for (var i = 0; i < vals.length; i++) {
      var mp = multiPolygon(
        polygonClipping.union.apply(
          null,
          uniquePropertyVals[vals[i]].map(function (f) {
            return f.geometry.coordinates;
          })
        )
      );
      mp.properties[propertyName] = vals[i];
      outFeatures.push(mp);
    }
  }

  return flatten(featureCollection(outFeatures));
}

export default dissolve;
