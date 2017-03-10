var turfBBox = require('@turf/bbox');
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var rbush = require('./rbush');

/**
 * Creates a GeoJSON implementation of an RBush spatial index.
 *
 * @name index
 * @param {FeatureCollection|Feature<any>} features Features to be added to RBush spatial index.
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
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-70, 45]
 *   }
 * }
 * var tree = turf.index(collection);
 * //=tree
 *
 * var search = tree.search(point)
 * //=search
 */
module.exports = function (features) {
    var tree = rbush();
    var load = [];
    featureEach(features, function (feature, index) {
        if (!feature.id) feature.id = index;
        if (!feature.bbox) feature.bbox = turfBBox(feature);
        load.push(feature);
    });
    tree.load(load);
    return tree;
};

rbush.prototype.toBBox = function (item) {
    var bbox = item.bbox ? item.bbox : turfBBox(item);
    return {
        minX: bbox[0],
        minY: bbox[1],
        maxX: bbox[2],
        maxY: bbox[3]
    };
};

rbush.prototype.all = function () {
    return featureCollection(this._all(this.data, []));
};

rbush.prototype.search = function (bbox) {
    return featureCollection(this._search(bbox));
};
