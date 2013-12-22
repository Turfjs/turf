describe('jsts.index.DoubleBits', function() {
  it('calculates correct exponent', function() {
    var db = jsts.index.DoubleBits;
    expect(db.exponent(-1)).toBe(0);
    expect(db.exponent(8.0)).toBe(3);
    expect(db.exponent(128.0)).toBe(7);
  });
});
