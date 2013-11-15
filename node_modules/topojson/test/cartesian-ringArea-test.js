var vows = require("vows"),
    assert = require("assert"),
    cartesian = require("../lib/topojson/cartesian");

var suite = vows.describe("topojson.cartesian.ringArea");

suite.addBatch({
  "ringArea": {
    topic: function() {
      return cartesian.ringArea;
    },
    "clockwise area is positive": function(area) {
      assert.ok(area([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]) > 0);
    },
    "counterclockwise area is negative": function(area) {
      assert.ok(area([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]) < 0);
    }
  }
});

suite.export(module);
