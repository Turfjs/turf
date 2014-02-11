var vows = require("vows"),
    assert = require("assert"),
    extract = require("../../lib/topojson/topology/extract"),
    cut = require("../../lib/topojson/topology/cut");

var suite = vows.describe("cut");

suite.addBatch({
  "cut": {
    "exact duplicate lines ABC & ABC have no cuts": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abc2: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 2}},
        abc2: {type: "LineString", arcs: {0: 3, 1: 5}}
      });
    },
    "reversed duplicate lines ABC & CBA have no cuts": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 2}},
        cba: {type: "LineString", arcs: {0: 3, 1: 5}}
      });
    },
    "exact duplicate rings ABCA & ABCA have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        abca2: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        abca2: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "reversed duplicate rings ACBA & ABCA have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        acba: {type: "Polygon", coordinates: [[[0, 0], [2, 0], [1, 0], [0, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        acba: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "rotated duplicate rings BCAB & ABCA have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
        bcab: {type: "Polygon", coordinates: [[[1, 0], [2, 0], [0, 0], [1, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        bcab: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "ring ABCA & line ABCA have no cuts": function() {
      var topology = cut(extract({
        abcaLine: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [0, 0]]},
        abcaPolygon: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        abcaLine: {type: "LineString", arcs: {0: 0, 1: 3}},
        abcaPolygon: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "ring BCAB & line ABCA have no cuts": function() {
      var topology = cut(extract({
        abcaLine: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [0, 0]]},
        bcabPolygon: {type: "Polygon", coordinates: [[[1, 0], [2, 0], [0, 0], [1, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        abcaLine: {type: "LineString", arcs: {0: 0, 1: 3}},
        bcabPolygon: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
      assert.deepEqual(topology.coordinates.slice(4, 8), [[0, 0], [1, 0], [2, 0], [0, 0]]);
    },
    "ring ABCA & line BCAB have no cuts": function() {
      var topology = cut(extract({
        bcabLine: {type: "LineString", coordinates: [[1, 0], [2, 0], [0, 0], [1, 0]]},
        abcaPolygon: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        bcabLine: {type: "LineString", arcs: {0: 0, 1: 3}},
        abcaPolygon: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "when an old arc ABC extends a new arc AB, ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        ab: {type: "LineString", arcs: {0: 3, 1: 4}}
      });
    },
    "when a reversed old arc CBA extends a new arc AB, CBA is cut into CB-BA": function() {
      var topology = cut(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        cba: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        ab: {type: "LineString", arcs: {0: 3, 1: 4}}
      });
    },
    "when a new arc ADE shares its start with an old arc ABC, there are no cuts": function() {
      var topology = cut(extract({
        ade: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 1], [2, 1]]}
      }));
      assert.deepEqual(topology.objects, {
        ade: {type: "LineString", arcs: {0: 0, 1: 2}},
        abc: {type: "LineString", arcs: {0: 3, 1: 5}}
      });
    },
    "ring ABA has no cuts": function() {
      var topology = cut(extract({
        aba: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        aba: {type: "Polygon", arcs: [{0: 0, 1: 2}]}
      });
    },
    "ring AA has no cuts": function() {
      var topology = cut(extract({
        aa: {type: "Polygon", coordinates: [[[0, 0], [0, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        aa: {type: "Polygon", arcs: [{0: 0, 1: 1}]}
      });
    },
    "degenerate ring A has no cuts": function() {
      var topology = cut(extract({
        a: {type: "Polygon", coordinates: [[[0, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        a: {type: "Polygon", arcs: [{0: 0, 1: 0}]}
      });
    },
    "when a new line DEC shares its end with an old line ABC, there are no cuts": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dec: {type: "LineString", coordinates: [[0, 1], [1, 1], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 2}},
        dec: {type: "LineString", arcs: {0: 3, 1: 5}}
      });
    },
    "when a new line ABC extends an old line AB, ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        ab: {type: "LineString", coordinates: [[0, 0], [1, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        ab: {type: "LineString", arcs: {0: 0, 1: 1}},
        abc: {type: "LineString", arcs: {0: 2, 1: 3, next: {0: 3, 1: 4}}}
      });
    },
    "when a new line ABC extends a reversed old line BA, ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        ba: {type: "LineString", coordinates: [[1, 0], [0, 0]]},
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        ba: {type: "LineString", arcs: {0: 0, 1: 1}},
        abc: {type: "LineString", arcs: {0: 2, 1: 3, next: {0: 3, 1: 4}}}
      });
    },
    "when a new line starts BC in the middle of an old line ABC, ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        bc: {type: "LineString", coordinates: [[1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        bc: {type: "LineString", arcs: {0: 3, 1: 4}}
      });
    },
    "when a new line BC starts in the middle of a reversed old line CBA, CBA is cut into CB-BA": function() {
      var topology = cut(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        bc: {type: "LineString", coordinates: [[1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        cba: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        bc: {type: "LineString", arcs: {0: 3, 1: 4}}
      });
    },
    "when a new line ABD deviates from an old line ABC, ABD is cut into AB-BD and ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        abd: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        abd: {type: "LineString", arcs: {0: 3, 1: 4, next: {0: 4, 1: 5}}}
      });
    },
    "when a new line ABD deviates from a reversed old line CBA, CBA is cut into CB-BA and ABD is cut into AB-BD": function() {
      var topology = cut(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        abd: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        cba: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        abd: {type: "LineString", arcs: {0: 3, 1: 4, next: {0: 4, 1: 5}}}
      });
    },
    "when a new line DBC merges into an old line ABC, DBC is cut into DB-BC and ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dbc: {type: "LineString", coordinates: [[3, 0], [1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        dbc: {type: "LineString", arcs: {0: 3, 1: 4, next: {0: 4, 1: 5}}}
      });
    },
    "when a new line DBC merges into a reversed old line CBA, DBC is cut into DB-BC and CBA is cut into CB-BA": function() {
      var topology = cut(extract({
        cba: {type: "LineString", coordinates: [[2, 0], [1, 0], [0, 0]]},
        dbc: {type: "LineString", coordinates: [[3, 0], [1, 0], [2, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        cba: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        dbc: {type: "LineString", arcs: {0: 3, 1: 4, next: {0: 4, 1: 5}}}
      });
    },
    "when a new line DBE shares a single midpoint with an old line ABC, DBE is cut into DB-BE and ABC is cut into AB-BC": function() {
      var topology = cut(extract({
        abc: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0]]},
        dbe: {type: "LineString", coordinates: [[0, 1], [1, 0], [2, 1]]}
      }));
      assert.deepEqual(topology.objects, {
        abc: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 2}}},
        dbe: {type: "LineString", arcs: {0: 3, 1: 4, next: {0: 4, 1: 5}}}
      });
    },
    "when a new line ABDE skips a point with an old line ABCDE, ABDE is cut into AB-BD-DE and ABCDE is cut into AB-BCD-DE": function() {
      var topology = cut(extract({
        abcde: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]},
        abde: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0], [4, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abcde: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 3, next: {0: 3, 1: 4}}}},
        abde: {type: "LineString", arcs: {0: 5, 1: 6, next: {0: 6, 1: 7, next: {0: 7, 1: 8}}}}
      });
    },
    "when a new line ABDE skips a point with a reversed old line EDCBA, ABDE is cut into AB-BD-DE and EDCBA is cut into ED-DCB-BA": function() {
      var topology = cut(extract({
        edcba: {type: "LineString", coordinates: [[4, 0], [3, 0], [2, 0], [1, 0], [0, 0]]},
        abde: {type: "LineString", coordinates: [[0, 0], [1, 0], [3, 0], [4, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        edcba: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 3, next: {0: 3, 1: 4}}}},
        abde: {type: "LineString", arcs: {0: 5, 1: 6, next: {0: 6, 1: 7, next: {0: 7, 1: 8}}}}
      });
    },
    "when a line ABCDBE self-intersects with its middle, it is not cut": function() {
      var topology = cut(extract({
        abcdbe: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 0], [4, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abcdbe: {type: "LineString", arcs: {0: 0, 1: 5}}
      });
    },
    "when a line ABACD self-intersects with its start, it is cut into ABA-ACD": function() {
      var topology = cut(extract({
        abacd: {type: "LineString", coordinates: [[0, 0], [1, 0], [0, 0], [3, 0], [4, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abacd: {type: "LineString", arcs: {0: 0, 1: 2, next: {0: 2, 1: 4}}}
      });
    },
    "when a line ABDCD self-intersects with its end, it is cut into ABD-DCD": function() {
      var topology = cut(extract({
        abdcd: {type: "LineString", coordinates: [[0, 0], [1, 0], [4, 0], [3, 0], [4, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abdcd: {type: "LineString", arcs: {0: 0, 1: 2, next: {0: 2, 1: 4}}}
      });
    },
    "when an old line ABCDBE self-intersects and shares a point B, ABCDBE is cut into AB-BCDB-BE and FBG is cut into FB-BG": function() {
      var topology = cut(extract({
        abcdbe: {type: "LineString", coordinates: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 0], [4, 0]]},
        fbg: {type: "LineString", coordinates: [[0, 1], [1, 0], [2, 1]]}
      }));
      assert.deepEqual(topology.objects, {
        abcdbe: {type: "LineString", arcs: {0: 0, 1: 1, next: {0: 1, 1: 4, next: {0: 4, 1: 5}}}},
        fbg: {type: "LineString", arcs: {0: 6, 1: 7, next: {0: 7, 1: 8}}}
      });
    },
    "when a line ABCA is closed, there are no cuts": function() {
      var topology = cut(extract({
        abca: {type: "LineString", coordinates: [[0, 0], [1, 0], [0, 1], [0, 0]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "LineString", arcs: {0: 0, 1: 3}}
      });
    },
    "when a ring ABCA is closed, there are no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]}
      });
    },
    "exact duplicate rings ABCA & ABCA have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        abca2: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        abca2: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "reversed duplicate rings ABCA & ACBA have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        acba: {type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 0], [0, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        acba: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "coincident rings ABCA & BCAB have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        bcab: {type: "Polygon", coordinates: [[[1, 0], [0, 1], [0, 0], [1, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        bcab: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "coincident rings ABCA & BACB have no cuts": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        bacb: {type: "Polygon", coordinates: [[[1, 0], [0, 0], [0, 1], [1, 0]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        bacb: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
    },
    "coincident rings ABCDA, EFAE & GHCG are cut into ABC-CDA, EFAE and GHCG": function() {
      var topology = cut(extract({
        abcda: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]},
        efae: {type: "Polygon", coordinates: [[[0, -1], [1, -1], [0, 0], [0, -1]]]},
        ghcg: {type: "Polygon", coordinates: [[[0, 2], [1, 2], [1, 1], [0, 2]]]}
      }));
      assert.deepEqual(topology.objects, {
        abcda: {type: "Polygon", arcs: [{0: 0, 1: 2, next: {0: 2, 1: 4}}]},
        efae: {type: "Polygon", arcs: [{0: 5, 1: 8}]},
        ghcg: {type: "Polygon", arcs: [{0: 9, 1: 12}]}
      });
    },
    "coincident rings ABCA & DBED have no cuts, but are rotated to share B": function() {
      var topology = cut(extract({
        abca: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]]},
        dbed: {type: "Polygon", coordinates: [[[2, 1], [1, 0], [2, 2], [2, 1]]]}
      }));
      assert.deepEqual(topology.objects, {
        abca: {type: "Polygon", arcs: [{0: 0, 1: 3}]},
        dbed: {type: "Polygon", arcs: [{0: 4, 1: 7}]}
      });
      assert.deepEqual(topology.coordinates.slice(0, 4), [[1, 0], [0, 1], [0, 0], [1, 0]]);
      assert.deepEqual(topology.coordinates.slice(4, 8), [[1, 0], [2, 2], [2, 1], [1, 0]]);
    },
    "overlapping rings ABCDA and BEFCB are cut into BC-CDAB and BEFC-CB": function() {
      var topology = cut(extract({
        abcda: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]}, // rotated to BCDAB, cut BC-CDAB
        befcb: {type: "Polygon", coordinates: [[[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]]]},
      }));
      assert.deepEqual(topology.objects, {
        abcda: {type: "Polygon", arcs: [{0: 0, 1: 1, next: {0: 1, 1: 4}}]},
        befcb: {type: "Polygon", arcs: [{0: 5, 1: 8, next: {0: 8, 1: 9}}]}
      });
    }
  }
});

suite.export(module);
