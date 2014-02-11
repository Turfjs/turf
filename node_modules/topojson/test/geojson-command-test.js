var fs = require("fs"),
    os = require("os"),
    path = require("path"),
    child = require("child_process"),
    vows = require("vows"),
    assert = require("./assert");

var suite = vows.describe("bin/geojson");

var tmpprefix = "geojson-command-test-" + process.pid + "-",
    testId = Math.random() * 0xffff | 0;

suite.addBatch({
  "Polygons": testConversion(
    {
      polygon: "polygon-feature"
    },
    "-- test/topojson/polygon.json"
  ),
  "Non-quantized Polygons": testConversion(
    {
      polygon: "polygon-feature"
    },
    "-- test/topojson/polygon-no-quantization.json"
  ),
  "Projected polygons": testConversion(
    {
      clockwise: "polygon-feature-mercator",
      counterclockwise: "polygon-feature-mercator"
    },
    "-- test/topojson/polygon-mercator.json"
  ),
  "Rounded polygons": testConversion(
    {
      clockwise: "polygon-feature-rounded",
      counterclockwise: "polygon-feature-rounded"
    },
    "--precision 2"
    + " -- test/topojson/polygon-mercator.json"
  )
});

function testConversion(output, options) {
  if (!options) options = "";
  var tmpdir = os.tmpdir() + tmpprefix + (++testId).toString(16);
  fs.mkdirSync(tmpdir);
  return {
    topic: function() {
      var callback = this.callback;
      child.exec("bin/geojson -o " + tmpdir + " " + options, function(error) {
        if (error) return void callback(error);
        var actual = {};
        fs.readdirSync(tmpdir).forEach(function(file) {
          actual[path.basename(file, ".json")] = JSON.parse(fs.readFileSync(tmpdir + "/" + file), "utf-8");
          fs.unlinkSync(tmpdir + "/" + file);
        });
        fs.rmdir(tmpdir);
        callback(null, actual);
      });
    },
    "has the expected output": function(actual) {
      for (var file in output) {
        assert.deepEqual(actual[file], JSON.parse(fs.readFileSync("test/geojson/" + output[file] + ".json", "utf-8")));
      }
    }
  };
}

suite.export(module);
