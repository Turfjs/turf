

/**
 * Computes the boundary of a {@link Geometry}.
 * Allows specifying the {@link BoundaryNodeRule} to be used.
 * This operation will always return a {@link Geometry} of the appropriate
 * dimension for the boundary (even if the input geometry is empty).
 * The boundary of zero-dimensional geometries (Points) is
 * always the empty {@link GeometryCollection}.
 *
 * @author Martin Davis
 * @version 1.7
 */

jsts.operation.BoundaryOp = function(geom, bnRule) {
  this.geom = geom;
  this.geomFact = geom.getFactory();
  this.bnRule = bnRule || jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;
};


/**
   * @type {Geometry}
   * @private
   */
jsts.operation.BoundaryOp.prototype.geom = null;


/**
   * @type {GeometryFactory}
   * @private
   */
jsts.operation.BoundaryOp.prototype.geomFact = null;


/**
   * @type {BoundaryNodeRule}
   * @private
   */
jsts.operation.BoundaryOp.prototype.bnRule = null;


/**
   * @return {Geometry}
   */
jsts.operation.BoundaryOp.prototype.getBoundary = function()  {
  if (this.geom instanceof jsts.geom.LineString) return this.boundaryLineString(this.geom);
  if (this.geom instanceof jsts.geom.MultiLineString) return this.boundaryMultiLineString(this.geom);
  return this.geom.getBoundary();
};


/**
   * @return {MultiPoint}
   * @private
   */
jsts.operation.BoundaryOp.prototype.getEmptyMultiPoint = function()  {
  return this.geomFact.createMultiPoint(null);
};


/**
   * @param {MultiLineString} mLine
   * @return {Geometry}
   * @private
   */
jsts.operation.BoundaryOp.prototype.boundaryMultiLineString = function(mLine)  {
  if (this.geom.isEmpty()) {
    return this.getEmptyMultiPoint();
  }

  var bdyPts = this.computeBoundaryCoordinates(mLine);

  // return Point or MultiPoint
  if (bdyPts.length == 1) {
    return this.geomFact.createPoint(bdyPts[0]);
  }
  // this handles 0 points case as well
  return this.geomFact.createMultiPoint(bdyPts);
};


/**
   * @type {Array}
   * @private
   */
jsts.operation.BoundaryOp.prototype.endpoints = null;


/**
   * @param {MultiLineString} mLine
   * @return {Array.<Coordinate>}
   * @private
   */
jsts.operation.BoundaryOp.prototype.computeBoundaryCoordinates = function(mLine)  {
  var i, line, endpoint, bdyPts = [];

  this.endpoints = [];
  for (i = 0; i < mLine.getNumGeometries(); i++) {
    line = mLine.getGeometryN(i);
    if (line.getNumPoints() == 0)
      continue;
    this.addEndpoint(line.getCoordinateN(0));
    this.addEndpoint(line.getCoordinateN(line.getNumPoints() - 1));
  }

  for (i = 0; i < this.endpoints.length; i++) {
    endpoint = this.endpoints[i];
    if (this.bnRule.isInBoundary(endpoint.count)) {
      bdyPts.push(endpoint.coordinate);
    }
  }

  return bdyPts;
};


/**
   * @param {Coordinate} pt
   * @private
   */
jsts.operation.BoundaryOp.prototype.addEndpoint = function(pt) {
  var i, endpoint, found = false;
  for (i = 0; i < this.endpoints.length; i++) {
    endpoint = this.endpoints[i];
    if (endpoint.coordinate.equals(pt)) {
      found = true;
      break;
    }
  }

  if (!found) {
    endpoint = {};
    endpoint.coordinate = pt;
    endpoint.count = 0;
    this.endpoints.push(endpoint);
  }

  endpoint.count++;
};


/**
   * @param {LineString} line
   * @return {Geometry}
   * @private
   */
jsts.operation.BoundaryOp.prototype.boundaryLineString = function(line)  {
  if (this.geom.isEmpty()) {
    return this.getEmptyMultiPoint();
  }

  if (line.isClosed()) {
    // check whether endpoints of valence 2 are on the boundary or not
    var closedEndpointOnBoundary = this.bnRule.isInBoundary(2);
    if (closedEndpointOnBoundary) {
      return line.getStartPoint();
    }
    else {
      return this.geomFact.createMultiPoint(null);
    }
  }
  return this.geomFact.createMultiPoint([line.getStartPoint(),
        line.getEndPoint()]
  );
};
