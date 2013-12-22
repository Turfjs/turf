describe('javascript.util.HashMap', function() {
  var hashMap;
  var firstKey;
  var secondKey;
  var firstValue;
  var secondValue;
  
  it('can be constructed', function() {
    hashMap = new javascript.util.HashMap();
    expect(hashMap).toBeDefined();
  });
  
  it('one element can be put', function() {
    firstkey = "firstKey";
    firstValue = "firstValue";
  
    hashMap.put(firstKey, firstValue);
    
    expect(hashMap.size()).toEqual(1);
  });
  
  it('element can be get', function() {
    var value = hashMap.get(firstKey);
    
    expect(value).toEqual(firstValue);
  });
  
  it('all elements can be retrieved', function() {
    var values = hashMap.values();
       
    expect(values instanceof javascript.util.Collection).toBeTruthy();
  });
  
});

