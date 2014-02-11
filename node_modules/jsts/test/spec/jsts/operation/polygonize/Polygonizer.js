describe('jsts.operation.polygonize.Polygonizer', function() {
  var wktReader = new jsts.io.WKTReader();
  
  var polygonizer = null;
  
  it('Can be created',function() {
    polygonizer = new jsts.operation.polygonize.Polygonizer();
    
    expect(polygonizer).toBeDefined();
  });
  
  it('Can add lines',function() {
    var a = wktReader.read('LINESTRING(30 150,250 150)');
    var b = wktReader.read('LINESTRING(120 240,120 20,20 20,120 170)');
    
    polygonizer.add(a);
    polygonizer.add(b);
    
    expect(polygonizer).toBeDefined();
  });
  
  it('Can add lines',function() {
    var polygons = polygonizer.getPolygons();
    
    expect(polygons).toBeDefined();
  });
  
});