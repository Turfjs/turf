describe("GitHub issue #111", function() {
  it("Two points combine to multipoint", function() {
    var p1 = "POINT(10 10)";
    var p2 = "POINT(15 15)";

    var reader = new jsts.io.WKTReader();
    var points = new javascript.util.ArrayList();
    points.add(reader.read(p1));
    points.add(reader.read(p2));

    var combinedPoints = jsts.geom.util.GeometryCombiner.combine(points);

    var writer = new jsts.io.WKTWriter();   

    expect(writer.write(combinedPoints)).toBe("MULTIPOINT((10 10),(15 15))");
  }); 
});
