var vows = require("vows"),
    assert = require("assert"),
    bounds = require("../lib/topojson/bounds");

var suite = vows.describe("bounds");

suite.addBatch({
  "bounds": {
    "computes the bounding box": function() {
      assert.deepEqual(bounds({
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [0, 2], [0, 0]]
        }
      }), [0, 0, 1, 2]);
    },
    "considers points as well as arcs": function() {
      assert.deepEqual(bounds({
        foo: {
          type: "MultiPoint",
          coordinates: [[0, 0], [1, 0], [0, 2], [0, 0]]
        }
      }), [0, 0, 1, 2]);
    }
  }
});

suite.export(module);
