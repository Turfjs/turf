describe('jsts.index.bintree.Bintree', function() {
  var btree;
  
  var NUM_ITEMS = 2000;
  var MIN_EXTENT = -1000.0;
  var MAX_EXTENT = 1000.0;
  var insertedArray = [];
  
  it('can be created', function() {
    btree = new jsts.index.bintree.Bintree();
    expect(btree).toBeDefined();
  });
  
  
  var createGrid = function(nGridCells)
  {
    var gridSize = Math.floor(Math.sqrt(nGridCells));
    gridSize += 1;
    var extent = MAX_EXTENT - MIN_EXTENT;
    var gridInc = extent / gridSize;
    var cellSize = 2 * gridInc;

    var i=0, il=gridSize,x, interval;
    for (i; i < il; i++) {
        x = MIN_EXTENT + gridInc * i;
        interval = new jsts.index.bintree.Interval(x, x + cellSize);
        btree.insert(interval, interval);
        insertedArray.push(interval);
      }
  };
  
  
  it('can insert a range of intervals', function() {
    createGrid(NUM_ITEMS);
  });
  
  it('returns all items in the tree when queried with an interval large enough to contain all inserted intervals',function(){
    var searchInterval = new jsts.index.bintree.Interval(-10000,10000);
    var resultArray = btree.query(searchInterval);
    expect(resultArray.size()).toBe(insertedArray.length);
  });
  
  it('can remove a previous inserted item',function(){
    var item = insertedArray[0];
    var removed = btree.remove(item, item);
    expect(removed).toBeTruthy();
    expect(btree.size()).toBe(insertedArray.length-1);
  });
});