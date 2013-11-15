var vows = require("vows"),
    assert = require("assert"),
    hashtable = require("../../lib/topojson/topology/hashtable");

var suite = vows.describe("hashtable");

suite.addBatch({
  "hashtable": {
    "can get an object by key": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      map.set(key, 42);
      assert.equal(map.get(key), 42);
    },
    "get returns undefined when no key is found": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      assert.isUndefined(map.get(key));
    },
    "get returns the missing value when no key is found": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      assert.equal(map.get(key, 42), 42);
    },
    "when a hash collision occurs, get checks that the keys are equal": function() {
      var map = hashtable(10, hash, equals),
          keyA = {hash: 1},
          keyB = {hash: 1},
          keyC = {hash: 1};
      map.set(keyA, "A");
      map.set(keyB, "B");
      assert.equal(map.get(keyA), "A");
      assert.equal(map.get(keyB), "B");
      assert.isUndefined(map.get(keyC));
    },
    "can set an object by key": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      map.set(key, 42);
      assert.equal(map.get(key), 42);
    },
    "set returns the set value": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      assert.equal(map.set(key, 42), 42);
    },
    "set throws an error when full": function() {
      var map = hashtable(16, hash, equals),
          keys = [];
      for (var i = 0; i < 16; ++i) map.set(keys[i] = {hash: i}, true);
      for (var i = 0; i < 16; ++i) map.set(keys[i], true); // replacing is okay
      assert.throws(function() { map.set({hash: 16}, true); });
      map.remove(keys[15]); // removing frees a spot
      map.set({hash: 16}, true);
    },
    "when a hash collision occurs, set checks that the keys are equal": function() {
      var map = hashtable(10, hash, equals),
          keyA = {hash: 1},
          keyB = {hash: 1},
          keyC = {hash: 1};
      assert.equal(map.set(keyA, "A"), "A");
      assert.equal(map.set(keyB, "B"), "B");
      assert.equal(map.get(keyA), "A");
      assert.equal(map.get(keyB), "B");
      assert.isUndefined(map.get(keyC));
    },
    "can remove an object by key": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      map.set(key, 42);
      map.remove(key);
      assert.isUndefined(map.get(key));
    },
    "remove returns whether or not the key was present": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 1};
      assert.isFalse(map.remove(key));
      map.set(key, 42);
      assert.isTrue(map.remove(key));
      assert.isUndefined(map.get(key));
    },
    "when a hash collision occurs, remove checks that the keys are equal": function() {
      var map = hashtable(10, hash, equals),
          keyA = {hash: 1},
          keyB = {hash: 1},
          keyC = {hash: 1};
      map.set(keyA, "A");
      map.set(keyB, "B");
      assert.isTrue(map.remove(keyB));
      assert.equal(map.get(keyA), "A");
      assert.isUndefined(map.get(keyB));
      map.set(keyB, "B");
      assert.isTrue(map.remove(keyA));
      assert.isUndefined(map.get(keyA));
      assert.equal(map.get(keyB), "B");
      assert.isTrue(map.remove(keyB));
      assert.isUndefined(map.get(keyB));
    },
    "the hash function must return a nonnegative integer, but can be greater than size": function() {
      var map = hashtable(10, hash, equals),
          key = {hash: 11};
      assert.isUndefined(map.get(key));
      assert.equal(map.set(key, 42), 42);
      assert.equal(map.get(key), 42);
      assert.isTrue(map.remove(key));
      assert.isFalse(map.remove(key));
    }
  }
});

function hash(o) {
  return o.hash;
}

function equals(a, b) {
  return a === b;
}

suite.export(module);
