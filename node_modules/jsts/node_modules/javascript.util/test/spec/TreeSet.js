describe('javascript.util.TreeSet', function() {
  var treeSet;
  var firstValue;
  var secondValue;

  it('can be constructed', function() {
    treeSet = new javascript.util.TreeSet();
    expect(treeSet).toBeDefined();
  });

  it('one element can be put', function() {
    firstValue = {
      number : 2,
      compareTo : function(a) {
        if (this.number === a.number) {
          return 0;
        } else if (this.number > a.number) {
          return 1;
        } else if (this.number < a.number) {
          return -1;
        }
      }
    };

    treeSet.add(firstValue);

    expect(treeSet.size()).toEqual(1);
  });

  it('second element can be put', function() {
    secondValue = {
        number : 1,
        compareTo : function(a) {
          if (this.number === a.number) {
            return 0;
          } else if (this.number > a.number) {
            return 1;
          } else if (this.number < a.number) {
            return -1;
          }
        }
      };

    treeSet.add(secondValue);

    expect(treeSet.size()).toEqual(2);
  });

  it('second element should be enumerated as first because of natural value order', function() {
    var iterator = treeSet.iterator();
    var e = iterator.next();

    expect(e).toEqual(secondValue);
  });

});
