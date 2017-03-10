var turfBBox = require('@turf/bbox');
var featureEach = require('@turf/meta').featureEach;
var rbush = require('rbush');

/**
 * Create RBush Tree Index from a Feature Collection or GeometryCollection.
 *
 * @name index
 * @param {GeometryCollection|FeatureCollection<any>} collection Collection to be added to the RBush Tree index.
 * @param {number} [maxEntries=9] defines the maximum number of entries in a tree node. 9 (used by default) is a
 * reasonable choice for most applications. Higher value means faster insertion and slower search, and vice versa.
 * @param {Array<any>} [format] assumes the format of data points to be an object with minX, minY, maxX and maxY properties.
 * You can customize this by providing an array with corresponding accessor strings as a second argument to rbush
 * @returns {RBush} RBush Tree
 * @example
 * var collection = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]
 *       }
 *     },
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[[-93, 32], [-83, 32], [-83, 39], [-93, 39], [-93, 32]]]
 *       }
 *     }
 *   ]
 * }
 * var tree = turf.index(collection);
 * //=tree
 *
 * var search = tree.search({
 *   minX: -90,
 *   minY: 30,
 *   maxX: -80,
 *   maxY: 35
 * })
 * //=search
 */
module.exports = function (collection, maxEntries, format) {
    var tree = rbush(maxEntries, format);
    var load = [];
    featureEach(collection, function (feature, index) {
        var bbox = turfBBox(feature);
        load.push({
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3],
            index: index
        });
    });
    tree.load(load);
    return tree;
};
