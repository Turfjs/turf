describe('jsts.operation.union.UnionOp', function() {
  it('Union with overlapping polygons.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((10 10, 100 10, 100 100, 10 100, 10 10))');
    var b = reader.read('POLYGON((50 50, 200 50, 200 200, 50 200, 50 50))');
    var expected = reader.read('POLYGON((100 50,100 10,10 10,10 100,50 100,50 200,200 200,200 50,100 50))');

    var result = a.union(b);
    
    expect(result.equals(expected)).toBeTruthy();
    
  });
  
  it('Union with overlapping polygons with holes.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 20,10 10,20 10,20 20,10 20))');
    var b = reader.read('POLYGON((0 30,0 70,30 70,30 30,0 30),(10 60,10 50,20 50,20 60,10 60))');
    var expected = reader.read('POLYGON((0 0,0 30,0 40,0 70,30 70,30 40,30 30,30 0,0 0),(10 20,10 10,20 10,20 20,10 20),(10 60,10 50,20 50,20 60,10 60))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with polygons that overlapps a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 20,10 10,20 10,20 20,10 20))');
    var b = reader.read('POLYGON((0 10,0 50,30 50,30 10,0 10))');
    var expected = reader.read('POLYGON((0 0,0 10,0 40,0 50,30 50,30 40,30 10,30 0,0 0))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  
  it('Union with polygons that partly overlapps a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 30,10 10,20 10,20 30,10 30))');
    var b = reader.read('POLYGON((0 20,0 50,30 50,30 20,0 20))');
    var expected = reader.read('POLYGON((0 0,0 10,0 40,0 50,30 50,30 40,30 10,30 0,0 0),(10 20,10 10,20 10,20 20,10 20))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with polygons that do not overlapp', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,40 40,40 0,0 0))');
    var b = reader.read('POLYGON((0 40,0 50,40 50,40 40,0 40))');
    var expected = reader.read('POLYGON((0 0,0 40,0 50,40 50,40 40,40 0,0 0))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with a polygon that overlapps the other polygon.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 60,50 60,50 0,0 0))');
    var b = reader.read('POLYGON((0 40,0 50,40 50,40 40,0 40))');
    var expected = a;

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with overlapping polygons that creates a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0, 30 0, 30 10, 10 10, 10 30, 0 30, 0 0))');
    var b = reader.read('POLYGON((20 0, 30 0, 30 30, 0 30, 0 20, 20 20, 20 0))');
    var expected = reader.read('POLYGON((20 0,0 0,0 20,0 30,10 30,30 30,30 10,30 0,20 0),(10 20,10 10,20 10,20 20,10 20))');

    var union = a.union(b);
    
    expect(union.equals(expected)).toBeTruthy();
  });
  
  it('Union with non overlapping polygons that creates a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0, 20 0, 20 10, 10 10, 10 20, 0 20, 0 0))');
    var b = reader.read('POLYGON((20 0, 30 0, 30 30, 0 30, 0 20, 20 20, 20 0))');
    var expected = reader.read('POLYGON((20 0, 0 0, 0 20, 0 30, 30 30, 30 0, 20 0),(10 20,10 10,20 10,20 20,10 20))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with non overlapping polygons that creates a multipolygon.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 10,10 10,10 0,0 0))');
    var b = reader.read('POLYGON((20 20,20 30,30 30,30 20,20 20))');
    var expected = reader.read('MULTIPOLYGON(((0 0,0 10,10 10,10 0,0 0)),((20 20,20 30,30 30,30 20,20 20)))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with non overlapping polygons that fills a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 30,10 10,20 10,20 30,10 30))');
    var b = reader.read('POLYGON((10 30,10 10,20 10,20 30,10 30))');
    var expected = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
  
  it('Union with polygons that partly fills a hole.', function() {
    var reader = new jsts.io.WKTReader();
    
    var a = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 30,10 10,20 10,20 30,10 30))');
    var b = reader.read('POLYGON((10 20,10 10,20 10,20 20,10 20))');
    var expected = reader.read('POLYGON((0 0,0 40,30 40,30 0,0 0),(10 30,10 20,20 20,20 30,10 30))');

    var union = a.union(b);
    
    expect(union.equalsTopo(expected)).toBeTruthy();
  });
});