var turfBBox = require('@turf/bbox');
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var rbush = require('rbush');

/**
 * GeoJSON implementation of RBush spatial index.
 *
 * @name rbush
 * @param {number} [maxEntries=9] defines the maximum number of entries in a tree node. 9 (used by default) is a
 * reasonable choice for most applications. Higher value means faster insertion and slower search, and vice versa.
 * @returns {RBush} RBush Tree
 * @example
 * var features = {
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
 * var tree = turf.rbush();
 *
 * // Loading Features in bulk
 * tree.load(features);
 *
 * // Loading Features one by one
 * tree.insert(point);
 *
 * var search = tree.search(point);
 * //=search
 *
 * var collides = tree.collides(point);
 * //=collides
 */
module.exports = function (maxEntries) {
    var tree = rbush(maxEntries);

    /**
     * insert
     *
     * @param {Feature<any>} feature insert single GeoJSON Feature
     * @returns {RBush} GeoJSON RBush
     */
    tree.insert = function (feature) {
        feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
        return rbush.prototype.insert.call(this, feature);
    };

    /**
     * remove
     *
     * @param {Feature<any>} feature remove single GeoJSON Feature
     * @returns {RBush} GeoJSON RBush
     */
    tree.remove = function (feature) {
        return rbush.prototype.remove.call(this, feature);
    };

    /**
     * load
     *
     * @param {FeatureCollection<any>} features load entire GeoJSON FeatureCollection
     * @returns {RBush} GeoJSON RBush
     */
    tree.load = function (features) {
        var load = [];
        featureEach(features, function (feature) {
            feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
            load.push(feature);
        });
        return rbush.prototype.load.call(this, load);
    };

    /**
     * search
     *
     * @param {FeatureCollection|Feature<any>} geojson search with GeoJSON
     * @returns {FeatureCollection<any>} all features that intersects with the given GeoJSON.
     */
    tree.search = function (geojson) {
        var search = rbush.prototype.search.call(this, this.toBBox(geojson));
        return featureCollection(search);
    };

    /**
     * collides
     *
     * @param {FeatureCollection|Feature<any>} geojson collides with GeoJSON
     * @returns {boolean} true if there are any items intersecting the given GeoJSON, otherwise false.
     */
    tree.collides = function (geojson) {
        return rbush.prototype.collides.call(this, this.toBBox(geojson));
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
     * Converts GeoJSON to {minX, minY, maxX, maxY} schema
     *
     * @private
     * @param {FeatureCollectio|Feature<any>} geojson feature(s) to retrieve BBox from
     * @returns {Object} converted to {minX, minY, maxX, maxY}
     */
    tree.toBBox = function (geojson) {
        var bbox = geojson.bbox ? geojson.bbox : turfBBox(geojson);
        return {
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3]
        };
    };

    return tree;
};




