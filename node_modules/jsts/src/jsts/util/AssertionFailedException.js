/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Thrown when the application is in an inconsistent state. Indicates a
   * problem with the code.
   *
   * @constructor
   */
  var AssertionFailedException = function(message) {
    this.message = message;
  };
  AssertionFailedException.prototype = new Error();
  AssertionFailedException.prototype.name = 'AssertionFailedException';

  jsts.util.AssertionFailedException = AssertionFailedException;

})();
