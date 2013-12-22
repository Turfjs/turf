// TODO: parse test data from testxml

jsts.vs.Application = {
  init: function() {

    var testCaseResultsPanel = new jsts.vs.TestCaseResultsPanel();
    var testCaseDetailsPanel = new jsts.vs.TestCaseDetailsPanel({
      testCaseResultsPanel: testCaseResultsPanel
    });
    
    var testCaseForm = new jsts.vs.TestCaseForm({
      testCaseDetailsPanel: testCaseDetailsPanel
    });

    new Ext.Viewport({
      layout: 'absolute',
      items: [{
        title: 'Choose test case',
        x: 20,
        y: 20,
        height: 100,
        width: 600,
        xtype: 'form',
        frame: true,
        items: testCaseForm
      }, {
        title: 'Test case details',
        x: 20,
        y: 130,
        height: 200,
        width: 600,
        layout: 'fit',
        frame: true,
        items: testCaseDetailsPanel
      }, {
        title: 'Test case results',
        x: 20,
        y: 340,
        height: 200,
        width: 600,
        frame: true,
        layout: 'fit',
        items: testCaseResultsPanel
      }]
    });
  }
};

Ext.onReady(jsts.vs.Application.init);
