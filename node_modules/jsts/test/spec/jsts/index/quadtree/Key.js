describe('jsts.index.quadtree.Key', function() {
  var envelope, key;
  
  envelope = new jsts.geom.Envelope(-1024,0,0,1500);
  
  it('can be created', function() {
    key = new jsts.index.quadtree.Key(envelope);
    expect(key).toBeDefined();
  });
  
  it('correctly calculates the level', function() {
    expect(key.level).toBe(11);
  });
});