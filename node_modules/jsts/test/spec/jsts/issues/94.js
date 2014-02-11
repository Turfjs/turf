describe('GitHub issue #94', function() {

  it('Convert from jsts.geom.Point to OpenLayers.Geometry.Point', function() {
    var reader = new jsts.io.WKTReader();
    var parser = new jsts.io.OpenLayersParser();
    
    var input = reader.read('POINT(10, 10)');
    
    var olgeom = parser.write(input);
    
    expect(olgeom.x).toEqual(input.coordinate.x);
  });
});
