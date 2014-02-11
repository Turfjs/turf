var vows = require("vows"),
    assert = require("assert"),
    delta = require("../lib/topojson/delta");

var suite = vows.describe("delta");

suite.addBatch({
  "delta": {
    "converts arcs to delta encoding": function() {
      assert.deepEqual(delta({
        type: "Topology",
        arcs: [
          [[0, 0], [9999, 0], [0, 9999], [0, 0]]
        ],
        objects: {}
      }).arcs, [
        [[0, 0], [9999, 0], [-9999, 9999], [0, -9999]]
      ]);
    },
    "does not skip coincident points": function() {
      assert.deepEqual(delta({
        type: "Topology",
        arcs: [
          [[0, 0], [9999, 0], [9999, 0], [0, 9999], [0, 0]]
        ],
        objects: {}
      }).arcs, [
        [[0, 0], [9999, 0], [0, 0], [-9999, 9999], [0, -9999]]
      ]);
    }
  }
});

suite.export(module);
