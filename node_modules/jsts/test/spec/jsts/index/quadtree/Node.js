describe('jsts.index.quadtree.Node', function() {
  var node, envelope;
  
  envelope = new jsts.geom.Envelope(1, 4, 1, 4);
  
  it('can be created', function() {
    node = jsts.index.quadtree.Node.createNode(envelope);
    expect(node).toBeDefined();
  });
  
  it('has a subnodearray of length 4', function() {
    expect(node.subnode.length).toBe(4);
  });
});