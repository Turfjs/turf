/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

describe('jsts.geom.Point', function() {
 
  var geometryFactory;
  var coordinate;
  var point;
  var pointEmpty;
  
  it('can be constructed', function() {
    geometryFactory = new jsts.geom.GeometryFactory();
    coordinate = new jsts.geom.Coordinate(1,2);
    point = geometryFactory.createPoint(coordinate);
    pointEmpty = geometryFactory.createPoint(null);
    expect(point).toBeDefined();
    expect(pointEmpty).toBeDefined();
  });
  
  it('can be non empty', function() {
    var isEmpty = point.isEmpty();
    expect(isEmpty).toBeFalsy();
  });
  
  it('can be converted to an envelope which should be a Point', function() {
    var envelope = point.getEnvelope();
    expect(envelope.getX()).toEqual(1);
  });
  
  it('can be empty', function() {
    var isEmpty = pointEmpty.isEmpty();
    expect(isEmpty).toBeTruthy();
  });
  
  it('is simple', function() {
    var isSimple = pointEmpty.isSimple();
    expect(isSimple).toBeTruthy();
  });
  
  it('can be cloned', function() {
    var clone = point.clone();
    expect(clone.equalsExact(point, 0)).toBeTruthy();
  });
  
  it('can be validated', function(){
    var valid = point.isValid();
    expect(valid).toBeTruthy();
  });
  
});
