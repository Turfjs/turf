describe('jsts.operation.valid.IsValidOp', function() {
  
  var geometryFactory = new jsts.geom.GeometryFactory(), coordinate, point, isValidOp, valid, line, pts, err;

  var wktReader = new jsts.io.WKTReader();
  
  it('Can be created',function(){
    coordinate = new jsts.geom.Coordinate(1,2);
    point = geometryFactory.createPoint(coordinate);
    
    isValidOp = new jsts.operation.valid.IsValidOp(point);
    
    expect(isValidOp).toBeDefined();
  });
  
  it('Returns true for a valid line.', function() {
    var goodCoord0 = new jsts.geom.Coordinate(1.0, 1.0);
    var goodCoord1 = new jsts.geom.Coordinate(0.0, 0.0);
    pts = [goodCoord0, goodCoord1];
    
    line = geometryFactory.createLineString(pts);    
    isValidOp = new jsts.operation.valid.IsValidOp(line);
    
    valid = isValidOp.isValid();
    
    expect(valid).toBeTruthy();
  });
  
  it('Returns false for a self intersecting polygon.', function() {
    var coord0 = new jsts.geom.Coordinate(0.0, 0.0);
    var coord1 = new jsts.geom.Coordinate(1.0, 1.0);
    var coord2 = new jsts.geom.Coordinate(0.0, 1.0);
    var coord3 = new jsts.geom.Coordinate(1.0, 0.0);
    var coord4 = new jsts.geom.Coordinate(0.0, 0.0);
    
    pts = [coord0,coord1,coord2,coord3,coord4];
    var ring = geometryFactory.createLinearRing(pts);
    var polygon = geometryFactory.createPolygon(ring,[]);
    
    isValidOp = new jsts.operation.valid.IsValidOp(polygon);
    valid = isValidOp.isValid();
    
    expect(valid).toBeFalsy();
    
    err = isValidOp.getValidationError();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION);
  });
  
  it('Detects a NaN- coordinate.', function() {
    var badCoord = new jsts.geom.Coordinate(1.0, Number.NaN);
    var goodCoord = new jsts.geom.Coordinate(0.0, 0.0);
    pts = [badCoord, goodCoord];
    
    line = geometryFactory.createLineString(pts);    
    isValidOp = new jsts.operation.valid.IsValidOp(line);
    
    valid = isValidOp.isValid();
    expect(valid).toBeFalsy();
    
    err = isValidOp.getValidationError();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE);
  });
  it('Detects nested holes.', function() {
    var nestedPoly = wktReader.read('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0),(1 1, 1 9, 9 9, 9 1, 1 1),(2 2, 2 8, 8 8, 8 2, 2 2))');
    
    isValidOp = new jsts.operation.valid.IsValidOp(nestedPoly);    
    valid = isValidOp.isValid();
    err = isValidOp.getValidationError();
    expect(valid).toBeFalsy();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.NESTED_HOLES);
  });
  
  it('Detects hole in the exterior of the outer ring.', function() {
    var nestedPoly = wktReader.read('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0),(100 100, 100 110, 110 110, 110 100, 100 100))');
    
    isValidOp = new jsts.operation.valid.IsValidOp(nestedPoly);    
    valid = isValidOp.isValid();
    err = isValidOp.getValidationError();
    expect(valid).toBeFalsy();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL);
  });
  
  it('Detects intersecting rings.', function() {
    var poly = wktReader.read('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0),(1 1, 1 11, 9 9, 9 1, 1 1))');
    
    isValidOp = new jsts.operation.valid.IsValidOp(poly);    
    valid = isValidOp.isValid();
    err = isValidOp.getValidationError();
    expect(valid).toBeFalsy();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION);
  });
  
  it('Handles MultiPolygons', function() {
    var multiPoly = wktReader.read('MULTIPOLYGON(((0 0, 0 1, 1 1, 1 0, 0 0)),((10 10, 10 11, 11 11, 11 10, 10 10)))');
    isValidOp = new jsts.operation.valid.IsValidOp(multiPoly);    
    valid = isValidOp.isValid();
    err = isValidOp.getValidationError();
    expect(valid).toBeTruthy();      
  });
  
  it('Detects too few points in a polygon.', function() {
    var p1 = new jsts.geom.Coordinate(0,0);
    var p2 = new jsts.geom.Coordinate(1,1);
    var points = [p1,p2,p1];
    var ring = new jsts.geom.LinearRing(points);  
    var poly = new jsts.geom.Polygon(ring,[]);

    isValidOp = new jsts.operation.valid.IsValidOp(poly);    
    valid = isValidOp.isValid();
    err = isValidOp.getValidationError(); 
    expect(valid).toBeFalsy();
    expect(err.getErrorType()).toBe(jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS);
  });
});