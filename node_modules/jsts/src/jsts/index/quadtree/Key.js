/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A Key is a unique identifier for a node in a quadtree. It contains a
 * lower-left point and a level number. The level number is the power of two for
 * the size of the node envelope.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope of the key.
 *
 * @constructor
 */
jsts.index.quadtree.Key = function(itemEnv) {
  // the fields which make up the key
  this.pt = new jsts.geom.Coordinate();
  this.level = 0;
  // auxiliary data which is derived from the key for use in computation
  this.env = null;

  this.computeKey(itemEnv);
};


/**
 * Computes the quad-level for specified envelope
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope to calculate level for.
 * @return {Number} The calculated level.
 */
jsts.index.quadtree.Key.computeQuadLevel = function(env) {
  var dx, dy, dMax, level;

  dx = env.getWidth();
  dy = env.getHeight();
  dMax = dx > dy ? dx : dy;
  level = jsts.index.DoubleBits.exponent(dMax) + 1;
  return level;
};


/**
 * Gets the point of this key.
 *
 * @return {jsts.geom.Coordinate} The point.
 */
jsts.index.quadtree.Key.prototype.getPoint = function() {
  return this.pt;
};


/**
 * Gets the level of this key
 *
 * @return {Number} The level.
 */
jsts.index.quadtree.Key.prototype.getLevel = function() {
  return this.level;
};


/**
 * Gets the envelope of this key
 *
 * @return {jsts.geom.Envelope} The envelope.
 */
jsts.index.quadtree.Key.prototype.getEnvelope = function() {
  return this.env;
};


/**
 * Gets the centre of this key
 *
 * @return {jsts.geom.Coordinate} the center-point.
 */
jsts.index.quadtree.Key.prototype.getCentre = function() {
  var x, y;
  x = (this.env.getMinX() + this.env.getMaxX()) / 2;
  y = (this.env.getMinY() + this.env.getMaxY()) / 2;
  return new jsts.geom.Coordinate(x, y);
};


/**
 * Will call appropriate computeKey* method depending on arguments.
 */
jsts.index.quadtree.Key.prototype.computeKey = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    this.computeKeyFromEnvelope(arguments[0]);
  } else {
    this.computeKeyFromLevel(arguments[0], arguments[1]);
  }
};


/**
 * Computes the key from specified envlope.
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 */
jsts.index.quadtree.Key.prototype.computeKeyFromEnvelope = function(env) {
  this.level = jsts.index.quadtree.Key.computeQuadLevel(env);
  this.env = new jsts.geom.Envelope();
  this.computeKey(this.level, env);
  while (!this.env.contains(env)) {
    this.level += 1;
    this.computeKey(this.level, env);
  }
};


/**
 * Computes a key from a level and an envelope
 *
 * @param {Number}
 *          level the level.
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 */
jsts.index.quadtree.Key.prototype.computeKeyFromLevel = function(level, env) {
  var quadSize = jsts.index.DoubleBits.powerOf2(level);
  this.pt.x = Math.floor(env.getMinX() / quadSize) * quadSize;
  this.pt.y = Math.floor(env.getMinY() / quadSize) * quadSize;
  this.env.init(this.pt.x, this.pt.x + quadSize, this.pt.y, this.pt.y +
      quadSize);
};
