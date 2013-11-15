var vows = require("vows"),
    assert = require("assert"),
    prune = require("../lib/topojson/prune");

var suite = vows.describe("prune");

suite.addBatch({
  "prune": {
    "preserves arcs that are referenced": function() {
      assert.deepEqual(prune({
        type: "Topology",
        arcs: [
          [[0, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0]
          }
        }
      }), {
        type: "Topology",
        arcs: [
          [[0, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0]
          }
        }
      });
    },
    "removes arcs that are not referenced": function() {
      assert.deepEqual(prune({
        type: "Topology",
        arcs: [
          [[0, 0], [2, 0]],
          [[1, 0], [1, 0]],
          [[2, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0, 2]
          }
        }
      }), {
        type: "Topology",
        arcs: [
          [[0, 0], [2, 0]],
          [[2, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0, 1]
          }
        }
      });
    },
    "removes reversed arcs that are not referenced": function() {
      assert.deepEqual(prune({
        type: "Topology",
        arcs: [
          [[0, 0], [2, 0]],
          [[1, 0], [1, 0]],
          [[2, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [~2, ~0]
          }
        }
      }), {
        type: "Topology",
        arcs: [
          [[2, 0], [1, 0]],
          [[0, 0], [2, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [~0, ~1]
          }
        }
      });
    },
    "removes collapsed arcs": function() {
      assert.deepEqual(prune({
        type: "Topology",
        arcs: [
          [[0, 0], [0, 0]],
          [[0, 0], [2, 0]],
          [[2, 0], [0, 0]],
          [[2, 0], [1, 0]],
          [[3, 0], [0, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0, 1, 2, 3, 4]
          }
        }
      }), {
        type: "Topology",
        arcs: [
          [[0, 0], [2, 0]],
          [[2, 0], [1, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0, 1]
          }
        }
      });
    },
    "does not remove collapsed lines": function() {
      assert.deepEqual(prune({
        type: "Topology",
        arcs: [
          [[2, 0], [0, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0]
          }
        }
      }), {
        type: "Topology",
        arcs: [
          [[2, 0], [0, 0]]
        ],
        objects: {
          foo: {
            type: "LineString",
            arcs: [0]
          }
        }
      });
    }
  }
});

suite.export(module);
