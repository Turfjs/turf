/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/TopologyLocation.js
 */

/**
 * A <code>Label</code> indicates the topological relationship of a component
 * of a topology graph to a given <code>Geometry</code>. This class supports
 * labels for relationships to two <code>Geometry</code>s, which is
 * sufficient for algorithms for binary operations.
 * <P>
 * Topology graphs support the concept of labeling nodes and edges in the graph.
 * The label of a node or edge specifies its topological relationship to one or
 * more geometries. (In fact, since JTS operations have only two arguments
 * labels are required for only two geometries). A label for a node or edge has
 * one or two elements, depending on whether the node or edge occurs in one or
 * both of the input <code>Geometry</code>s. Elements contain attributes
 * which categorize the topological location of the node or edge relative to the
 * parent <code>Geometry</code>; that is, whether the node or edge is in the
 * interior, boundary or exterior of the <code>Geometry</code>. Attributes
 * have a value from the set <code>{Interior, Boundary, Exterior}</code>. In
 * a node each element has a single attribute <code>&lt;On&gt;</code>. For an
 * edge each element has a triplet of attributes
 * <code>&lt;Left, On, Right&gt;</code>.
 * <P>
 * It is up to the client code to associate the 0 and 1
 * <code>TopologyLocation</code>s with specific geometries.
 *
 * @constructor
 */
jsts.geomgraph.Label = function() {
  this.elt = [];

  var geomIndex, onLoc, leftLoc, lbl, rightLoc;
  if (arguments.length === 4) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    leftLoc = arguments[2];
    rightLoc = arguments[3];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 3) {
    onLoc = arguments[0];
    leftLoc = arguments[1];
    rightLoc = arguments[2];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 2) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocation(onLoc);
  } else if (arguments[0] instanceof jsts.geomgraph.Label) {
    lbl = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(lbl.elt[0]);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(lbl.elt[1]);
  } else if (typeof arguments[0] === 'number') {
    onLoc = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc);
  }
};


/**
 * converts a Label to a Line label (that is, one with no side Locations)
 *
 * @param {label}
 *          label
 * @return {Label}
 */
jsts.geomgraph.Label.toLineLabel = function(label) {
  var i, lineLabel = new jsts.geomgraph.Label(jsts.geom.Location.NONE);
  for (i = 0; i < 2; i++) {
    lineLabel.setLocation(i, label.getLocation(i));
  }
  return lineLabel;
};


/**
 * @type {TopologyLocation[]}
 * @private
 */
jsts.geomgraph.Label.prototype.elt = null;

jsts.geomgraph.Label.prototype.flip = function() {
  this.elt[0].flip();
  this.elt[1].flip();
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation = function(geomIndex, posIndex) {
  if (arguments.length == 1) {
    return this.getLocation2.apply(this, arguments);
  }
  return this.elt[geomIndex].get(posIndex);
};


/**
 * @param {int}
 *          geomIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation2 = function(geomIndex) {
  return this.elt[geomIndex].get(jsts.geomgraph.Position.ON);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation = function(geomIndex, posIndex,
    location) {
  if (arguments.length == 2) {
    this.setLocation2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setLocation(posIndex, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation2 = function(geomIndex, location) {
  this.elt[geomIndex].setLocation(jsts.geomgraph.Position.ON, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocations = function(geomIndex, location) {
  this.elt[geomIndex].setAllLocations(location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull = function(geomIndex,
    location) {
  if (arguments.length == 1) {
    this.setAllLocationsIfNull2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setAllLocationsIfNull(location);
};


/**
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull2 = function(location) {
  this.setAllLocationsIfNull(0, location);
  this.setAllLocationsIfNull(1, location);
};


/**
 * Merge this label with another one. Merging updates any null attributes of
 * this label with the attributes from lbl
 *
 * @param {Label}
 *          lbl
 */
jsts.geomgraph.Label.prototype.merge = function(lbl) {
  var i;
  for (i = 0; i < 2; i++) {
    if (this.elt[i] === null && lbl.elt[i] !== null) {
      this.elt[i] = new jsts.geomgraph.TopologyLocation(lbl.elt[i]);
    } else {
      this.elt[i].merge(lbl.elt[i]);
    }
  }
};


/**
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getGeometryCount = function() {
  var count = 0;
  if (!this.elt[0].isNull()) {
    count++;
  }
  if (!this.elt[1].isNull()) {
    count++;
  }
  return count;
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isNull = function(geomIndex) {
  return this.elt[geomIndex].isNull();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isAnyNull = function(geomIndex) {
  return this.elt[geomIndex].isAnyNull();
};


/**
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea = function() {
  if (arguments.length == 1) {
    return this.isArea2(arguments[0]);
  }

  return this.elt[0].isArea() || this.elt[1].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea2 = function(geomIndex) {
  return this.elt[geomIndex].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isLine = function(geomIndex) {
  return this.elt[geomIndex].isLine();
};


/**
 * @param {Label}
 *          lbl
 * @param {int}
 *          side
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isEqualOnSide = function(lbl, side) {
  return this.elt[0].isEqualOnSide(lbl.elt[0], side) &&
      this.elt[1].isEqualOnSide(lbl.elt[1], side);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.allPositionsEqual = function(geomIndex, loc) {
  return this.elt[geomIndex].allPositionsEqual(loc);
};


/**
 * Converts one GeometryLocation to a Line location
 *
 * @param {int}
 *          geomIndex
 */
jsts.geomgraph.Label.prototype.toLine = function(geomIndex) {
  if (this.elt[geomIndex].isArea()) {
    this.elt[geomIndex] = new jsts.geomgraph.TopologyLocation(this.elt[geomIndex].location[0]);
  }
};
