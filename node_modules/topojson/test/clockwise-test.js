var vows = require("vows"),
    assert = require("assert"),
    clockwise = require("../lib/topojson/clockwise");

var suite = vows.describe("clockwise");

suite.addBatch({
  "clockwise": {
    "spherical": {
      "geometry": {
        "ensures the ring with the largest absolute area is the exterior": function() {
          var o = {
            type: "Polygon",
            coordinates: [
              [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]],
              [[0, 0], [0, 3], [3, 3], [3, 0], [0, 0]]
            ]
          };
          clockwise(o, {"coordinate-system": "spherical"});
          assert.deepEqual(o.coordinates, [
            [[0, 0], [0, 3], [3, 3], [3, 0], [0, 0]],
            [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]
          ]);
        }
      },
      "topology": {
        "ensures the ring with the largest absolute area is the exterior": function() {
          var o = {
            type: "Topology",
            objects: {
              polygon: {
                type: "Polygon",
                arcs: [[0], [1]]
              }
            },
            arcs: [
              [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]],
              [[0, 0], [0, 3], [3, 3], [3, 0], [0, 0]]
            ]
          };
          clockwise(o, {"coordinate-system": "spherical"});
          assert.deepEqual(o.objects.polygon.arcs, [[1], [0]]);
        }
      }
    },
    "cartesian": {
      "geometry": {
        "ensures the ring with the largest absolute area is the exterior": function() {
          var o = {
            type: "Polygon",
            coordinates: [
              [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]],
              [[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]
            ]
          };
          clockwise(o, {"coordinate-system": "cartesian"});
          assert.deepEqual(o.coordinates, [
            [[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]],
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]
          ]);
        }
      },
      "topology": {
        "ensures the ring with the largest absolute area is the exterior": function() {
          var o = {
            type: "Topology",
            objects: {
              polygon: {
                type: "Polygon",
                arcs: [[0], [1]]
              }
            },
            arcs: [
              [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]],
              [[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]
            ]
          };
          clockwise(o, {"coordinate-system": "cartesian"});
          assert.deepEqual(o.objects.polygon.arcs, [[1], [0]]);
        }
      }
    }
  }
});

suite.export(module);
