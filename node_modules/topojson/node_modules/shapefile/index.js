var events = require("events");

var shp = require("./shp"),
    dbf = require("./dbf"),
    list = require("./list");

exports.version = require("./package.json").version;

exports.readStream = function(filename, options) {
  var emitter = new events.EventEmitter(),
      convert,
      encoding = null,
      ignoreProperties = false;

  if (typeof options === "string") options = {encoding: options};

  if (options)
    "encoding" in options && (encoding = options["encoding"]),
    "ignore-properties" in options && (ignoreProperties = !!options["ignore-properties"]);

  if (/\.shp$/.test(filename)) filename = filename.substring(0, filename.length - 4);

  if (ignoreProperties) {
    readGeometry(emptyNextProperties, emptyEnd);
  } else {
    var propertiesQueue = list(),
        callbackQueue = list(),
        endCallback,
        ended;

    readProperties(filename, encoding, function(error, properties) {
      if (error) return void emitter.emit("error", error);
      if (!callbackQueue.empty()) return void callbackQueue.pop()(null, properties);
      propertiesQueue.push(properties);
    }, function() {
      if (endCallback) return void endCallback(null);
      ended = true;
    });

    readGeometry(function(callback) {
      if (!propertiesQueue.empty()) return void callback(null, propertiesQueue.pop());
      callbackQueue.push(callback);
    }, function(callback) {
      if (ended) return void callback(null);
      endCallback = callback;
    });
  }

  function readGeometry(readNextProperties, readEnd) {
    shp.readStream(filename + ".shp")
        .on("header", function(header) {
          convert = convertGeometry[header.shapeType];
        })
        .on("record", function(record) {
          readNextProperties(function(error, properties) {
            if (error) return void emitter.emit("error", error);
            emitter.emit("feature", {
              type: "Feature",
              properties: properties,
              geometry: record == null ? null : convert(record)
            });
          });
        })
        .on("error", function(error) {
          emitter.emit("error", error);
        })
        .on("end", function() {
          readEnd(function(error) {
            if (error) return void emitter.emit("error", error);
            emitter.emit("end");
          });
        });
  }

  return emitter;
};

function readProperties(filename, encoding, propertyCallback, endCallback) {
  var properties = [],
      convert;

  dbf.readStream(filename + ".dbf", encoding)
      .on("header", function(header) {
        convert = new Function("d", "return {"
            + header.fields.map(function(field, i) { return JSON.stringify(field.name) + ":d[" + i + "]"; })
            + "};");
      })
      .on("record", function(record) { propertyCallback(null, convert(record)); })
      .on("error", propertyCallback)
      .on("end", endCallback);
}

var convertGeometry = {
  1: convertPoint,
  3: convertPolyLine,
  5: convertPolygon,
  8: convertMultiPoint,
  11: convertPoint, // PointZ
  13: convertPolyLine, // PolyLineZ
  15: convertPolygon, // PolygonZ
  18: convertMultiPoint // MultiPointZ
};

function emptyNextProperties(callback) {
  callback(null, {});
}

function emptyEnd(callback) {
  callback(null);
}

function convertPoint(record) {
  return {
    type: "Point",
    coordinates: [record.x, record.y]
  };
}

function convertPolyLine(record) {
  return record.parts.length === 1 ? {
    type: "LineString",
    coordinates: record.points
  } : {
    type: "MultiLineString",
    coordinates: record.parts.map(function(i, j) {
      return record.points.slice(i, record.parts[j + 1]);
    })
  };
}

function convertPolygon(record) {
  var parts = record.parts.map(function(i, j) { return record.points.slice(i, record.parts[j + 1]); }),
      polygons = [],
      holes = [];

  parts.forEach(function(part) {
    if (ringClockwise(part)) polygons.push([part]);
    else holes.push(part);
  });

  holes.forEach(function(hole) {
    var point = hole[0];
    polygons.some(function(polygon) {
      if (ringContains(polygon[0], point)) {
        polygon.push(hole);
        return true;
      }
    }) || polygons.push([hole]);
  });

  return polygons.length > 1
      ? {type: "MultiPolygon", coordinates: polygons}
      : {type: "Polygon", coordinates: polygons[0]};
}

function convertMultiPoint(record) {
  return {
    type: "MultiPoint",
    coordinates: record.points
  };
}

function ringClockwise(ring) {
  if ((n = ring.length) < 4) return false;
  var i = 0,
      n,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area >= 0;
}

function ringContains(ring, point) {
  var x = point[0],
      y = point[1],
      contains = false;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1],
        pj = ring[j], xj = pj[0], yj = pj[1];
    if (((yi > y) ^ (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) contains = !contains;
  }
  return contains;
}
