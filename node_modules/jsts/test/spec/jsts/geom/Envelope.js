/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

describe('jsts.geom.Envelope', function() {
  var e1, e2, e3, e4, e5;

  it('can be constructed', function() {
    e1 = new jsts.geom.Envelope(1, 4, 1, 4);
    e2 = new jsts.geom.Envelope(new jsts.geom.Coordinate(1, 1),
        new jsts.geom.Coordinate(4, 4));
    e3 = new jsts.geom.Envelope(new jsts.geom.Coordinate(1, 4));
    e4 = new jsts.geom.Envelope(e1);
    e5 = new jsts.geom.Envelope(2, 8, 2, 8);
    expect(e1).toBeDefined();
  });

  it('should be equal to another Envelope defined from the same coordinates',
      function() {
        expect(e1.equals(e2)).toEqual(true);
      });

  it('can be expanded to inlude another Envelope', function() {
    var clone = new jsts.geom.Envelope(e1);
    clone.expandToInclude(e5);
    var expectedEnvelope = new jsts.geom.Envelope(1, 8, 1, 8);
    expect(clone.equals(expectedEnvelope)).toBeTruthy();
  });

  it('can calculate its intersection with another Envelope', function() {
    var intersectingEnvelope = e1.intersection(e5);
    var expectedEnvelope = new jsts.geom.Envelope(2, 4, 2, 4);
    expect(intersectingEnvelope.equals(expectedEnvelope)).toBeTruthy();
  });

});
