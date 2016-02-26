var ss = require('simple-statistics');

/**
* Takes a {@link FeatureCollection}, a property name, and a set of percentiles and returns a quantile array.
* @module turf/quantile
* @category classification
* @param {FeatureCollection} input set of features
* @param {String} field the property in `input` from which to retrieve quantile values
* @param {Array<number>} percentiles an Array of percentiles on which to calculate quantile values
* @return {Array<number>} an array of the break values
* @example
* var points = {
*   "type": "FeatureCollection",
*   "features": [
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 5
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [5, 5]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 40
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [1, 3]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 80
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [14, 2]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 90
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [13, 1]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 100
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [19, 7]
*       }
*     }
*   ]
* };
*
* var breaks = turf.quantile(
*   points, 'population', [25, 50, 75, 99]);
*
* //=breaks
*/
module.exports = function(fc, field, percentiles) {
  var vals = [];
  var quantiles = [];

  fc.features.forEach(function(feature) {
    vals.push(feature.properties[field]);
  });
  percentiles.forEach(function(percentile) {
    quantiles.push(ss.quantile(vals, percentile * 0.01));
  });
  return quantiles;
};
