var vows = require("vows"),
    assert = require("assert"),
    prefilter = require("../lib/topojson/prefilter");

var suite = vows.describe("prefilter");

suite.addBatch({
  "prefilter": {
    "removes rings that don’t pass the test": function() {
      assert.deepEqual(prefilter({
        foo: {
          type: "Polygon",
          coordinates: [
            [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]],
            [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
          ]
        }
      }, function(ring) {
        return ringArea(ring) > 1;
      }), {
        foo: {
          type: "Polygon",
          coordinates: [
            [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]
          ]
        }
      });
    },
    "when a polygon has no rings left, it becomes a null geometry": function() {
      assert.deepEqual(prefilter({
        foo: {
          type: "Polygon",
          coordinates: [
            [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
          ]
        }
      }, function(ring) {
        return ringArea(ring) > 1;
      }), {
        foo: {
          type: null,
        }
      });
    },
    "when a multipolygon only has one polygon left, it becomes a polygon": function() {
      assert.deepEqual(prefilter({
        foo: {
          type: "MultiPolygon",
          coordinates: [
            [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]],
            [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
          ]
        }
      }, function(ring) {
        return ringArea(ring) > 1;
      }), {
        foo: {
          type: "Polygon",
          coordinates: [
            [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]
          ]
        }
      });
    }
  }
});

function ringArea(ring) {
  var i = 0,
      n = ring.length,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) {
    area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  }
  return -area * .5; // ensure clockwise pixel areas are positive
}

suite.export(module);
