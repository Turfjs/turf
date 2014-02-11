var vows = require("vows"),
    assert = require("assert"),
    quantize = require("../lib/topojson/quantize");

var suite = vows.describe("quantize");

suite.addBatch({
  "quantize": {
    "returns the quantization transform": function() {
      assert.deepEqual(quantize({}, [0, 0, 1, 1], 1e4), {
        scale: [1 / 9999, 1 / 9999],
        translate: [0, 0]
      });
    },
    "converts coordinates to fixed precision": function() {
      var objects = {
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]
        }
      };
      quantize(objects, [0, 0, 1, 1], 1e4);
      assert.deepEqual(objects.foo.coordinates, [[0, 0], [9999, 0], [0, 9999], [0, 0]]);
    },
    "observes the quantization parameter": function() {
      var objects = {
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]
        }
      };
      quantize(objects, [0, 0, 1, 1], 10);
      assert.deepEqual(objects.foo.coordinates, [[0, 0], [9, 0], [0, 9], [0, 0]]);
    },
    "observes the bounding box": function() {
      var objects = {
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]
        }
      };
      quantize(objects, [-1, -1, 2, 2], 10);
      assert.deepEqual(objects.foo.coordinates, [[3, 3], [6, 3], [3, 6], [3, 3]]);
    },
    "applies to points as well as arcs": function() {
      var objects = {
        foo: {
          type: "MultiPoint",
          coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]
        }
      };
      quantize(objects, [0, 0, 1, 1], 1e4);
      assert.deepEqual(objects.foo.coordinates, [[0, 0], [9999, 0], [0, 9999], [0, 0]]);
    },
    "skips coincident points in lines": function() {
      var objects = {
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [0.9, 0.9], [1.1, 1.1], [2, 2]]
        }
      };
      quantize(objects, [0, 0, 2, 2], 3);
      assert.deepEqual(objects.foo.coordinates, [[0, 0], [1, 1], [2, 2]]);
    },
    "skips coincident points in polygons": function() {
      var objects = {
        foo: {
          type: "Polygon",
          coordinates: [[[0, 0], [0.9, 0.9], [1.1, 1.1], [2, 2], [0, 0]]]
        }
      };
      quantize(objects, [0, 0, 2, 2], 3);
      assert.deepEqual(objects.foo.coordinates, [[[0, 0], [1, 1], [2, 2], [0, 0]]]);
    },
    "does not skip coincident points in points": function() {
      var objects = {
        foo: {
          type: "MultiPoint",
          coordinates: [[0, 0], [0.9, 0.9], [1.1, 1.1], [2, 2], [0, 0]]
        }
      };
      quantize(objects, [0, 0, 2, 2], 3);
      assert.deepEqual(objects.foo.coordinates, [[0, 0], [1, 1], [1, 1], [2, 2], [0, 0]]);
    },
    "includes closing point in degenerate lines": function() {
      var objects = {
        foo: {
          type: "LineString",
          coordinates: [[1, 1], [1, 1], [1, 1]]
        }
      };
      quantize(objects, [0, 0, 2, 2], 3);
      assert.deepEqual(objects.foo.coordinates, [[1, 1], [1, 1]]);
    },
    "includes closing point in degenerate polygons": function() {
      var objects = {
        foo: {
          type: "Polygon",
          coordinates: [[[0.9, 1], [1.1, 1], [1.01, 1], [0.9, 1]]]
        }
      };
      quantize(objects, [0, 0, 2, 2], 3);
      assert.deepEqual(objects.foo.coordinates, [[[1, 1], [1, 1], [1, 1], [1, 1]]]);
    }
  }
});

suite.export(module);
