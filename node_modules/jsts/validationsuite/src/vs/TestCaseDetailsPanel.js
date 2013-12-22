/**
 * @constructor
 */
jsts.vs.TestCaseDetailsPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    
    this.testCaseResultsPanel = this.initialConfig.testCaseResultsPanel;

    this.layer = new OpenLayers.Layer.Vector('testcase', {
      isBaseLayer: true
    });

    this.map = new GeoExt.MapPanel({
      map: {
        controls: [],
        maxResolution: 1000,
        maxExtent: new OpenLayers.Bounds(-1000000, -1000000, 1000000, 1000000),
        layers: [this.layer]
      }
    });

    Ext.apply(this, {
      layout: 'absolute',
      items: [{
        x: 5,
        y: 5,
        height: 150,
        width: 150,
        frame: true,
        items: this.map
      }, {
        x: 170,
        y: 5,
        height: 150,
        width: 400,
        layout: 'fit',
        ref: 'geometry',
        frame: true
      }]
    });

    jsts.vs.TestCaseDetailsPanel.superclass.initComponent
        .apply(this, arguments);
  },
  map: null,
  layer: null,
  showTestCase: function(record) {
    var reader = new jsts.io.WKTReader();
    var writer = new jsts.io.WKTWriter();

    var a = reader.read(record.data.a);
    var b = reader.read(record.data.b);
    
    this.testCaseResultsPanel.showTestResults(a, b);
    this.geometry.update(writer.write(a) + '<br><br>' + writer.write(b));
    
    var parser = new jsts.io.OpenLayersParser();
    
    a = parser.write(a);
    b = parser.write(b);
    
    if (a instanceof jsts.geom.Point) {
      a = a.coordinate;
    }
    var featureA = new OpenLayers.Feature.Vector(a, null, {
      fillColor: 'red',
      fillOpacity: 0.5,
      strokeColor: 'red',
      strokeOpacity: 0.5,
      graphicName: 'square',
      pointRadius: 2
    });
    
    if (b instanceof jsts.geom.Point) {
      b = b.coordinate;
    }
    var featureB = new OpenLayers.Feature.Vector(b, null, {
      fillColor: 'blue',
      fillOpacity: 0.5,
      strokeColor: 'blue',
      strokeOpacity: 0.5,
      graphicName: 'square',
      pointRadius: 2
    });

    this.layer.destroyFeatures();
    this.layer.addFeatures([featureA, featureB]);

    var bounds = this.layer.getDataExtent();

    this.map.map.zoomToExtent(bounds, false);
  },
  reset: function() {
    this.layer.destroyFeatures();
    this.geometry.update('');
  }
});
