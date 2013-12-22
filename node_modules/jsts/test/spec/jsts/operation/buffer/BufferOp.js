describe('jsts.operation.buffer.BufferOp', function() {
  var reader = new jsts.io.WKTReader(), errorMargin=0.01;

  it('can be constructed', function() {
    var bufferOp = new jsts.operation.buffer.BufferOp();
    expect(bufferOp).toBeDefined();
  });

  it('Round buffer around point has area r^2 * PI', function() {
    var point = reader.read('POLYGON ((0 0))');
    var highResQuadrantSegments = 18;
    var bufferedGeom = point.buffer(1.0, highResQuadrantSegments);

	expect(bufferedGeom.getArea()).toBeCloseTo(Math.PI, errorMargin)
  });

  // we simulate Square buffers by ROUND_CAP style with quadrantSegments: 1, and distance * sqrt(2)
  it('Square buffer around point has area 2d * 2d', function() {
    var pointPolygon = reader.read('POLYGON ((0 0))');
    var distance = 1;
    var quadrantSegments = 1;
    var newArea = 2*2;
    var bufferedGeom = pointPolygon.buffer(distance * Math.sqrt(2), quadrantSegments);
    
	expect(bufferedGeom.getArea()).toBeCloseTo(newArea, errorMargin);
  });

  it('We should shrink by a factor with the inverse square', function() {
    var polygon = reader.read('POLYGON ((0 0, 5 0, 5 5, 0 5, 0 0))');
	var expectedWKT = "POLYGON((1 1,1 4,4 4,4 1,1 1))";
    var expectedGeom = reader.read(expectedWKT);
	var expectedArea = 9;

	var bufferedGeom = polygon.buffer(-1);
	
    expect(expectedGeom.equals(bufferedGeom)).toBeTruthy();
    expect(bufferedGeom.getArea()).toBe(expectedArea);
  });

  /* Shape has a very long, very thin part sticking out. We want to remove it with a negative buffer
   * 
   *  /-\ (100,0.001)
   *  | | 
   *  . .
   *  . .
   *  | |
   *  | ----- (5,5)
   *  |     |
   *  |     |
   *  |     |
   *  |     |
   *  ------- (5,0)
   * (0,0)
   */
  it('We should drop points with the inverse square', function() {
  	var polygon = reader.read('POLYGON ((0 0, 5 0, 100 0, 100 0.00001, 5 0.00001, 5 5, 0 5, 0 0))');
  	var currentArea = 25;
  	var currentLength = 100+95+5+5+5;
  	var currentPoints = 7+1
    expect(polygon.getArea()).toBeCloseTo(currentArea, errorMargin);
    expect(polygon.getLength()).toBeCloseTo(currentLength);
    expect(polygon.getExteriorRing().getNumPoints()).toBe(currentPoints);
    
	var newGeom = polygon.buffer(-0.001);
	var expectedArea = currentArea;
	var expectedLength = 5+5+5+5;
	var expectedPoints = 4+1;
    expect(newGeom.getExteriorRing().getNumPoints()).toBe(expectedPoints);
    expect(newGeom.getArea()).toBeCloseTo(expectedArea, errorMargin);
    expect(newGeom.getLength()).toBeCloseTo(expectedLength, errorMargin);
  });
  
  it('Buffer around block, size should be 2d * 2d', function() {
    var polygon = reader.read('POLYGON ((0 0, 0 5, 5 5, 5 0, 0 0))');
    expect(polygon.getArea()).toBe(5*5);

	var bufferedGeom = polygon.buffer(1,18);
	var roundCornersLossArea = 4 - Math.PI; // 4 corners fill a full circle, so lost area is 4-Pi
	var expectedArea = 7*7 - roundCornersLossArea;
    expect(bufferedGeom.getArea()).toBeCloseTo(expectedArea, errorMargin);
  });
});
