describe('javascript.util.Arrays', function() {
  it('can sort an array of numbers', function() {
    var array = [5,4,3,2,1];
    javascript.util.Arrays.sort(array);
    expect(array[0]).toEqual(1);
  });
  
  it('can sort part of an array of numbers', function() {
    var array = [5,4,3,2,1];
    javascript.util.Arrays.sort(array, 1, 4);
    expect(array[0]).toEqual(5);
    expect(array[1]).toEqual(2);
  });
  
  it('can sort an array of numbers with a comparator', function() {
    var comparator = {
        compare: function(a, b) {
          if (a<b) return -1;
          if (a===b) return 0;
          if (a>b) return 1;
        }
    };
    
    var array = [5,4,3,2,1];
    javascript.util.Arrays.sort(array, comparator);
    expect(array[0]).toEqual(1);
  });
  
  it('can sort part of an array of numbers with a comparator', function() {
    var comparator = {
        compare: function(a, b) {
          if (a<b) return -1;
          if (a===b) return 0;
          if (a>b) return 1;
        }
    };
    
    var array = [5,4,3,2,1];
    javascript.util.Arrays.sort(array, 1, 4, comparator);
    expect(array[0]).toEqual(5);
    expect(array[1]).toEqual(2);
  });
  
});

