var fs = require("fs"),
    events = require("events");

var nextTick = global.setImmediate || process.nextTick;

exports.readStream = function(filename) {
  var emitter = new events.EventEmitter(),
      read,
      readAll = false,
      bytesNeeded,
      bytesAvailable = 0,
      bytesChunk = 0,
      chunkHead,
      chunkTail;

  fs.createReadStream(filename)
      .on("data", data)
      .on("end", end)
      .on("error", error);

  function maybeRead() {
    if (bytesAvailable >= bytesNeeded) {
      var buffer = consume(bytesNeeded);
      bytesAvailable -= bytesNeeded;
      bytesNeeded = undefined;
      read.call(emitter, buffer);
    }
  }

  function maybeEnd() {
    if (bytesAvailable < bytesNeeded) {
      bytesNeeded = undefined;
      emitter.emit("end");
    }
  }

  function consume(bytes) {
    if (bytesChunk + bytes <= chunkHead.length) {
      return chunkHead.slice(bytesChunk, bytesChunk += bytes);
    }

    var buffer = new Buffer(bytes),
        bytesCopied = chunkHead.length - bytesChunk;

    chunkHead.copy(buffer, 0, bytesChunk);
    chunkHead = chunkHead.next;
    bytesChunk = 0;

    while (bytes - bytesCopied > chunkHead.length) {
      chunkHead.copy(buffer, bytesCopied);
      bytesCopied += chunkHead.length;
      chunkHead = chunkHead.next;
    }

    chunkHead.copy(buffer, bytesCopied, 0, bytesChunk = bytes - bytesCopied);
    return buffer;
  }

  function data(chunk) {
    if (chunkTail) chunkTail.next = chunk;
    if (!chunkHead) chunkHead = chunk;
    chunkTail = chunk;
    bytesAvailable += chunk.length;
    maybeRead();
  }

  function error(e) {
    emitter.emit("error", e);
  }

  function end() {
    readAll = true;
    nextTick(maybeEnd);
  }

  emitter.read = function(bytes, callback) {
    bytesNeeded = bytes;
    if (readAll && bytesAvailable < bytesNeeded) return void nextTick(maybeEnd);
    read = callback;
    nextTick(maybeRead);
  };

  return emitter;
};
