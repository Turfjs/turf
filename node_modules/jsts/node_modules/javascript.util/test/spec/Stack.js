describe('javascript.util.Stack', function() {
  var stack;
  var first;
  var second;
  
  it('can be constructed', function() {
    stack = new javascript.util.Stack();
    expect(stack).toBeDefined();
  });
  
  it('one element can be appended', function() {
    first = 1;
  
    stack.push(first);
    
    expect(stack.size()).toEqual(1);
  });
  
  it('another element can be appended', function() {
    second = {};

    stack.push(second);
    
    expect(stack.size()).toEqual(2);
  });
  
  it('can be peeked', function() {
    var e = stack.peek();
    
    expect(e).toBe(second);
  });
  
  it('can be searched', function() {
    var index = stack.search(first);
    
    expect(index).toBe(index);
  });
  
  it('can be poped', function() {
    stack.pop();
    
    expect(stack.size()).toEqual(1);
  });
});

