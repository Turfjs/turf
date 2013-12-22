/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/AssertionFailedException.js
   */

  var AssertionFailedException = jsts.util.AssertionFailedException;

  /**
   * A utility for making programming assertions.
   *
   * @constructor
   * @name jsts.util.Assert
   */
  jsts.util.Assert = function() {};

  /**
   * Throws an <code>AssertionFailedException</code> with the given message if
   * the given assertion is not true.
   *
   * @param {boolean}
   *          assertion a condition that is supposed to be true.
   * @param {String=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           if the condition is false
   */
  jsts.util.Assert.isTrue = function(assertion, message) {
    if (!assertion) {
      if (message === null) {
        throw new AssertionFailedException();
      } else {
        throw new AssertionFailedException(message);
      }
    }
  };

  /**
   * Throws an <code>AssertionFailedException</code> with the given message if
   * the given objects are not equal, according to the <code>equals</code>
   * method.
   *
   * @param expectedValue
   *          the correct value.
   * @param actualValue
   *          the value being checked.
   * @param {string=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           if the two objects are not equal
   */
  jsts.util.Assert.equals = function(expectedValue, actualValue, message) {
    if (!actualValue.equals(expectedValue)) {
      throw new AssertionFailedException('Expected ' + expectedValue +
          ' but encountered ' + actualValue +
          (message != null ? ': ' + message : ''));
    }
  };

  /**
   * Always throws an <code>AssertionFailedException</code> with the given
   * message.
   *
   * @param {string=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           thrown always
   */
  jsts.util.Assert.shouldNeverReachHere = function(message) {
    throw new AssertionFailedException('Should never reach here' +
        (message != null ? ': ' + message : ''));
  };

})();
