var featureCollection = require('turf-helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection} and filters it by a given property and value.
 *
 * @module turf/filter
 * @category data
 * @param {FeatureCollection} features input features
 * @param {String} key the property on which to filter
 * @param {String} value the value of that property on which to filter
 * @return {FeatureCollection} a filtered collection with only features that match input `key` and `value`
 * @example
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "oak"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.581777, 44.260875]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "birch"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.570018, 44.260691]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "oak"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.576284, 44.257925]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "redwood"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.56916, 44.254605]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "maple"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.581691, 44.24858]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "species": "oak"
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-72.583837, 44.255773]
 *       }
 *     }
 *   ]
 * };
 *
 * var key = "species";
 * var value = "oak";
 *
 * var filtered = turf.filter(features, key, value);
 *
 * //=features
 *
 * //=filtered
 */
module.exports = function(collection, key, val) {
  var newFC = featureCollection([]);
  for(var i = 0; i < collection.features.length; i++) {
    if(collection.features[i].properties[key] === val) {
      newFC.features.push(collection.features[i]);
    }
  }
  return newFC;
};
