/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

describe('jsts.geom.Polygon', function() {
 
  var geometryFactory;
  var polygon;
  
  it('can be constructed', function() {
    var c1,c2,c3,c4;
    var shell;

    geometryFactory = new jsts.geom.GeometryFactory();
    
    var c1 = new jsts.geom.Coordinate(1,2);
    var c2 = new jsts.geom.Coordinate(3,4);
    var c3 = new jsts.geom.Coordinate(5,5);
    c4 = new jsts.geom.Coordinate(1,2);

    shell = geometryFactory.createLinearRing([c1,c2,c3,c4]);
    polygon = geometryFactory.createPolygon(shell, null);
    
    expect(polygon).toBeDefined();
  });
  
  it('can be validated', function(){
    var valid = polygon.isValid();
    expect(valid).toBeTruthy();
  });
  
});
