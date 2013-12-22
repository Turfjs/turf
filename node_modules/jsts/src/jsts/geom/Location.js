/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constants representing the different topological locations which can occur in
 * a {@link Geometry}. The constants are also used as the row and column
 * indices of DE-9IM {@link IntersectionMatrix}es.
 *
 * @constructor
 */
jsts.geom.Location = function() {
};


/**
 * The location value for the interior of a geometry. Also, DE-9IM row index of
 * the interior of the first geometry and column index of the interior of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.INTERIOR = 0;


/**
 * The location value for the boundary of a geometry. Also, DE-9IM row index of
 * the boundary of the first geometry and column index of the boundary of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.BOUNDARY = 1;


/**
 * The location value for the exterior of a geometry. Also, DE-9IM row index of
 * the exterior of the first geometry and column index of the exterior of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.EXTERIOR = 2;


/**
 * Used for uninitialized location values.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.NONE = -1;


/**
 * Converts the location value to a location symbol, for example,
 * <code>EXTERIOR => 'e'</code> .
 *
 * @param {number}
 *          locationValue either EXTERIOR, BOUNDARY, INTERIOR or NONE.
 * @return {string} either 'e', 'b', 'i' or '-'.
 */
jsts.geom.Location.toLocationSymbol = function(locationValue) {
  switch (locationValue) {
    case jsts.geom.Location.EXTERIOR:
      return 'e';
    case jsts.geom.Location.BOUNDARY:
      return 'b';
    case jsts.geom.Location.INTERIOR:
      return 'i';
    case jsts.geom.Location.NONE:
      return '-';
  }
  throw new jsts.IllegalArgumentError('Unknown location value: ' +
      locationValue);
};
