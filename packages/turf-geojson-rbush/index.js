import rbush from "rbush";
import { featureCollection } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import { bbox as turfBBox } from "@turf/bbox";

/**
 * @module rbush
 */

/**
 * GeoJSON implementation of [RBush](https://github.com/mourner/rbush#rbush) spatial index.
 *
 * @name rbush
 * @param {number} [maxEntries=9] defines the maximum number of entries in a tree node. 9 (used by default) is a
 * reasonable choice for most applications. Higher value means faster insertion and slower search, and vice versa.
 * @returns {RBush} GeoJSON RBush
 * @example
 * var geojsonRbush = require('geojson-rbush').default;
 * var tree = geojsonRbush();
 */
function geojsonRbush(maxEntries) {
  var tree = new rbush(maxEntries);

  /**
   * [insert](https://github.com/mourner/rbush#data-format)
   *
   * @memberof rbush
   * @param {Feature} feature insert single GeoJSON Feature
   * @returns {RBush} GeoJSON RBush
   * @example
   * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
   * tree.insert(poly)
   */
  tree.insert = function (feature) {
    if (feature.type !== "Feature") throw new Error("invalid feature");
    feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
    return rbush.prototype.insert.call(this, feature);
  };

  /**
   * [load](https://github.com/mourner/rbush#bulk-inserting-data)
   *
   * @memberof rbush
   * @param {FeatureCollection|Array<Feature>} features load entire GeoJSON FeatureCollection
   * @returns {RBush} GeoJSON RBush
   * @example
   * var polys = turf.polygons([
   *     [[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]],
   *     [[[-93, 32], [-83, 32], [-83, 39], [-93, 39], [-93, 32]]]
   * ]);
   * tree.load(polys);
   */
  tree.load = function (features) {
    var load = [];
    // Load an Array of Features
    if (Array.isArray(features)) {
      features.forEach(function (feature) {
        if (feature.type !== "Feature") throw new Error("invalid features");
        feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
        load.push(feature);
      });
    } else {
      // Load a FeatureCollection
      featureEach(features, function (feature) {
        if (feature.type !== "Feature") throw new Error("invalid features");
        feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
        load.push(feature);
      });
    }
    return rbush.prototype.load.call(this, load);
  };

  /**
   * [remove](https://github.com/mourner/rbush#removing-data)
   *
   * @memberof rbush
   * @param {Feature} feature remove single GeoJSON Feature
   * @param {Function} equals Pass a custom equals function to compare by value for removal.
   * @returns {RBush} GeoJSON RBush
   * @example
   * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
   *
   * tree.remove(poly);
   */
  tree.remove = function (feature, equals) {
    if (feature.type !== "Feature") throw new Error("invalid feature");
    feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
    return rbush.prototype.remove.call(this, feature, equals);
  };

  /**
   * [clear](https://github.com/mourner/rbush#removing-data)
   *
   * @memberof rbush
   * @returns {RBush} GeoJSON Rbush
   * @example
   * tree.clear()
   */
  tree.clear = function () {
    return rbush.prototype.clear.call(this);
  };

  /**
   * [search](https://github.com/mourner/rbush#search)
   *
   * @memberof rbush
   * @param {BBox|FeatureCollection|Feature} geojson search with GeoJSON
   * @returns {FeatureCollection} all features that intersects with the given GeoJSON.
   * @example
   * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
   *
   * tree.search(poly);
   */
  tree.search = function (geojson) {
    var features = rbush.prototype.search.call(this, this.toBBox(geojson));
    return featureCollection(features);
  };

  /**
   * [collides](https://github.com/mourner/rbush#collisions)
   *
   * @memberof rbush
   * @param {BBox|FeatureCollection|Feature} geojson collides with GeoJSON
   * @returns {boolean} true if there are any items intersecting the given GeoJSON, otherwise false.
   * @example
   * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
   *
   * tree.collides(poly);
   */
  tree.collides = function (geojson) {
    return rbush.prototype.collides.call(this, this.toBBox(geojson));
  };

  /**
   * [all](https://github.com/mourner/rbush#search)
   *
   * @memberof rbush
   * @returns {FeatureCollection} all the features in RBush
   * @example
   * tree.all()
   */
  tree.all = function () {
    var features = rbush.prototype.all.call(this);
    return featureCollection(features);
  };

  /**
   * [toJSON](https://github.com/mourner/rbush#export-and-import)
   *
   * @memberof rbush
   * @returns {any} export data as JSON object
   * @example
   * var exported = tree.toJSON()
   */
  tree.toJSON = function () {
    return rbush.prototype.toJSON.call(this);
  };

  /**
   * [fromJSON](https://github.com/mourner/rbush#export-and-import)
   *
   * @memberof rbush
   * @param {any} json import previously exported data
   * @returns {RBush} GeoJSON RBush
   * @example
   * var exported = {
   *   "children": [
   *     {
   *       "type": "Feature",
   *       "geometry": {
   *         "type": "Point",
   *         "coordinates": [110, 50]
   *       },
   *       "properties": {},
   *       "bbox": [110, 50, 110, 50]
   *     }
   *   ],
   *   "height": 1,
   *   "leaf": true,
   *   "minX": 110,
   *   "minY": 50,
   *   "maxX": 110,
   *   "maxY": 50
   * }
   * tree.fromJSON(exported)
   */
  tree.fromJSON = function (json) {
    return rbush.prototype.fromJSON.call(this, json);
  };

  /**
   * Converts GeoJSON to {minX, minY, maxX, maxY} schema
   *
   * @memberof rbush
   * @private
   * @param {BBox|FeatureCollection|Feature} geojson feature(s) to retrieve BBox from
   * @returns {Object} converted to {minX, minY, maxX, maxY}
   */
  tree.toBBox = function (geojson) {
    var bbox;
    if (geojson.bbox) bbox = geojson.bbox;
    else if (Array.isArray(geojson) && geojson.length === 4) bbox = geojson;
    else if (Array.isArray(geojson) && geojson.length === 6)
      bbox = [geojson[0], geojson[1], geojson[3], geojson[4]];
    else if (geojson.type === "Feature") bbox = turfBBox(geojson);
    else if (geojson.type === "FeatureCollection") bbox = turfBBox(geojson);
    else throw new Error("invalid geojson");

    return {
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
    };
  };
  return tree;
}

export { geojsonRbush };
export default geojsonRbush;
