/**
 * @constructor
 */
jsts.vs.TestCaseForm = Ext.extend(Ext.Panel, {
  initComponent: function(config) {

    this.testCaseDetailsPanel = this.initialConfig.testCaseDetailsPanel;

    this.groups = new Ext.data.ArrayStore({
      id: 0,
      fields: ['id', 'filename'],
      data: this.files
    });

    this.cases = new Ext.data.XmlStore({
      url: '../testxml/validate/TestRelatePP.xml',
      record: 'case',
      fields: ['desc', 'a', 'b'],
      listeners: {
        load: this.onCasesLoad,
        scope: this
      },
      autoLoad: true
    });
    this.cases.proxy.conn.method = 'GET';

    Ext.apply(this, {
      layout: 'fit',
      items: {
        layout: 'form',
        items: [{
          width: 150,
          xtype: 'combo',
          fieldLabel: 'Group',
          name: 'group',
          ref: 'group',
          store: this.groups,
          triggerAction: 'all',
          lazyRender: true,
          mode: 'local',
          valueField: 'id',
          displayField: 'filename',
          value: 0,
          listeners: {
            'select': this.onGroupSelect,
            scope: this
          }
        }, {
          width: 450,
          xtype: 'combo',
          fieldLabel: 'Case',
          name: 'case',
          ref: '../case',
          store: this.cases,
          triggerAction: 'all',
          lazyRender: true,
          displayField: 'desc',
          listeners: {
            'select': this.onCaseSelect,
            scope: this
          }
        }]
      }
    });

    jsts.vs.TestCaseForm.superclass.initComponent.apply(this, arguments);
  },
  files: [[0, 'TestRelatePP.xml'], [1, 'TestRelatePL.xml'],
      [2, 'TestRelatePA.xml'], [3, 'TestRelateLL.xml'],
      [4, 'TestRelateLC.xml'], [5, 'TestRelateLA.xml'],
      [6, 'TestRelateAC.xml'], [7, 'TestRelateAA.xml']],
  groups: null,
  cases: null,
  onCasesLoad: function() {
    // doesn't work, rendering isn't done..
    // this['case'].select(0, true);
  },
  onGroupSelect: function(combo, record, index) {
    this.cases.proxy.conn.url = '../testxml/validate/' + record.data.filename;
    this.cases.reload();
    this.testCaseDetailsPanel.reset();
  },
  onCaseSelect: function(combo, record, index) {
    this.testCaseDetailsPanel.showTestCase(record);
  }
});