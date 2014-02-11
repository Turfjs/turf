describe('jsts.io.*', function() {

  var reader;
  var writer;
  
  it('WKT reader/writer can be constructed', function() {
    reader = new jsts.io.WKTReader();
    expect(reader).toBeDefined();
    
    writer = new jsts.io.WKTWriter();
    expect(writer).toBeDefined();
  });

  it('can read POLYGON WKT', function() {
    var geometry = reader.read('POLYGON ((20 20, 20 100, 120 100, 140 20, 20 20))');
    expect(geometry).toBeDefined();
  });
  
  it('can read LINESTRING EMPTY WKT', function() {
    var geometry = reader.read('LINESTRING EMPTY');
    var result = geometry.isEmpty();
    expect(result).toBeTruthy();
  });
  
  it('can read MULTIPOINT EMPTY WKT', function() {
    var geometry = reader.read('MULTIPOINT EMPTY');
    var result = geometry.isEmpty();
    expect(result).toBeTruthy();
  });
  
  it('can read POLYGON EMPTY WKT', function() {
    var geometry = reader.read('POLYGON EMPTY');
    var result = geometry.isEmpty();
    expect(result).toBeTruthy();
  });
  
  it('can write POLYGON WKT', function() {
    var geometry = reader.read('POLYGON ((20 20, 20 100, 120 100, 140 20, 20 20))');
    var wkt2 = writer.write(geometry);
    var geometry2 = reader.read(wkt2);
    expect(geometry.equals(geometry2)).toBeTruthy();
  });
});
