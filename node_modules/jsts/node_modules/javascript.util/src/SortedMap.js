/**
 * @requires Map.js
 */
var Map = require('./Map');

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/SortedMap.html
 *
 * @extends {javascript.util.Map}
 * @interface
 */
function SortedMap() {};
SortedMap.prototype = new Map;

module.exports = SortedMap;
