/**
 * @param {string=}
 *          message Optional message.
 * @extends {Error}
 * @constructor
 */
function EmptyStackException(message) {
  this.message = message || '';
};
EmptyStackException.prototype = new Error();

/**
 * @type {string}
 */
EmptyStackException.prototype.name = 'EmptyStackException';

module.exports = EmptyStackException;
