var vows = require("vows"),
    assert = require("./assert"),
    simplify = require("../lib/topojson/simplify");

var suite = vows.describe("simplify");

suite.addBatch({
  "simplify": {
    "removes points with area below minimum area threshold": function() {
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {},
        arcs: [
          [[0, 0], [10, 10], [0, 1], [1, -1], [-11, 0], [0, -10]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian",
      });
      assert.deepEqual(
        topology.arcs,
        [[[0, 0], [10, 10], [-10, 0], [0, -10]]]
      );
    },
    "preserves points with area greater or equal to minimum area threshold": function() {
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {},
        arcs: [
          [[0, 0], [10, 10], [0, 1], [1, -1], [-11, 0], [0, -10]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian",
      });
      assert.deepEqual(
        topology.arcs,
        [[[0, 0], [10, 10], [-10, 0], [0, -10]]]
      );
    },
    "assumes delta-encoded arcs for quantized topologies": function() {
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {},
        arcs: [
          [[0, 0], [10, 10], [0, 1], [1, -1], [-11, 0], [0, -10]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian",
      });
      assert.deepEqual(
        topology.arcs,
        [[[0, 0], [10, 10], [-10, 0], [0, -10]]]
      );
    },
    "assumes non-delta-encoded arcs for non-quantized topologies": function() {
      var topology = simplify({
        objects: {},
        arcs: [
          [[0, 0], [10, 10], [10, 11], [11, 10], [0, 10], [0, 0]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian",
      });
      assert.deepEqual(
        topology.arcs,
        [[[0, 0], [10, 10], [0, 10], [0, 0]]]
      );
    },
    "preserves degenerate arcs in non-quantized topologies": function() {
      var topology = simplify({
        objects: {},
        arcs: [
          [[50, 50], [50, 50]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian"
      });
      assert.deepEqual(topology.arcs, [
        [[50, 50], [50, 50]]
      ]);
    },
    "preserves degenerate arcs in quantized topologies": function() {
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {},
        arcs: [
          [[50, 50], [0, 0]]
        ]
      }, {
        "minimum-area": 2,
        "coordinate-system": "cartesian"
      });
      assert.deepEqual(topology.arcs, [
        [[50, 50], [0, 0]]
      ]);
    },
    "does not remove empty arcs": function() {
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {
          foo: {
            type: "LineString",
            arcs: [0, 1, 2]
          }
        },
        arcs: [
          [[0, 0], [10, 0]],
          [[10, 0], [1, 1], [-1, -1]],
          [[10, 0], [0, 10]]
        ]
      }, {
        "minimum-area": 1,
        "coordinate-system": "cartesian"
      });
      assert.deepEqual(topology.arcs, [
        [[0, 0], [10, 0]],
        [[10, 0], [0, 0]],
        [[10, 0], [0, 10]]
      ]);
      assert.deepEqual(topology.objects.foo.arcs, [0, 1, 2]);
    },
    "minimum area is zero on empty input when retain-proportion is specified": function() {
      var options = {
        "retain-proportion": 1,
        "coordinate-system": "cartesian"
      };
      var topology = simplify({
        transform: {scale: [1, 1], translate: [0, 0]},
        objects: {},
        arcs: []
      }, options);
      assert.equal(options["minimum-area"], 0);
      assert.deepEqual(topology.arcs, []);
    }
  }
});

suite.export(module);
