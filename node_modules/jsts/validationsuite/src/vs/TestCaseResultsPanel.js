/**
 * @constructor
 */
jsts.vs.TestCaseResultsPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {

    Ext.apply(this, {
        frame: true
    });

    jsts.vs.TestCaseResultsPanel.superclass.initComponent
        .apply(this, arguments);
  },
  
  showTestResults: function(a, b) {
    var im = a.relate(b);
    this.update('IM: ' + im.toString() + '<br>' +
        'equals: ' + im.isEquals(2, 2)+ '<br>' +
        'disjoint: ' + im.isDisjoint()+ '<br>' +
        'intersects: ' + im.isIntersects()+ '<br>' +
        'touches: ' + im.isTouches(2, 2)+ '<br>' +
        'crosses: ' + im.isCrosses(2, 2)+ '<br>' +
        'within: ' + im.isWithin()+ '<br>' +
        'contains: ' + im.isContains()+ '<br>' +
        'overlaps: ' + im.isOverlaps(2, 2)+ '<br>');
  },
  reset: function() {
    this.update('');
  }
});