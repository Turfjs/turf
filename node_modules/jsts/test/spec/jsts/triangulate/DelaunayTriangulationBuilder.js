describe('jsts.triangulate.DelauneyTriangulationBuilder', function() {
  var geomFact = new jsts.geom.GeometryFactory();
  var reader = new jsts.io.WKTReader();
  
  var runDelaunay = function(sitesWKT, computeTriangles) {
    var sites = reader.read(sitesWKT);
    var builder = new jsts.triangulate.DelaunayTriangulationBuilder();
    builder.setSites(sites);
    
    var result = null;
    if (computeTriangles) {
      result = builder.getTriangles(geomFact);      
    }
    else {
      result = builder.getEdges(geomFact);
    }
    
    return result;
    
    //var expected = reader.read(expectedWKT);
    //result.normalize();
    //expected.normalize();
    // TODO: assertTrue(expected.equalsExact(result, COMPARISON_TOLERANCE));
  };
  
  var runDelaunayEdges = function(sitesWKT) {
    return runDelaunay(sitesWKT, false);
  };
    
  
  it('can be constructed', function() {
    var builder = new jsts.triangulate.DelaunayTriangulationBuilder();
    expect(builder).toBeDefined();
  });
  
  it('can build from multipoints', function() {
    var wkt = "MULTIPOINT ((10 10 1), (10 20 2), (20 20 3))";
    var expected = reader.read("MULTILINESTRING ((10 20, 20 20), (10 10, 10 20), (10 10, 20 20))");
    var result = runDelaunayEdges(wkt);
    expect(result.equals(expected)).toBeTruthy();
    
    var expectedTri = reader.read("GEOMETRYCOLLECTION (POLYGON ((10 20, 10 10, 20 20, 10 20)))");
    result = runDelaunay(wkt, true);
    
    expect(result.equals(expectedTri)).toBeTruthy();
  });
});
