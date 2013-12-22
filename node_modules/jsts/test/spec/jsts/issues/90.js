describe('GitHub issue #90', function() {

  it('Buffer should not fail on a certain linestring', function() {
    var reader = new jsts.io.WKTReader();
  
    var input = reader.read('LINESTRING(155021.812 463050.638,155022.862 463000.028,155022.442 463028.588)');
    var buffer = input.buffer(20);
    
    expect(buffer).toBeDefined();
  });
});
