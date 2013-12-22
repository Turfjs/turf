describe('jsts.index.IntervalSize', function() {
  var is = jsts.index.IntervalSize;
  
  it('assumes a small interval is not zero',function(){
    expect(is.isZeroWidth((1-0.00000000000001), 1)).toBeFalsy();
  });
  
  it('assumes a tiny interval is zero', function() {
    expect(is.isZeroWidth((1-0.000000000000001), 1)).toBeTruthy();
  });
});