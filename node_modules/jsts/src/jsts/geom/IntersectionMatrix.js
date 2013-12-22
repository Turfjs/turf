/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geom/Dimension.js
   */

  var Location = jsts.geom.Location;
  var Dimension = jsts.geom.Dimension;

  /**
   * Models a Dimensionally Extended Nine-Intersection Model (DE-9IM) matrix.
   * This class is used to represent intersection matrices (such as "212FF1FF2")
   * capturing the topological relationship between two {@link Geometry}s. It
   * can also be represent patterns (such as "T*T******")for matching existing
   * matrices.
   *
   * Methods are provided to:
   * <UL>
   * <LI> set and query the elements of the matrix in a convenient fashion
   * <LI> convert to and from the standard string representation (specified in
   * SFS Section 2.1.13.2).
   * <LI> test to see if a matrix matches a given pattern string.
   * </UL>
   * <P>
   *
   * For a description of the DE-9IM, see the <A
   * HREF="http://www.opengis.org/techno/specs.htm">OpenGIS Simple Features
   * Specification for SQL</A>.
   *
   * The entries of the matrix are defined by the constants in the
   * {@link Dimension} class. The indices of the matrix represent the
   * topological locations that occur in a geometry (Interior, Boundary,
   * Exterior). These are provided as constants in the {@link Location} class.
   *
   * @param {string/IntersectionMatrix}
   *          elements
   * @constructor
   */
  jsts.geom.IntersectionMatrix = function(elements) {
    var other = elements;

    if (elements === undefined || elements === null) {
      this.matrix = [[], [], []];
      this.setAll(Dimension.FALSE);
    } else if (typeof elements === 'string') {
      this.set(elements);
    } else if (other instanceof jsts.geom.IntersectionMatrix) {

      this.matrix[Location.INTERIOR][Location.INTERIOR] = other.matrix[Location.INTERIOR][Location.INTERIOR];
      this.matrix[Location.INTERIOR][Location.BOUNDARY] = other.matrix[Location.INTERIOR][Location.BOUNDARY];
      this.matrix[Location.INTERIOR][Location.EXTERIOR] = other.matrix[Location.INTERIOR][Location.EXTERIOR];
      this.matrix[Location.BOUNDARY][Location.INTERIOR] = other.matrix[Location.BOUNDARY][Location.INTERIOR];
      this.matrix[Location.BOUNDARY][Location.BOUNDARY] = other.matrix[Location.BOUNDARY][Location.BOUNDARY];
      this.matrix[Location.BOUNDARY][Location.EXTERIOR] = other.matrix[Location.BOUNDARY][Location.EXTERIOR];
      this.matrix[Location.EXTERIOR][Location.INTERIOR] = other.matrix[Location.EXTERIOR][Location.INTERIOR];
      this.matrix[Location.EXTERIOR][Location.BOUNDARY] = other.matrix[Location.EXTERIOR][Location.BOUNDARY];
      this.matrix[Location.EXTERIOR][Location.EXTERIOR] = other.matrix[Location.EXTERIOR][Location.EXTERIOR];
    }
  };


  /**
   * Internal representation of this <code>IntersectionMatrix</code>.
   *
   * @type {int[][]}
   * @private
   */
  jsts.geom.IntersectionMatrix.prototype.matrix = null;


  /**
   * Adds one matrix to another. Addition is defined by taking the maximum
   * dimension value of each position in the summand matrices.
   *
   * @param {IntersectionMatrix}
   *          im the matrix to add.
   */
  jsts.geom.IntersectionMatrix.prototype.add = function(im) {
    var i, j;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        this.setAtLeast(i, j, im.get(i, j));
      }
    }
  };


  /**
   * Returns true if the dimension value satisfies the dimension symbol.
   *
   * @param {int}
   *          actualDimensionValue a number that can be stored in the
   *          <code>IntersectionMatrix</code> . Possible values are
   *          <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
   * @param {string}
   *          requiredDimensionSymbol a character used in the string
   *          representation of an <code>IntersectionMatrix</code>. Possible
   *          values are <code>{T, F, * , 0, 1, 2}</code>.
   * @return {boolean} true if the dimension symbol encompasses the dimension
   *         value.
   */
  jsts.geom.IntersectionMatrix.matches = function(actualDimensionValue,
      requiredDimensionSymbol) {
    if (typeof actualDimensionValue === 'string') {
      return jsts.geom.IntersectionMatrix.matches2.call(this, arguments);
    }

    if (requiredDimensionSymbol === '*') {
      return true;
    }
    if (requiredDimensionSymbol === 'T' &&
        (actualDimensionValue >= 0 || actualDimensionValue === Dimension.TRUE)) {
      return true;
    }
    if (requiredDimensionSymbol === 'F' &&
        actualDimensionValue === Dimension.FALSE) {
      return true;
    }
    if (requiredDimensionSymbol === '0' && actualDimensionValue === Dimension.P) {
      return true;
    }
    if (requiredDimensionSymbol === '1' && actualDimensionValue === Dimension.L) {
      return true;
    }
    if (requiredDimensionSymbol === '2' && actualDimensionValue === Dimension.A) {
      return true;
    }
    return false;
  };


  /**
   * Returns true if each of the actual dimension symbols satisfies the
   * corresponding required dimension symbol.
   *
   * @param {string}
   *          actualDimensionSymbols nine dimension symbols to validate.
   *          Possible values are <code>{T, F, * , 0, 1, 2}</code>.
   * @param {string}
   *          requiredDimensionSymbols nine dimension symbols to validate
   *          against. Possible values are <code>{T, F, * , 0, 1, 2}</code>.
   * @return {boolean} true if each of the required dimension symbols encompass
   *         the corresponding actual dimension symbol.
   */
  jsts.geom.IntersectionMatrix.matches2 = function(actualDimensionSymbols,
      requiredDimensionSymbols) {
    var m = new jsts.geom.IntersectionMatrix(actualDimensionSymbols);
    return m.matches(requiredDimensionSymbols);
  };


  /**
   * Changes the value of one of this <code>IntersectionMatrix</code>s
   * elements.
   *
   * @param {int}
   *          row the row of this <code>IntersectionMatrix</code>, indicating
   *          the interior, boundary or exterior of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          column the column of this <code>IntersectionMatrix</code>,
   *          indicating the interior, boundary or exterior of the second
   *          <code>Geometry.</code>
   * @param {int}
   *          dimensionValue the new value of the element.
   */
  jsts.geom.IntersectionMatrix.prototype.set = function(row, column, dimensionValue) {
    if (typeof row === 'string') {
      this.set2(row);
      return;
    }

    this.matrix[row][column] = dimensionValue;
  };


  /**
   * Changes the elements of this <code>IntersectionMatrix</code> to the
   * dimension symbols in <code>dimensionSymbols</code>.
   *
   * @param {String}
   *          dimensionSymbols nine dimension symbols to which to set this
   *          <code>IntersectionMatrix</code> s elements. Possible values are
   *          <code>{T, F, * , 0, 1, 2}.</code>
   */
  jsts.geom.IntersectionMatrix.prototype.set2 = function(dimensionSymbols) {
    for (var i = 0; i < dimensionSymbols.length(); i++) {
      var row = i / 3;
      var col = i % 3;
      this.matrix[row][col] = Dimension.toDimensionValue(dimensionSymbols
          .charAt(i));
    }
  };


  /**
   * Changes the specified element to <code>minimumDimensionValue</code> if
   * the element is less.
   *
   * @param {int}
   *          row the row of this <code>IntersectionMatrix</code> , indicating
   *          the interior, boundary or exterior of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          column the column of this <code>IntersectionMatrix</code> ,
   *          indicating the interior, boundary or exterior of the second
   *          <code>Geometry.</code>
   * @param {int}
   *          minimumDimensionValue the dimension value with which to compare
   *          the element. The order of dimension values from least to greatest
   *          is <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code>.
   */
  jsts.geom.IntersectionMatrix.prototype.setAtLeast = function(row, column,
      minimumDimensionValue) {
    if (arguments.length === 1) {
      this.setAtLeast2(arguments[0]);
      return;
    }

    if (this.matrix[row][column] < minimumDimensionValue) {
      this.matrix[row][column] = minimumDimensionValue;
    }
  };


  /**
   * If row >= 0 and column >= 0, changes the specified element to
   * <code>minimumDimensionValue</code> if the element is less. Does nothing
   * if row <0 or column < 0.
   *
   * @param {int}
   *          row the row of this <code>IntersectionMatrix</code> , indicating
   *          the interior, boundary or exterior of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          column the column of this <code>IntersectionMatrix</code> ,
   *          indicating the interior, boundary or exterior of the second
   *          <code>Geometry.</code>
   * @param {int}
   *          minimumDimensionValue the dimension value with which to compare
   *          the element. The order of dimension values from least to greatest
   *          is <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code>.
   */
  jsts.geom.IntersectionMatrix.prototype.setAtLeastIfValid = function(row, column,
      minimumDimensionValue) {
    if (row >= 0 && column >= 0) {
      this.setAtLeast(row, column, minimumDimensionValue);
    }
  };


  /**
   * For each element in this <code>IntersectionMatrix</code>, changes the
   * element to the corresponding minimum dimension symbol if the element is
   * less.
   *
   * @param {string}
   *          minimumDimensionSymbols nine dimension symbols with which to
   *          compare the elements of this <code>IntersectionMatrix</code>.
   *          The order of dimension values from least to greatest is
   *          <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code> .
   */
  jsts.geom.IntersectionMatrix.prototype.setAtLeast2 = function(minimumDimensionSymbols) {
    var i;
    for (i = 0; i < minimumDimensionSymbols.length; i++) {
      var row = parseInt(i / 3);
      var col = parseInt(i % 3);
      this.setAtLeast(row, col, jsts.geom.Dimension
          .toDimensionValue(minimumDimensionSymbols.charAt(i)));
    }
  };


  /**
   * Changes the elements of this <code>IntersectionMatrix</code> to
   * <code>dimensionValue</code> .
   *
   * @param {int}
   *          dimensionValue the dimension value to which to set this
   *          <code>IntersectionMatrix</code> s elements. Possible values
   *          <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code> .
   */
  jsts.geom.IntersectionMatrix.prototype.setAll = function(dimensionValue) {
    var ai, bi;
    for (ai = 0; ai < 3; ai++) {
      for (bi = 0; bi < 3; bi++) {
        this.matrix[ai][bi] = dimensionValue;
      }
    }
  };


  /**
   * Returns the value of one of this matrix entries. The value of the provided
   * index is one of the values from the {@link Location} class. The value
   * returned is a constant from the {@link Dimension} class.
   *
   * @param {int}
   *          row the row of this <code>IntersectionMatrix</code>, indicating
   *          the interior, boundary or exterior of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          column the column of this <code>IntersectionMatrix</code>,
   *          indicating the interior, boundary or exterior of the second
   *          <code>Geometry.</code>
   * @return {int} the dimension value at the given matrix position.
   */
  jsts.geom.IntersectionMatrix.prototype.get = function(row, column) {
    return this.matrix[row][column];
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * FF*FF****.
   *
   * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
   *         related by this <code>IntersectionMatrix</code> are disjoint.
   */
  jsts.geom.IntersectionMatrix.prototype.isDisjoint = function() {
    return this.matrix[Location.INTERIOR][Location.INTERIOR] === Dimension.FALSE &&
        this.matrix[Location.INTERIOR][Location.BOUNDARY] === Dimension.FALSE &&
        this.matrix[Location.BOUNDARY][Location.INTERIOR] === Dimension.FALSE &&
        this.matrix[Location.BOUNDARY][Location.BOUNDARY] === Dimension.FALSE;
  };


  /**
   * Returns <code>true</code> if <code>isDisjoint</code> returns false.
   *
   * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
   *         related by this <code>IntersectionMatrix</code> intersect.
   */
  jsts.geom.IntersectionMatrix.prototype.isIntersects = function() {
    return !this.isDisjoint();
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * FT*******, F**T***** or F***T****.
   *
   * @param {int}
   *          dimensionOfGeometryA the dimension of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          dimensionOfGeometryB the dimension of the second
   *          <code>Geometry.</code>
   * @return {boolean} <code>true</code> if the two <code>Geometry</code> s
   *         related by this <code>IntersectionMatrix</code> touch; Returns
   *         false if both <code>Geometry</code>s are points.
   */
  jsts.geom.IntersectionMatrix.prototype.isTouches = function(dimensionOfGeometryA,
      dimensionOfGeometryB) {
    if (dimensionOfGeometryA > dimensionOfGeometryB) {
      // no need to get transpose because pattern matrix is symmetrical
      return this.isTouches(dimensionOfGeometryB, dimensionOfGeometryA);
    }
    if ((dimensionOfGeometryA == Dimension.A && dimensionOfGeometryB == Dimension.A) ||
        (dimensionOfGeometryA == Dimension.L && dimensionOfGeometryB == Dimension.L) ||
        (dimensionOfGeometryA == Dimension.L && dimensionOfGeometryB == Dimension.A) ||
        (dimensionOfGeometryA == Dimension.P && dimensionOfGeometryB == Dimension.A) ||
        (dimensionOfGeometryA == Dimension.P && dimensionOfGeometryB == Dimension.L)) {
      return this.matrix[Location.INTERIOR][Location.INTERIOR] === Dimension.FALSE &&
          (jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.INTERIOR][Location.BOUNDARY], 'T') ||
              jsts.geom.IntersectionMatrix.matches(
                  this.matrix[Location.BOUNDARY][Location.INTERIOR], 'T') || jsts.geom.IntersectionMatrix
              .matches(this.matrix[Location.BOUNDARY][Location.BOUNDARY], 'T'));
    }
    return false;
  };


  /**
   * Tests whether this geometry crosses the specified geometry.
   * <p>
   * The <code>crosses</code> predicate has the following equivalent
   * definitions:
   * <ul>
   * <li>The geometries have some but not all interior points in common.
   * <li>The DE-9IM Intersection Matrix for the two geometries is
   * <ul>
   * <li>T*T****** (for P/L, P/A, and L/A situations)
   * <li>T*****T** (for L/P, L/A, and A/L situations)
   * <li>0******** (for L/L situations)
   * </ul>
   * </ul>
   * For any other combination of dimensions this predicate returns
   * <code>false</code>.
   * <p>
   * The SFS defined this predicate only for P/L, P/A, L/L, and L/A situations.
   * JTS extends the definition to apply to L/P, A/P and A/L situations as well.
   * This makes the relation symmetric.
   *
   * @param {int}
   *          dimensionOfGeometryA the dimension of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          dimensionOfGeometryB the dimension of the second
   *          <code>Geometry.</code>
   * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
   *         related by this <code>IntersectionMatrix</code> cross.
   */
  jsts.geom.IntersectionMatrix.prototype.isCrosses = function(dimensionOfGeometryA,
      dimensionOfGeometryB) {
    if ((dimensionOfGeometryA == Dimension.P && dimensionOfGeometryB == Dimension.L) ||
        (dimensionOfGeometryA == Dimension.P && dimensionOfGeometryB == Dimension.A) ||
        (dimensionOfGeometryA == Dimension.L && dimensionOfGeometryB == Dimension.A)) {
      return jsts.geom.IntersectionMatrix.matches(
          this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.INTERIOR][Location.EXTERIOR], 'T');
    }
    if ((dimensionOfGeometryA == Dimension.L && dimensionOfGeometryB == Dimension.P) ||
        (dimensionOfGeometryA == Dimension.A && dimensionOfGeometryB == Dimension.P) ||
        (dimensionOfGeometryA == Dimension.A && dimensionOfGeometryB == Dimension.L)) {
      return jsts.geom.IntersectionMatrix.matches(
          matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.EXTERIOR][Location.INTERIOR], 'T');
    }
    if (dimensionOfGeometryA === Dimension.L &&
        dimensionOfGeometryB === Dimension.L) {
      return this.matrix[Location.INTERIOR][Location.INTERIOR] === 0;
    }
    return false;
  };


  /**
   * Tests whether this <code>IntersectionMatrix</code> is T*F**F***.
   *
   * @return {boolean} <code>true</code> if the first <code>Geometry</code>
   *         is within the second.
   */
  jsts.geom.IntersectionMatrix.prototype.isWithin = function() {
    return jsts.geom.IntersectionMatrix.matches(
        this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
        this.matrix[Location.INTERIOR][Location.EXTERIOR] == Dimension.FALSE &&
        this.matrix[Location.BOUNDARY][Location.EXTERIOR] == Dimension.FALSE;
  };


  /**
   * Tests whether this <code>IntersectionMatrix</code> is T*****FF*.
   *
   * @return {boolean} <code>true</code> if the first <code>Geometry</code>
   *         contains the second.
   */
  jsts.geom.IntersectionMatrix.prototype.isContains = function() {
    return jsts.geom.IntersectionMatrix.matches(
        this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
        this.matrix[Location.EXTERIOR][Location.INTERIOR] == Dimension.FALSE &&
        this.matrix[Location.EXTERIOR][Location.BOUNDARY] == Dimension.FALSE;
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * <code>T*****FF*</code> or <code>*T****FF*</code> or
   * <code>***T**FF*</code> or <code>****T*FF*</code>
   *
   * @return {boolean} <code>true</code> if the first <code>Geometry</code>
   *         covers the second.
   */
  jsts.geom.IntersectionMatrix.prototype.isCovers = function() {
    var hasPointInCommon = jsts.geom.IntersectionMatrix.matches(
        this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.INTERIOR][Location.BOUNDARY], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.BOUNDARY][Location.INTERIOR], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.BOUNDARY][Location.BOUNDARY], 'T');

    return hasPointInCommon &&
        this.matrix[Location.EXTERIOR][Location.INTERIOR] == Dimension.FALSE &&
        this.matrix[Location.EXTERIOR][Location.BOUNDARY] == Dimension.FALSE;
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * <code>T*F**F***</code> or <code>*TF**F***</code> or
   * <code>**FT*F***</code> or <code>**F*TF***</code>
   *
   * @return {boolean} <code>true</code> if the first <code>Geometry</code>
   *         is covered by the second.
   */
  jsts.geom.IntersectionMatrix.prototype.isCoveredBy = function() {
    var hasPointInCommon = jsts.geom.IntersectionMatrix.matches(
        this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.INTERIOR][Location.BOUNDARY], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.BOUNDARY][Location.INTERIOR], 'T') ||
        jsts.geom.IntersectionMatrix.matches(
            this.matrix[Location.BOUNDARY][Location.BOUNDARY], 'T');

    return hasPointInCommon &&
        this.matrix[Location.INTERIOR][Location.EXTERIOR] === Dimension.FALSE &&
        this.matrix[Location.BOUNDARY][Location.EXTERIOR] === Dimension.FALSE;
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * T*F**FFF*.
   *
   * @param {int}
   *          dimensionOfGeometryA the dimension of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          dimensionOfGeometryB the dimension of the second
   *          <code>Geometry.</code>
   * @return {boolean} <code>true</code> if the two <code>Geometry</code> s
   *         related by this <code>IntersectionMatrix</code> are equal; the
   *         <code>Geometry</code>s must have the same dimension for this
   *         function to return <code>true.</code>
   */
  jsts.geom.IntersectionMatrix.prototype.isEquals = function(dimensionOfGeometryA,
      dimensionOfGeometryB) {
    if (dimensionOfGeometryA !== dimensionOfGeometryB) {
      return false;
    }
    return jsts.geom.IntersectionMatrix.matches(
        this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
        this.matrix[Location.EXTERIOR][Location.INTERIOR] === Dimension.FALSE &&
        this.matrix[Location.INTERIOR][Location.EXTERIOR] === Dimension.FALSE &&
        this.matrix[Location.EXTERIOR][Location.BOUNDARY] === Dimension.FALSE &&
        this.matrix[Location.BOUNDARY][Location.EXTERIOR] === Dimension.FALSE;
  };


  /**
   * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
   * <UL>
   * <LI> T*T***T** (for two points or two surfaces)
   * <LI> 1*T***T** (for two curves)
   * </UL>.
   *
   * @param {int}
   *          dimensionOfGeometryA the dimension of the first
   *          <code>Geometry.</code>
   * @param {int}
   *          dimensionOfGeometryB the dimension of the second
   *          <code>Geometry.</code>
   * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
   *         related by this <code>IntersectionMatrix</code> overlap. For this
   *         function to return <code>true</code>, the <code>Geometry</code>s
   *         must be two points, two curves or two surfaces.
   */
  jsts.geom.IntersectionMatrix.prototype.isOverlaps = function(dimensionOfGeometryA,
      dimensionOfGeometryB) {
    if ((dimensionOfGeometryA == Dimension.P && dimensionOfGeometryB === Dimension.P) ||
        (dimensionOfGeometryA == Dimension.A && dimensionOfGeometryB === Dimension.A)) {
      return jsts.geom.IntersectionMatrix.matches(
          this.matrix[Location.INTERIOR][Location.INTERIOR], 'T') &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.INTERIOR][Location.EXTERIOR], 'T') &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.EXTERIOR][Location.INTERIOR], 'T');
    }
    if (dimensionOfGeometryA === Dimension.L &&
        dimensionOfGeometryB === Dimension.L) {
      return this.matrix[Location.INTERIOR][Location.INTERIOR] == 1 &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.INTERIOR][Location.EXTERIOR], 'T') &&
          jsts.geom.IntersectionMatrix.matches(
              this.matrix[Location.EXTERIOR][Location.INTERIOR], 'T');
    }
    return false;
  };


  /**
   * Returns whether the elements of this <code>IntersectionMatrix</code>
   * satisfies the required dimension symbols.
   *
   * @param {string}
   *          requiredDimensionSymbols nine dimension symbols with which to
   *          compare the elements of this <code>IntersectionMatrix</code>.
   *          Possible values are <code>{T, F, * , 0, 1, 2}</code>.
   * @return {boolean} <code>true</code> if this
   *         <code>IntersectionMatrix</code> matches the required dimension
   *         symbols.
   */
  jsts.geom.IntersectionMatrix.prototype.matches = function(requiredDimensionSymbols) {
    if (requiredDimensionSymbols.length != 9) {
      throw new jsts.error.IllegalArgumentException('Should be length 9: ' +
          requiredDimensionSymbols);
    }
    for (var ai = 0; ai < 3; ai++) {
      for (var bi = 0; bi < 3; bi++) {
        if (!jsts.geom.IntersectionMatrix.matches(this.matrix[ai][bi],
            requiredDimensionSymbols.charAt(3 * ai + bi))) {
          return false;
        }
      }
    }
    return true;
  };


  /**
   * Transposes this jsts.geom.IntersectionMatrix.
   *
   * @return {IntersectionMatrix} this <code>IntersectionMatrix</code> as a
   *         convenience.
   */
  jsts.geom.IntersectionMatrix.prototype.transpose = function() {
    var temp = matrix[1][0];
    this.matrix[1][0] = this.matrix[0][1];
    this.matrix[0][1] = temp;
    temp = this.matrix[2][0];
    this.matrix[2][0] = this.matrix[0][2];
    this.matrix[0][2] = temp;
    temp = this.matrix[2][1];
    this.matrix[2][1] = this.matrix[1][2];
    this.matrix[1][2] = temp;
    return this;
  };


  /**
   * Returns a nine-character <code>String</code> representation of this
   * <code>IntersectionMatrix</code> .
   *
   * @return {string} the nine dimension symbols of this
   *         <code>IntersectionMatrix</code> in row-major order.
   */
  jsts.geom.IntersectionMatrix.prototype.toString = function() {
    var ai, bi, buf = '';
    for (ai = 0; ai < 3; ai++) {
      for (bi = 0; bi < 3; bi++) {
        buf += Dimension.toDimensionSymbol(this.matrix[ai][bi]);
      }
    }
    return buf;
  };

})();
