var featurecollection = require('turf-helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection}, an input field, an output field, and
 * an array of translations and outputs an identical FeatureCollection with
 * the output field property populated.
* @name reclass
* @category classification
* @param {FeatureCollection} input set of input features
* @param {String} inField the field to translate
* @param {String} outField the field in which to store translated results
* @param {Array<number>} translations an array of translations
* @return {FeatureCollection} a FeatureCollection with identical geometries to `input` but with `outField` populated.
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
*         "coordinates": [13.170547, 32.888669]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 600
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [13.182048, 32.889533]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 100
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [13.17398, 32.882182]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 200
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [13.174324, 32.895011]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 300
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [13.185825, 32.884344]
*       }
*     }
*   ]
* };
* // 0 to 200 will map to "small", 200 to 400 will map to "medium", 400 to 600 will map to "large"
* var translations = [
*   [0, 200, "small"],
*   [200, 400, "medium"],
*   [400, 600, "large"]
* ];
*
* var reclassed = turf.reclass(
*   points, 'population', 'size', translations);
*
* //=reclassed
*
*/
module.exports = function (fc, inField, outField, translations) {
    var reclassed = featurecollection([]);

    fc.features.forEach(function (feature) {
        for (var i = 0; i < translations.length; i++) {
            if (feature.properties[inField] >= translations[i][0] && feature.properties[inField] <= translations[i][1]) {
                feature.properties[outField] = translations[i][2];
            }
        }
        reclassed.features.push(feature);
    });

    return reclassed;
};
