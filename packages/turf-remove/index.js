var featureCollection = require('turf-helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection} of any type, a property, and a value and
 * returns a FeatureCollection with features matching that
 * property-value pair removed.
 *
 * @module turf/remove
 * @category data
 * @param {FeatureCollection} features set of input features
 * @param {String} property the property to filter
 * @param {String} value the value to filter
 * @return {FeatureCollection} the resulting FeatureCollection without features that match the property-value pair
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#00f'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.235004, 5.551918]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#f00'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.209598, 5.56439]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#00f'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.197753, 5.556018]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#000'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.217323, 5.549526]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#0f0'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.211315, 5.543887]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#00f'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.202217, 5.547134]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         'marker-color': '#0f0'
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-0.231227, 5.56644]
 *       }
 *     }
 *   ]
 * };
 *
 * //=points
 *
 * var filtered = turf.remove(points, 'marker-color', '#00f');
 *
 * //=filtered
*/
module.exports = function(collection, key, val) {
  var newFC = featureCollection([]);
  for(var i = 0; i < collection.features.length; i++) {
    if(collection.features[i].properties[key] !== val) {
      newFC.features.push(collection.features[i]);
    }
  }
  return newFC;
};
