var vows = require("vows"),
    assert = require("assert"),
    extract = require("../../lib/topojson/topology/extract"),
    join = require("../../lib/topojson/topology/join");

var suite = vows.describe("join");

suite.addBatch({
  "join": {
    "the returned hashtable has true for junction points": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]}
      }));
      assert.isTrue(junctionByPoint.get([2, 0]));
      assert.isTrue(junctionByPoint.get([0, 0]));
    },
    "the returned hashtable has undefined for non-junction points": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [2, 0]]}
      }));
      assert.isUndefined(junctionByPoint.get([1, 0]));
    },
    "exact duplicate lines ABC & ABC have junctions at their end points": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abc2: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0]]);
    },
    "reversed duplicate lines ABC & CBA have junctions at their end points": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0]]);
    },
    "exact duplicate rings ABCA & ABCA have no junctions": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        abca2: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "reversed duplicate rings ACBA & ABCA have no junctions": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        acba: {type: "Polygon", coordinates: [[[0, 0], [2, 0], [1, 0], [0, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "rotated duplicate rings BCAB & ABCA have no junctions": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        bcab: {type: "Polygon", coordinates: [[[1, 0], [2, 0], [0, 0], [1, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "ring ABCA & line ABCA have a junction at A": function() {
      var junctionByPoint = join(extract({
        abcaLine: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [0, 0]]},
        abcaPolygon: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0]]);
    },
    "ring BCAB & line ABCA have a junction at A": function() {
      var junctionByPoint = join(extract({
        abcaLine: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [0, 0]]},
        bcabPolygon: {type: "Polygon", coordinates: [[[1, 0], [2, 0], [0, 0], [1, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0]]);
    },
    "ring ABCA & line BCAB have a junction at B": function() {
      var junctionByPoint = join(extract({
        bcabLine: {type: "LineString", coordinates: [[1, 0], [2, 0], [0, 0], [1, 0]]},
        abcaPolygon: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), [[1, 0]]);
    },
    "when an old arc ABC extends a new arc AB, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a reversed old arc CBA extends a new arc AB, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a new arc ADE shares its start with an old arc ABC, there is a junction at A": function() {
      var junctionByPoint = join(extract({
        ade: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 1], [2, 1]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0], [2, 1]]);
    },
    "ring ABA has no junctions": function() {
      var junctionByPoint = join(extract({
        aba: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "ring AA has no junctions": function() {
      var junctionByPoint = join(extract({
        aa: {type: "Polygon", coordinates: [[[0, 0], [0, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "degenerate ring A has no junctions": function() {
      var junctionByPoint = join(extract({
        a: {type: "Polygon", coordinates: [[[0, 0]]]},
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "when a new line DEC shares its end with an old line ABC, there is a junction at C": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dec: {type: "LineString", coordinates: [[0, 1], [1, 1], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0], [0, 1]]);
    },
    "when a new line ABC extends an old line AB, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a new line ABC extends a reversed old line BA, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        ba: {type: "LineString", coordinates: [[1, 0], [0, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a new line starts BC in the middle of an old line ABC, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        bc: {type: "LineString", coordinates: [[1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a new line BC starts in the middle of a reversed old line CBA, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        bc: {type: "LineString", coordinates: [[1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [1, 0], [2, 0]]);
    },
    "when a new line ABD deviates from an old line ABC, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abd: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0], [1, 0], [3, 0]]);
    },
    "when a new line ABD deviates from a reversed old line CBA, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        abd: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[2, 0], [0, 0], [1, 0], [3, 0]]);
    },
    "when a new line DBC merges into an old line ABC, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dbc: {type: "LineString", coordinates: [[3, 0], [1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0], [1, 0], [3, 0]]);
    },
    "when a new line DBC merges into a reversed old line CBA, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        dbc: {type: "LineString", coordinates: [[3, 0], [1, 0], [2, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[2, 0], [0, 0], [1, 0], [3, 0]]);
    },
    "when a new line DBE shares a single midpoint with an old line ABC, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dbe: {type: "LineString", coordinates: [[0, 1], [1, 0], [2, 1]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [2, 0], [2, 1], [1, 0], [0, 1]]);
    },
    "when a new line ABDE skips a point with an old line ABCDE, there is a junction at B and D": function() {
      var junctionByPoint = join(extract({
        abcde: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]},
        abde: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0], [4, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [4, 0], [1, 0], [3, 0]]);
    },
    "when a new line ABDE skips a point with a reversed old line EDCBA, there is a junction at B and D": function() {
      var junctionByPoint = join(extract({
        edcba: {type: "LineString", coordinates: [[4, 0], [3, 0], [2, 0], [1, 0], [0, 0]]},
        abde: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0], [4, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[4, 0], [0, 0], [1, 0], [3, 0]]);
    },
    "when a line ABCDBE self-intersects with its middle, there are no junctions": function() {
      var junctionByPoint = join(extract({
        abcdbe: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 0], [4, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [4, 0]]);
    },
    "when a line ABACD self-intersects with its start, there are no junctions": function() {
      var junctionByPoint = join(extract({
        abacd: {type: "LineString", coordinates: [[0, 0], [1, 0], [0, 0], [3, 0], [4, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [4, 0]]);
    },
    "when a line ABCDBD self-intersects with its end, there are no junctions": function() {
      var junctionByPoint = join(extract({
        abcdbd: {type: "LineString", coordinates: [[0, 0], [1, 0], [4, 0], [3, 0], [4, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [4, 0]]);
    },
    "when an old line ABCDBE self-intersects and shares a point B, there is a junction at B": function() {
      var junctionByPoint = join(extract({
        abcdbe: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 0], [4, 0]]},
        fbg: {type: "LineString", coordinates: [[0, 1], [1, 0], [2, 1]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0], [4, 0], [1, 0], [0, 1], [2, 1]]);
    },
    "when a line ABCA is closed, there is a junction at A": function() {
      var junctionByPoint = join(extract({
        abca: {type: "LineString", coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[0, 0]]);
    },
    "when a ring ABCA is closed, there are no junctions": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "exact duplicate rings ABCA & ABCA share the arc ABCA": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        abca2: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "reversed duplicate rings ABCA & ACBA share the arc ABCA": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        acba: {type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 0], [0, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "coincident rings ABCA & BCAB share the arc BCAB": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        bcab: {type: "Polygon", coordinates: [[[1, 0], [0, 1], [0, 0], [1, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "coincident rings ABCA & BACB share the arc BCAB": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        bacb: {type: "Polygon", coordinates: [[[1, 0], [0, 0], [0, 1], [1, 0]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), []);
    },
    "coincident rings ABCA & DBED share the point B": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        dbed: {type: "Polygon", coordinates: [[[2, 1], [1, 0], [2, 2], [2, 1]]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[1, 0]]);
    },
    "coincident ring ABCA & line DBE share the point B": function() {
      var junctionByPoint = join(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        dbe: {type: "LineString", coordinates: [[2, 1], [1, 0], [2, 2]]}
      }));
      assertSetEqual(junctionByPoint.keys(), [[2, 1], [2, 2], [1, 0]]);
    }
  }
});

function assertSetEqual(pointsA, pointsB) {
  assert.deepEqual(pointsA.sort(comparePoint), pointsB.sort(comparePoint));
}

function comparePoint(pointA, pointB) {
  return pointA[0] - pointB[0] || pointA[1] - pointB[1];
}

suite.export(module);
