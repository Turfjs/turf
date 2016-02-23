var ss = require('simple-statistics');

/**
* Takes a set of features and returns an array of the [Jenks Natural breaks](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
* for a given property
* @module turf/jenks
* @category classification
* @param {FeatureCollection} input input features
* @param {String} field the property in `input` on which to calculate Jenks natural breaks
* @param {Number} numberOfBreaks number of classes in which to group the data
* @return {Array<number>} the break number for each class plus the minimum and maximum values
* @example
* var points = {
*   "type": "FeatureCollection",
*   "features": [
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 200
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [49.859733, 40.400424]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 600
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [49.83879, 40.401209]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 100
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [49.817848, 40.376889]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 200
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [49.840507, 40.386043]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 300
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [49.854583, 40.37532]
*       }
*     }
*   ]
* };
*
* var breaks = turf.jenks(points, 'population', 3);
*
* //=breaks
*/
module.exports = function(fc, field, num) {
  var vals = [];
  var breaks = [];

  fc.features.forEach(function(feature) {
    if(feature.properties[field]!==undefined) {
      vals.push(feature.properties[field]);
    }
  });
  breaks = ss.jenks(vals, num);

  return breaks;
};
