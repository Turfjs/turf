var internalHelpers = require('./helpers');
var checkIfDeepCoordArraysMatch = internalHelpers.checkIfDeepCoordArraysMatch;

/**
* Contains returns true if the second geometry is completely contained by the first geometry.
* The contains predicate returns the exact opposite result of the within predicate.
*
* @name contains
* @param {feature1} feature1
* @param {feature2} feature2
* @returns {Boolean}
* @example
* var along = turf.contains(line, point);
*/

module.exports = function (feature1, feature2) {
    return checkIfDeepCoordArraysMatch(feature1.geometry.coordinates, feature2.geometry.coordinates) && feature1.geometry.type === feature2.geometry.type;
};
