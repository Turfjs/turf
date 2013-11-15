var vows = require("vows"),
    assert = require("assert");

var shp = require("../shp");

var suite = vows.describe("shp");

suite.addBatch({
  "The header of a simple shapefile": {
    topic: function() {
      var callback = this.callback;
      shp.readStream("./test/boolean-property.shp")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        fileCode: 9994,
        version: 1000,
        shapeType: 1,
        box: [1, 2, 17, 18]
      });
    }
  },

  "The header of an empty shapefile": {
    topic: function() {
      var callback = this.callback;
      shp.readStream("./test/empty.shp")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        fileCode: 9994,
        version: 1000,
        shapeType: 3,
        box: [0, 0, 0, 0]
      });
    }
  },

  "The records of an empty shapefile": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/empty.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, []);
    }
  },

  "The records of a shapefile of points": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/points.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        {shapeType: 1, x: 1, y: 2},
        {shapeType: 1, x: 3, y: 4},
        {shapeType: 1, x: 5, y: 6},
        {shapeType: 1, x: 7, y: 8},
        {shapeType: 1, x: 9, y: 10},
        {shapeType: 1, x: 11, y: 12},
        {shapeType: 1, x: 13, y: 14},
        {shapeType: 1, x: 15, y: 16},
        {shapeType: 1, x: 17, y: 18}
      ]);
    }
  },

  "The records of a shapefile of multipoints": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/multipoints.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        {shapeType: 8, box: [1, 2, 9, 10], points: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]},
        {shapeType: 8, box: [11, 12, 19, 20], points: [[11, 12], [13, 14], [15, 16], [17, 18], [19, 20]]}
      ]);
    }
  },

  "The records of a shapefile of polylines": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/polylines.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        {shapeType: 3, box: [1, 2, 9, 10], parts: [0], points: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]},
        {shapeType: 3, box: [11, 12, 19, 20], parts: [0, 2], points: [[11, 12], [13, 14], [15, 16], [17, 18], [19, 20]]}
      ]);
    }
  },

  "The records of a shapefile of polygons": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/polygons.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        {shapeType: 5, box: [0, 0, 1, 1], parts: [0], points: [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]},
        {shapeType: 5, box: [0, 0, 4, 4], parts: [0, 5], points: [[0, 0], [0, 4], [4, 4], [4, 0], [0, 0], [1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]},
        {shapeType: 5, box: [2, 2, 5, 5], parts: [0, 5], points: [[2, 2], [2, 3], [3, 3], [3, 2], [2, 2], [4, 4], [4, 5], [5, 5], [5, 4], [4, 4]]}
      ]);
    }
  },

  "The records of a shapefile with null features": {
    topic: function() {
      var callback = this.callback, records = [];
      shp.readStream("./test/null.shp")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        {shapeType: 1, x: 1, y: 2},
        null,
        {shapeType: 1, x: 5, y: 6},
        null,
        null,
        {shapeType: 1, x: 11, y: 12},
        {shapeType: 1, x: 13, y: 14},
        null,
        {shapeType: 1, x: 17, y: 18}
      ]);
    }
  }
});

suite.export(module);
