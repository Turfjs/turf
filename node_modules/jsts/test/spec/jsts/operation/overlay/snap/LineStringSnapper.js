describe('jsts.operation.overlay.snap.LineStringSnapper', function() {
  var factory = new jsts.geom.GeometryFactory();
  var reader = new jsts.io.WKTReader();
  
  it('snaps a line to a point exactly on the line', function() {  
    var line = reader.read('LINESTRING (0 0, 0 10)');
    var point = reader.read('POINT (0 5)');
    
    var snapper = new jsts.operation.overlay.snap.LineStringSnapper(line, 1E-6);
    var newPoints = snapper.snapTo([point.coordinate]);
    var snappedGeom = factory.createLineString(newPoints);
    
    var expectedWKT = 'LINESTRING (0 0, 0 5, 0 10)'; 
    var expectedGeom = reader.read(expectedWKT);
    
    expect(expectedGeom.equals(snappedGeom)).toBeTruthy();
  });
  
  it('snaps a line to a point close to the line', function() {
    var line = reader.read('LINESTRING (0 0, 0 10)');
    var point = reader.read('POINT (0 5.000000001)');
    
    var snapper = new jsts.operation.overlay.snap.LineStringSnapper(line, 1E-6);
    var newPoints = snapper.snapTo([point.coordinate]);
    var snappedGeom = factory.createLineString(newPoints);
    
    var expectedWKT = 'LINESTRING (0 0, 0 5.000000001, 0 10)'; 
    var expectedGeom = reader.read(expectedWKT);
    
    expect(expectedGeom.equals(snappedGeom)).toBeTruthy();
  });
  
  it('does not snap a line to a point far away from the line', function() {
    var line = reader.read('LINESTRING (0 0, 0 10)');
    var point = reader.read('POINT (0 100)');
    
    var snapper = new jsts.operation.overlay.snap.LineStringSnapper(line, 1E-6);
    var newPoints = snapper.snapTo([point.coordinate]);
    var snappedGeom = factory.createLineString(newPoints);
    
    var expectedWKT = 'LINESTRING (0 0, 0 10)'; 
    var expectedGeom = reader.read(expectedWKT);
    
    expect(expectedGeom.equals(snappedGeom)).toBeTruthy();
  });
  
  it('snaps a linevertex to a point near the vertex', function() {  
    var line = reader.read('LINESTRING (0 0, 0 10)');
    var point = reader.read('POINT (0 0.000000001)');
    
    var snapper = new jsts.operation.overlay.snap.LineStringSnapper(line, 1E-6);
    var newPoints = snapper.snapTo([point.coordinate]);
    var snappedGeom = factory.createLineString(newPoints);
    
    var expectedWKT = 'LINESTRING (0 0.000000001, 0 10)'; 
    var expectedGeom = reader.read(expectedWKT);
    
    expect(expectedGeom.equals(snappedGeom)).toBeTruthy();
  });
});