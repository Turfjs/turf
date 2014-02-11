var vows = require("vows"),
    assert = require("assert"),
    computeId = require("../lib/topojson/compute-id");

var suite = vows.describe("compute-id");

suite.addBatch({
  "compute-id": {
    "by default, preserves the id of the feature": function() {
      assert.deepEqual(computeId({
        foo: {
          type: "Feature",
          id: "foo",
          geometry: {
            type: "LineString",
            coordinates: [0]
          }
        }
      }).foo, {
        type: "Feature",
        id: "foo",
        geometry: {
          type: "LineString",
          coordinates: [0]
        }
      });
    },
    "observes the specified id function": function() {
      assert.deepEqual(computeId({
        foo: {
          type: "Feature",
          properties: {"name": "foo"},
          geometry: {
            type: "LineString",
            coordinates: [0]
          }
        }
      }, function(feature) {
        return feature.properties.name;
      }).foo, {
        type: "Feature",
        id: "foo",
        properties: {"name": "foo"},
        geometry: {
          type: "LineString",
          coordinates: [0]
        }
      });
    }
  }
});

suite.export(module);
