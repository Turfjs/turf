describe('jsts.operation.overlay.snap.SnapIfNeededOverlayOp', function() {
  it('constructs union from touching polygons', function() {
    var reader = new jsts.io.WKTReader();
    var geom1 = reader.read('POLYGON ((10 10, 10 20, 20 20, 20 10, 10 10))');
    var geom2 = reader.read('POLYGON ((20 10, 20 20, 30 20, 30 10, 20 10))');
    
    var union = jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(
        geom1, geom2, jsts.operation.overlay.OverlayOp.UNION);
    
    var expected = reader.read('POLYGON ((10 10, 10 20, 20 20, 30 20, 30 10, 20 10, 10 10))');
    
    expect(union.equals(expected)).toBeTruthy();
  });
});