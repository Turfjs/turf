/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Writes the Well-Known Text representation of a {@link Geometry}. The
 * Well-Known Text format is defined in the <A
 * HREF="http://www.opengis.org/techno/specs.htm"> OGC Simple Features
 * Specification for SQL</A>.
 * <p>
 * The <code>WKTWriter</code> outputs coordinates rounded to the precision
 * model. Only the maximum number of decimal places necessary to represent the
 * ordinates to the required precision will be output.
 * <p>
 * The SFS WKT spec does not define a special tag for {@link LinearRing}s.
 * Under the spec, rings are output as <code>LINESTRING</code>s.
 *
 * @see WKTReader
 * @constructor
 */
jsts.io.WKTWriter = function() {
  this.parser = new jsts.io.WKTParser(this.geometryFactory);
};


/**
 * Converts a <code>Geometry</code> to its Well-known Text representation.
 *
 * @param {jsts.geom.Geometry}
 *          geometry a <code>Geometry</code> to process.
 * @return {string} a <Geometry Tagged Text> string (see the OpenGIS Simple
 *         Features Specification).
 */
jsts.io.WKTWriter.prototype.write = function(geometry) {
  var wkt = this.parser.write(geometry);

  return wkt;
};

/**
 * Generates the WKT for a <tt>LINESTRING</tt> specified by two
 * {@link Coordinate}s.
 *
 * @param p0
 *          the first coordinate.
 * @param p1
 *          the second coordinate.
 *
 * @return the WKT.
 */
jsts.io.WKTWriter.toLineString = function(p0, p1) {
  if (arguments.length !== 2) {
    throw new jsts.error.NotImplementedError();
  }

  return 'LINESTRING ( ' + p0.x + ' ' + p0.y + ', ' + p1.x + ' ' + p1.y + ' )';
};
