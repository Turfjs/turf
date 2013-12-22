/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

describe('jsts.geom.LinearRing', function() {
 
  var geometryFactory;
  var c1,c2,c3,c4;

  var linearRing;
  var linearRingEmpty;

  it('can be constructed', function() {
    geometryFactory = new jsts.geom.GeometryFactory();
    c1 = new jsts.geom.Coordinate(1,2);
    c2 = new jsts.geom.Coordinate(3,4);
    c3 = new jsts.geom.Coordinate(5,6);
    c4 = new jsts.geom.Coordinate(1,2);

    linearRing = geometryFactory.createLinearRing([c1,c2,c3,c4]);
    linearRingEmpty = geometryFactory.createLinearRing(null);
    
    expect(linearRing).toBeDefined();
    expect(linearRingEmpty).toBeDefined();
  });
  
  it('can be non empty', function() {
    var isEmpty = linearRing.isEmpty();
    expect(isEmpty).toBeFalsy();
  });
  
  it('can be empty', function() {
    var isEmpty = linearRingEmpty.isEmpty();
    expect(isEmpty).toBeTruthy();
  });
  
  it('can be cloned', function() {
    var clone = linearRing.clone();
    expect(clone.equalsExact(linearRing, 0)).toBeTruthy();
  });
  
  it('can be validated', function(){
    var valid = linearRing.isValid();
    expect(valid).toBeTruthy();
  });
  
});
