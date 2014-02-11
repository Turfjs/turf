var vows = require("vows"),
    assert = require("assert"),
    extract = require("../../lib/topojson/topology/extract");

var suite = vows.describe("extract");

suite.addBatch({
  "extract": {
    "copies coordinates sequentially into a buffer": function() {
      var topology = extract({
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        },
        bar: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        }
      });
      assert.deepEqual(topology.coordinates, [[0, 0], [1, 0], [2, 0], [0, 0], [1, 0], [2, 0]]);
    },
    "does not copy point geometries into the coordinate buffer": function() {
      var topology = extract({
        foo: {
          type: "Point",
          coordinates: [0, 0]
        },
        bar: {
          type: "MultiPoint",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        }
      });
      assert.deepEqual(topology.coordinates, []);
      assert.deepEqual(topology.objects.foo.coordinates, [0, 0]);
      assert.deepEqual(topology.objects.bar.coordinates, [[0, 0], [1, 0], [2, 0]]);
    },
    "includes closing coordinates in polygons": function() {
      var topology = extract({
        foo: {
          type: "Polygon",
          coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]
        }
      });
      assert.deepEqual(topology.coordinates, [[0, 0], [1, 0], [2, 0], [0, 0]]);
    },
    "represents lines as contiguous slices of the coordinate buffer": function() {
      var topology = extract({
        foo: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        },
        bar: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        }
      });
      assert.deepEqual(topology.objects, {
        foo: {
          type: "LineString",
          arcs: [0, 2]
        },
        bar: {
          type: "LineString",
          arcs: [3, 5]
        }
      });
    },
    "represents rings as contiguous slices of the coordinate buffer": function() {
      var topology = extract({
        foo: {
          type: "Polygon",
          coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]
        },
        bar: {
          type: "Polygon",
          coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]
        }
      });
      assert.deepEqual(topology.objects, {
        foo: {
          type: "Polygon",
          arcs: [[0, 3]]
        },
        bar: {
          type: "Polygon",
          arcs: [[4, 7]]
        }
      });
    },
    "exposes the constructed lines and rings in the order of construction": function() {
      var topology = extract({
        line: {
          type: "LineString",
          coordinates: [[0, 0], [1, 0], [2, 0]]
        },
        multiline: {
          type: "MultiLineString",
          coordinates: [[[0, 0], [1, 0], [2, 0]]]
        },
        polygon: {
          type: "Polygon",
          coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]
        }
      });
      assert.deepEqual(topology.lines, [
        [0, 2],
        [3, 5]
      ]);
      assert.deepEqual(topology.rings, [
        [6, 9]
      ]);
    },
    "supports nested geometry collections": function() {
      var topology = extract({
        foo: {
          type: "GeometryCollection",
          geometries: [{
            type: "GeometryCollection",
            geometries: [{
              type: "LineString",
              coordinates: [[0, 0], [0, 1]]
            }]
          }]
        }
      });
      assert.deepEqual(topology.objects.foo, {
        type: "GeometryCollection",
        geometries: [{
          type: "GeometryCollection",
          geometries: [{
            type: "LineString",
            arcs: [0, 1]
          }]
        }]
      });
    }
  }
});

suite.export(module);
