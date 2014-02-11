process.env.TZ = "America/Los_Angeles";

var vows = require("vows"),
    assert = require("assert");

var dbf = require("../dbf");

var suite = vows.describe("dbf");

suite.addBatch({
  "The header of a simple dBASE file": {
    topic: function() {
      var callback = this.callback;
      dbf.readStream("./test/boolean-property.dbf")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        count: 9,
        date: new Date(Date.UTC(1995, 6, 26, 7)),
        version: 3,
        fields: [{name: "foo", type: "L", length: 1}]
      });
    }
  },

  "The header of an empty dBASE file": {
    topic: function() {
      var callback = this.callback;
      dbf.readStream("./test/empty.dbf")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        count: 0,
        date: new Date(Date.UTC(1995, 6, 26, 7)),
        version: 3,
        fields: []
      });
    }
  },

  "The header of a dBASE file with ISO-8859-1 property names": {
    topic: function() {
      var callback = this.callback;
      dbf.readStream("./test/latin1-property.dbf")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        count: 1,
        date: new Date(Date.UTC(1995, 6, 26, 7)),
        version: 3,
        fields: [{name: "name", type: "C", length: 80}]
      });
    }
  },

  "The records of a dBASE file with ISO-8859-1 property names": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/latin1-property.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        ["México"]
      ]);
    }
  },

  "The header of a dBASE file with UTF-8 property names": {
    topic: function() {
      var callback = this.callback;
      dbf.readStream("./test/utf8-property.dbf", "utf8")
          .on("error", callback)
          .on("header", function(header) { callback(null, header); });
    },
    "has the expected values": function(header) {
      assert.deepEqual(header, {
        count: 1,
        date: new Date(Date.UTC(1995, 6, 26, 7)),
        version: 3,
        fields: [{name: "☃", type: "C", length: 80}]
      });
    }
  },

  "The records of a dBASE file with UTF-8 property names": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/utf8-property.dbf", "utf8")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        ["ηελλο ςορλδ"]
      ]);
    }
  },

  "The records of an empty dBASE file": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/empty.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, []);
    }
  },

  "The records of a simple dBASE file": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/boolean-property.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        [null],
        [true],
        [true],
        [false],
        [false],
        [true],
        [true],
        [false],
        [false]
      ]);
    }
  },

  "The records of a dBASE file with a string property": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/string-property.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        [null],
        ["blue"],
        ["green"]
      ]);
    }
  },

  "The records of a dBASE file with a number property": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/number-property.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        [null],
        [42],
        [-4]
      ]);
    }
  },

  "The records of a dBASE file with a date property": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/date-property.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        [new Date(2013, 0, 2)],
        [new Date(2013, 1, 2)],
        [new Date(2013, 0, 3)]
      ]);
    }
  },

  "The records of a dBASE file with multiple properties": {
    topic: function() {
      var callback = this.callback, records = [];
      dbf.readStream("./test/mixed-properties.dbf")
          .on("error", callback)
          .on("record", function(record) { records.push(record); })
          .on("end", function() { callback(null, records); });
    },
    "have the expected values": function(records) {
      assert.deepEqual(records, [
        [null, null],
        [42, null],
        [null, "blue"]
      ]);
    }
  }
});

suite.export(module);
