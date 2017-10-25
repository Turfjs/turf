/**
 * @license get-closest https://github.com/cosmosio/get-closest
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2017 Olivier Scherrer <pode.fr@gmail.com>
 */

/**
 * Get the closest number in an array
 *
 * @private
 * @param {number} item the base number
 * @param {Array} array the array to search into
 * @param {Function} getDiff returns the difference between the base number and
 *   and the currently read item in the array. The item which returned the smallest difference wins.
 * @returns {Object} Get Closest
 */
function _getClosest(item, array, getDiff) {
    var closest,
        diff;

    if (!Array.isArray(array)) {
        throw new Error('Get closest expects an array as second argument');
    }

    array.forEach(function (comparedItem, comparedItemIndex) {
        var thisDiff = getDiff(comparedItem, item);

        if (thisDiff >= 0 && (typeof diff == 'undefined' || thisDiff < diff)) {
            diff = thisDiff;
            closest = comparedItemIndex;
        }
    });

    return closest;
}

/**
 * Get the closest number in an array given a base number
 *
 * @private
 * @param {number} item the base number
 * @param {Array<number>} array the array of numbers to search into
 * @returns {number} the index of the closest item in the array
 * @example
 * closestNumber(30, [20, 0, 50, 29])
 * //= will return 3 as 29 is the closest item
 */
export function closestNumber(item, array) {
    return _getClosest(item, array, function (comparedItem, item) {
        return Math.abs(comparedItem - item);
    });
}

/**
 * Get the closest greater number in an array given a base number
 *
 * @private
 * @param {number} item the base number
 * @param {Array<number>} array the array of numbers to search into
 * @returns {number} the index of the closest item in the array
 * @example
 * closestGreaterNumber(30, [20, 0, 50, 29])
 * //= will return 2 as 50 is the closest greater item
 */
export function closestGreaterNumber(item, array) {
    return _getClosest(item, array, function (comparedItem, item) {
        return comparedItem - item;
    });
}

/**
 * Get the closest lower number in an array given a base number
 *
 * @private
 * @param {number} item the base number
 * @param {Array<number>} array the array of numbers to search into
 * @returns {number} the index of the closest item in the array
 * @example
 * closestLowerNumber(30, [20, 0, 50, 29])
 * //= will return 0 as 20 is the closest lower item
 */
export function closestLowerNumber(item, array) {
    return _getClosest(item, array, function (comparedItem, item) {
        return item - comparedItem;
    });
}

/**
 * Get the closest item in an array given a base item and a comparator function
 *
 * @private
 * @param {*} item the base item
 * @param {Array} array an array of items
 * @param {Function} comparator a comparatof function to compare the items
 * @returns {Object} Closest Custom
 * @example
 * closestCustom("lundi", ["mundi", "mardi"], getLevenshteinDistance)
 * //= will return 0 for "lundi"
 *
 * // The function looks like:
 *
 * // comparedItem comes from the array
 * // baseItem is the item to compare the others to
 * // It returns a number
 * function comparator(comparedItem, baseItem) {
 *     return comparedItem - baseItem;
 * }
 */
export function closestCustom(item, array, comparator) {
    return _getClosest(item, array, comparator);
}
