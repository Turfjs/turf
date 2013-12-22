/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/Map.html
 *
 * @interface
 */
function Map() {};

/**
 * Returns the value to which the specified key is mapped, or null if this map
 * contains no mapping for the key.
 *
 * @param {Object}
 *          key
 * @return {?Object}
 */
Map.prototype.get = function(key) {};

/**
 * Associates the specified value with the specified key in this map (optional
 * operation).
 *
 * @param {Object}
 *          key
 * @param {Object}
 *          value
 * @return {Object}
 */
Map.prototype.put = function(key, value) {};

/**
 * Returns the number of key-value mappings in this map.
 *
 * @return {number}
 */
Map.prototype.size = function() {};

/**
 * Returns a Collection view of the values contained in this map.
 *
 * @return {javascript.util.Collection}
 */
Map.prototype.values = function() {};

module.exports = Map;
