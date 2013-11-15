var vows = require("vows"),
    assert = require("assert"),
    transformProperties = require("../lib/topojson/transform-properties");

var suite = vows.describe("transform-properties");

suite.addBatch({
  "transform-properties": {
    "by default, deletes properties from Features": function() {
      assert.deepEqual(transformProperties({
        foo: {
          type: "Feature",
          properties: {"foo": 42},
          geometry: {
            type: "LineString",
            coordinates: [0]
          }
        }
      }).foo, {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [0]
        }
      });
    },
    "observes the specified property transform function": function() {
      assert.deepEqual(transformProperties({
        foo: {
          type: "Feature",
          properties: {"foo": 42},
          geometry: {
            type: "LineString",
            coordinates: [0]
          }
        }
      }, function(properties, key, value) {
        properties.bar = value;
        return true;
      }).foo, {
        type: "Feature",
        properties: {"bar": 42},
        geometry: {
          type: "LineString",
          coordinates: [0]
        }
      });
    }
  }
});

suite.export(module);
