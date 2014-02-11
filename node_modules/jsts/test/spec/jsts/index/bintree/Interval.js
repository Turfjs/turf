describe('jsts.index.bintree.Interval', function() {
  var interval;
  
  it('can be created', function() {
    interval = new jsts.index.bintree.Interval(0,10);
    expect(interval).toBeDefined();
  });
  
  it('correctly contains a point',function(){
    expect(interval.contains(5)).toBeTruthy();
  });
  
  it('correctly contains an interval',function(){
    expect(interval.contains(new jsts.index.bintree.Interval(1,9))).toBeTruthy();
  });
  
  it('does not contain a larger interval',function(){
    expect(interval.contains(new jsts.index.bintree.Interval(-10,22))).toBeFalsy();
  });
  
  it('overlaps a partly overlapping interval',function(){
    expect(interval.overlaps(new jsts.index.bintree.Interval(-10,5))).toBeTruthy();
  });
});