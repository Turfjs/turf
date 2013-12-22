describe('javascript.util.HashSet', function() {
  var hashSet;

  it('can be constructed', function() {
    hashSet = new javascript.util.HashSet();
    expect(hashSet).toBeDefined();
  });

  it('one element can be put', function() {
    hashSet.add(1);

    expect(hashSet.size()).toEqual(1);
  });

  it('second element can be put', function() {
    hashSet.add(2);

    expect(hashSet.size()).toEqual(2);
  });
  
  it('"same" element should not be put', function() {
    hashSet.add(2);

    expect(hashSet.size()).toEqual(2);
  });

});
