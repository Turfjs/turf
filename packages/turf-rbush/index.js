var turfBBox = require('@turf/bbox');
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var rbush = require('rbush');

/**
 * Creates a GeoJSON implementation of an RBush spatial index.
 *
 * @name rbush
 * @param {number} [maxEntries=9] defines the maximum number of entries in a tree node. 9 (used by default) is a
 * reasonable choice for most applications. Higher value means faster insertion and slower search, and vice versa.
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
 * var tree = turf.rbush(collection);
 * //=tree
 *
 * var search = tree.search(point)
 * //=search
 */
module.exports = function (maxEntries) {
    var tree = rbush(maxEntries);

    /**
     * insert
     *
     * @param {Feature<any>} item load single Feature
     * @returns {RBush} RBush
     */
    tree.insert = function (item) {
        item.bbox = item.bbox ? item.bbox : turfBBox(item);
        return rbush.prototype.insert.call(this, item);
    };

    /**
     * remove
     *
     * @param {Feature<any>} item remove single Feature
     * @returns {RBush} RBush
     */
    tree.remove = function (item) {
        return rbush.prototype.remove.call(this, item);
    };

    /**
     * load
     *
     * @param {FeatureCollection<any>} data load entire FeatureCollection
     * @returns {RBush} RBush
     */
    tree.load = function (data) {
        var load = [];
        featureEach(data, function (feature) {
            feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
            load.push(feature);
        });
        return rbush.prototype.load.call(this, load);
    };

    /**
     * search
     *
     * @param {Feature<any>} bbox search by Feature
     * @returns {RBush} RBush
     */
    tree.search = function (bbox) {
        var search = rbush.prototype.search.call(this, this.toBBox(bbox));
        return featureCollection(search);
    };

    /**
     * collides
     *
     * @param {Feature<any>} bbox collides by Feature
     * @returns {FeatureCollection<any>} all features that collides with input feature
     */
    tree.collides = function (bbox) {
        return rbush.prototype.collides.call(this, this.toBBox(bbox));
    };

    /**
     * all
     *
     * @returns {FeatureCollection<any>} all the features in RBush
     */
    tree.all = function () {
        var all = rbush.prototype.all.call(this);
        return featureCollection(all);
    };

    /**
     * toBBox
     *
     * @private
     * @param {Feature} item convert to RBush minX & maxY schema
     * @returns {Object} RBush minX & maxY schema
     */
    tree.toBBox = function (item) {
        var bbox = item.bbox ? item.bbox : turfBBox(item);
        return {
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3]
        };
    };

    return tree;
};




