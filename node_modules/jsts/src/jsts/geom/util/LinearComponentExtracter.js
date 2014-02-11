/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryComponentFilter.js
 */



/**
 * Extracts all the 1-dimensional ({@link LineString}) components from a
 * {@link Geometry}.
 *
 * @extends {jsts.geom.GeometryComponentFilter}
 * @constructor
 */
jsts.geom.util.LinearComponentExtracter = function(lines, isForcedToLineString) {
  this.lines = lines;
  this.isForcedToLineString = isForcedToLineString;
};

jsts.geom.util.LinearComponentExtracter.prototype = new jsts.geom.GeometryComponentFilter();


/**
 * @private
 */
jsts.geom.util.LinearComponentExtracter.prototype.lines = null;


/**
 * @private
 */
jsts.geom.util.LinearComponentExtracter.prototype.isForcedToLineString = false;


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * NOTE: will call "overloaded" function depending on args.
 *
 * @param {[]}
 *          geoms the collection of geometries from which to extract linear
 *          components.
 * @param {[]}
 *          lines the collection to add the extracted linear components to.
 * @return {[]} the collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines = function(geoms, lines) {
  if (arguments.length == 1) {
    return jsts.geom.util.LinearComponentExtracter.getLines5.apply(this, arguments);
  }
  else if (arguments.length == 2 && typeof lines === 'boolean') {
    return jsts.geom.util.LinearComponentExtracter.getLines6.apply(this, arguments);
  }
  else if (arguments.length == 2 && geoms instanceof jsts.geom.Geometry) {
    return jsts.geom.util.LinearComponentExtracter.getLines3.apply(this, arguments);
  }
  else if (arguments.length == 3 && geoms instanceof jsts.geom.Geometry) {
    return jsts.geom.util.LinearComponentExtracter.getLines4.apply(this, arguments);
  }
  else if (arguments.length == 3) {
    return jsts.geom.util.LinearComponentExtracter.getLines2.apply(this, arguments);
  }

  for (var i = 0; i < geoms.length; i++) {
    var g = geoms[i];
    jsts.geom.util.LinearComponentExtracter.getLines3(g, lines);
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {[]}
 *          geoms the Collection of geometries from which to extract linear
 *          components.
 * @param {[]}
 *          lines the collection to add the extracted linear components to.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[]} the collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines2 = function(geoms, lines,
    forceToLineString) {
  for (var i = 0; i < geoms.length; i++) {
    var g = geoms[i];
    jsts.geom.util.LinearComponentExtracter.getLines4(g, lines,
        forceToLineString);
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {[]}
 *          lines the Collection to add the extracted linear components to.
 * @return {[]} the Collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines3 = function(geom, lines) {
  if (geom instanceof LineString) {
    lines.add(geom);
  } else {
    geom.apply(new jsts.geom.util.LinearComponentExtracter(lines));
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {[]}
 *          lines the Collection to add the extracted linear components to.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[]} the Collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines4 = function(geom, lines,
    forceToLineString) {
  geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,
      forceToLineString));
  return lines;
};


/**
 * Extracts the linear components from a single geometry. If more than one
 * geometry is to be processed, it is more efficient to create a single
 * {@link LinearComponentExtracter} instance and pass it to multiple geometries.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @return {[]} the list of linear components.
 */
jsts.geom.util.LinearComponentExtracter.getLines5 = function(geom) {
  return jsts.geom.util.LinearComponentExtracter.getLines6(geom, false);
};


/**
 * Extracts the linear components from a single geometry. If more than one
 * geometry is to be processed, it is more efficient to create a single
 * {@link LinearComponentExtracter} instance and pass it to multiple geometries.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[] the list of linear components.}
 */
jsts.geom.util.LinearComponentExtracter.getLines6 = function(geom,
    forceToLineString) {
  var lines = [];
  geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,
      forceToLineString));
  return lines;
};


/**
 * Indicates that LinearRing components should be converted to pure LineStrings.
 *
 * @param {boolean}
 *          isForcedToLineString true if LinearRings should be converted to
 *          LineStrings.
 */
jsts.geom.util.LinearComponentExtracter.prototype.setForceToLineString = function(
    isForcedToLineString) {
  this.isForcedToLineString = isForcedToLineString;
};

jsts.geom.util.LinearComponentExtracter.prototype.filter = function(geom) {
  if (this.isForcedToLineString && geom instanceof jsts.geom.LinearRing) {
    var line = geom.getFactory().createLineString(geom.getCoordinateSequence());
    this.lines.push(line);
    return;
  }
  // if not being forced, and this is a linear component
  // NOTE: inheritance will not show LinearRing to be of LineString heritance...
  if (geom instanceof jsts.geom.LineString || geom instanceof jsts.geom.LinearRing)
    this.lines.push(geom);

  // else this is not a linear component, so skip it
};
