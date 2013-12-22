/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A visitor for items in an index.
 *
 * @interface
 */
jsts.index.ItemVisitor = function() {

};


/**
 * @param {Object} item
 * @public
 */
jsts.index.ItemVisitor.prototype.visitItem = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};
