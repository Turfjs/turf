/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * An spatial index on a set of {@link LineSegment}s. Supports adding and
 * removing items.
 *
 * @author Martin Davis
 */
jsts.simplify.LineSegmentIndex = function() {
  this.index = new jsts.index.quadtree.Quadtree();
};

/**
 * @private
 */
jsts.simplify.LineSegmentIndex.prototype.index = null;

/**
 * @param {TaggedLineString}
 *          line
 */
jsts.simplify.LineSegmentIndex.prototype.add = function(line) {
  if (line instanceof jsts.geom.LineSegment) {
    this.add2(line);
    return;
  }

  var segs = line.getSegments();
  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    this.add2(seg);
  }
};

/**
 * @param {LineSegment}
 *          seg
 */
jsts.simplify.LineSegmentIndex.prototype.add2 = function(seg) {
  this.index.insert(new jsts.geom.Envelope(seg.p0, seg.p1), seg);
};
/**
 * @param {LineSegment}
 *          seg
 */
jsts.simplify.LineSegmentIndex.prototype.remove = function(seg) {
  this.index.remove(new jsts.geom.Envelope(seg.p0, seg.p1), seg);
};

/**
 * @param {LineSegment}
 *          querySeg
 * @return {Array}
 */
jsts.simplify.LineSegmentIndex.prototype.query = function(querySeg) {
  var env = new jsts.geom.Envelope(querySeg.p0, querySeg.p1);

  var visitor = new jsts.simplify.LineSegmentIndex.LineSegmentVisitor(querySeg);
  this.index.query(env, visitor);
  var itemsFound = visitor.getItems();

  return itemsFound;
};


/**
 * @requires jsts/index/ItemVisitor.js
 */
/**
 * ItemVisitor subclass to reduce volume of query results.
 *
 * @implements {jsts.index.ItemVisitor}
 */
jsts.simplify.LineSegmentIndex.LineSegmentVisitor = function(querySeg) {
  this.items = [];

  this.querySeg = querySeg;
};


jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype = new jsts.index.ItemVisitor();

// MD - only seems to make about a 10% difference in overall time.
jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.querySeg = null;
jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.items = null;

jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.visitItem = function(
    item) {
  var seg = item;
  if (jsts.geom.Envelope.intersects(seg.p0, seg.p1, this.querySeg.p0, this.querySeg.p1))
    this.items.push(item);
};

jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.getItems = function() {
  return this.items;
};
