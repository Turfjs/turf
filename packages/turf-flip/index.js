var coordEach = require('@turf/meta').coordEach;

/**
 * Takes input features and flips all of their coordinates from `[x, y]` to `[y, x]`.
 *
 * @name flip
 * @param {FeatureCollection|Feature<any>} geojson input features
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {FeatureCollection|Feature<any>} a feature or set of features of the same type as `input` with flipped coordinates
 * @example
 * var serbia = turf.point([20.566406, 43.421008]);
 *
 * var saudiArabia = turf.flip(serbia);
 *
 * //addToMap
 * var addToMap = [serbia, saudiArabia];
 */
module.exports = function (geojson, mutate) {
    if (!geojson) throw new Error('geojson is required');
    // ensure that we don't modify features in-place and changes to the
    // output do not change the previous feature, including changes to nested
    // properties.
    if (mutate === false || mutate === undefined) geojson = JSON.parse(JSON.stringify(geojson));

    coordEach(geojson, function (coord) {
        var x = coord[0];
        var y = coord[1];
        coord[0] = y;
        coord[1] = x;
    });
    return geojson;
};
