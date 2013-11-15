var file = require("./file");

exports.readStream = function(filename) {
  var stream = file.readStream(filename),
      shapeType,
      readShapeType,
      read = stream.read;

  delete stream.read;

  read(100, readFileHeader);

  function readFileHeader(fileHeader) {
    stream.emit("header", {
      fileCode: fileHeader.readInt32BE(0), // TODO verify 9994
      version: fileHeader.readInt32LE(28), // TODO verify 1000
      shapeType: shapeType = fileHeader.readInt32LE(32),
      box: [fileHeader.readDoubleLE(36), fileHeader.readDoubleLE(44), fileHeader.readDoubleLE(52), fileHeader.readDoubleLE(60)]
      // TODO zMin: fileHeader.readDoubleLE(68)
      // TODO zMax: fileHeader.readDoubleLE(76)
      // TODO mMin: fileHeader.readDoubleLE(84)
      // TODO mMax: fileHeader.readDoubleLE(92)
    });
    if (!(shapeType in readShape)) return void stream.emit("error", new Error("unsupported shape type: " + shapeType));
    readShapeType = readShape[shapeType];
    read(8, readRecordHeader);
  }

  function readRecordHeader(recordHeader) {
    // TODO verify var recordNumber = recordHeader.readInt32BE(0);
    read(recordHeader.readInt32BE(4) * 2, function readRecord(record) {
      var shapeType = record.readInt32LE(0);
      stream.emit("record", shapeType ? readShapeType(record) : null);
      read(8, readRecordHeader);
    });
  }

  return stream;
};

var readShape = {
  0: readNull,
  1: readPoint,
  3: readPoly(3), // PolyLine
  5: readPoly(5), // Polygon
  8: readMultiPoint,
  11: readPoint, // PointZ
  13: readPoly(3), // PolyLineZ
  15: readPoly(5), // PolygonZ
  18: readMultiPoint // MultiPointZ
  // 21: TODO readPointM
  // 23: TODO readPolyLineM
  // 25: TODO readPolygonM
  // 28: TODO readMultiPointM
  // 31: TODO readMultiPatch
};

function readNull() {
  return null;
}

function readPoint(record) {
  var x = record.readDoubleLE(4),
      y = record.readDoubleLE(12);
  return {
    shapeType: 1,
    x: x,
    y: y
  };
}

function readPoly(shapeType) {
  return function(record) {
    var box = [record.readDoubleLE(4), record.readDoubleLE(12), record.readDoubleLE(20), record.readDoubleLE(28)],
        numParts = record.readInt32LE(36),
        numPoints = record.readInt32LE(40),
        parts = new Array(numParts),
        points = new Array(numPoints),
        i = 44,
        j;
    for (j = 0; j < numParts; ++j, i += 4) parts[j] = record.readInt32LE(i);
    for (j = 0; j < numPoints; ++j, i += 16) points[j] = [record.readDoubleLE(i), record.readDoubleLE(i + 8)];
    return {
      shapeType: shapeType,
      box: box,
      parts: parts,
      points: points
    };
  };
}

function readMultiPoint(record) {
  var box = [record.readDoubleLE(4), record.readDoubleLE(12), record.readDoubleLE(20), record.readDoubleLE(28)],
      numPoints = record.readInt32LE(36),
      points = new Array(numPoints),
      i = 40,
      j;
  for (j = 0; j < numPoints; ++j, i += 16) points[j] = [record.readDoubleLE(i), record.readDoubleLE(i + 8)];
  return {
    shapeType: 8,
    box: box,
    points: points
  };
}
