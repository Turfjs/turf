/**
 * @param {string=}
 *          message Optional message.
 * @extends {Error}
 * @constructor
 */
function NoSuchElementException(message) {
  this.message = message || '';
};
NoSuchElementException.prototype = new Error();

/**
 * @type {string}
 */
NoSuchElementException.prototype.name = 'NoSuchElementException';

module.exports = NoSuchElementException;
