describe('GitHub issue #95', function() {

  it('getArea should not return 0 for Multipolygon', function() {
    var reader = new jsts.io.WKTReader();
    
    var input = reader.read('MULTIPOLYGON(((508569.333383 6955176.6343521,524444.32481051 6949179.4153684,507158.22303389 6943887.7515592,508569.333383 6955176.6343521)),((512097.10925578 6931893.3135918,524444.32481051 6941418.3084483,523033.2144614 6927307.2049571,512097.10925578 6931893.3135918)))');
    
    var area = input.getArea();
    
    expect(area).toEqual(174232836.5204811);
  });
});
