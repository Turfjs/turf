var contains = require('./contains');
var equals = require('./equals');
var within = require('./within');

/**
* Contains returns true if the second geometry is completely contained by the first geometry.
* The contains predicate returns the exact opposite result of the within predicate.
*
* @name boolean
* @param {feature1} feature1
* @param {feature2} feature2
* @returns {Boolean}
* @example
* var along = turf.contains(line, point);
*/

module.exports = {
    contains: contains,
    equals: equals,
    within: within
};
