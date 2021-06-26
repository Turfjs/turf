const BLACK = 0;
const RED = 1;
function colorOf(p) {
  return p === null ? BLACK : p.color;
}
function parentOf(p) {
  return p === null ? null : p.parent;
}
function setColor(p, c) {
  if (p !== null) p.color = c;
}
function leftOf(p) {
  return p === null ? null : p.left;
}
function rightOf(p) {
  return p === null ? null : p.right;
}

/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/TreeMap.html
 *
 * @extends {SortedMap}
 * @constructor
 * @private
 */
export default function TreeMap(
  comparator = (a, b) => {
    return a.compareTo(b);
  }
) {
  this._root_ = null;
  this._size_ = 0;
  this._compare = comparator;
}

/**
 * @override
 */
TreeMap.prototype.get = function (key) {
  let p = this._root_;
  while (p !== null) {
    const cmp = this._compare(key, p.key);
    if (cmp < 0) p = p.left;
    else if (cmp > 0) p = p.right;
    else return p.value;
  }
  return null;
};

/**
 * @override
 */
TreeMap.prototype.put = function (key, value) {
  if (this._root_ === null) {
    this._root_ = {
      key: key,
      value: value,
      left: null,
      right: null,
      parent: null,
      color: BLACK,
      getValue() {
        return this.value;
      },
      getKey() {
        return this.key;
      },
    };
    this._size_ = 1;
    return null;
  }
  let t = this._root_;
  let parent;
  let cmp;
  do {
    parent = t;
    cmp = this._compare(key, t.key);
    if (cmp < 0) {
      t = t.left;
    } else if (cmp > 0) {
      t = t.right;
    } else {
      const oldValue = t.value;
      t.value = value;
      return oldValue;
    }
  } while (t !== null);
  const e = {
    key: key,
    left: null,
    right: null,
    value: value,
    parent: parent,
    color: BLACK,
    getValue() {
      return this.value;
    },
    getKey() {
      return this.key;
    },
  };
  if (cmp < 0) {
    parent.left = e;
  } else {
    parent.right = e;
  }
  this.fixAfterInsertion(e);
  this._size_++;
  return null;
};

/**
 * @param {Object} x
 */
TreeMap.prototype.fixAfterInsertion = function (x) {
  x.color = RED;
  while (x != null && x !== this._root_ && x.parent.color === RED) {
    if (parentOf(x) === leftOf(parentOf(parentOf(x)))) {
      const y = rightOf(parentOf(parentOf(x)));
      if (colorOf(y) === RED) {
        setColor(parentOf(x), BLACK);
        setColor(y, BLACK);
        setColor(parentOf(parentOf(x)), RED);
        x = parentOf(parentOf(x));
      } else {
        if (x === rightOf(parentOf(x))) {
          x = parentOf(x);
          this.rotateLeft(x);
        }
        setColor(parentOf(x), BLACK);
        setColor(parentOf(parentOf(x)), RED);
        this.rotateRight(parentOf(parentOf(x)));
      }
    } else {
      const y = leftOf(parentOf(parentOf(x)));
      if (colorOf(y) === RED) {
        setColor(parentOf(x), BLACK);
        setColor(y, BLACK);
        setColor(parentOf(parentOf(x)), RED);
        x = parentOf(parentOf(x));
      } else {
        if (x === leftOf(parentOf(x))) {
          x = parentOf(x);
          this.rotateRight(x);
        }
        setColor(parentOf(x), BLACK);
        setColor(parentOf(parentOf(x)), RED);
        this.rotateLeft(parentOf(parentOf(x)));
      }
    }
  }
  this._root_.color = BLACK;
};

/**
 * @override
 */
TreeMap.prototype.values = function () {
  const arrayList = [];
  let p = this.getFirstEntry();
  if (p !== null) {
    arrayList.push(p.value);
    while ((p = TreeMap.successor(p)) !== null) {
      arrayList.push(p.value);
    }
  }
  return arrayList;
};

/**
 * @override
 */
TreeMap.prototype.entrySet = function () {
  const hashSet = [];
  let p = this.getFirstEntry();
  if (p !== null) {
    hashSet.push(p);
    while ((p = TreeMap.successor(p)) !== null) {
      hashSet.push(p);
    }
  }
  return hashSet;
};

/**
 * @param {Object} p
 */
TreeMap.prototype.rotateLeft = function (p) {
  if (p != null) {
    const r = p.right;
    p.right = r.left;
    if (r.left != null) {
      r.left.parent = p;
    }
    r.parent = p.parent;
    if (p.parent === null) {
      this._root_ = r;
    } else if (p.parent.left === p) {
      p.parent.left = r;
    } else {
      p.parent.right = r;
    }
    r.left = p;
    p.parent = r;
  }
};

/**
 * @param {Object} p
 */
TreeMap.prototype.rotateRight = function (p) {
  if (p != null) {
    const l = p.left;
    p.left = l.right;
    if (l.right != null) l.right.parent = p;
    l.parent = p.parent;
    if (p.parent === null) {
      this._root_ = l;
    } else if (p.parent.right === p) {
      p.parent.right = l;
    } else p.parent.left = l;
    l.right = p;
    p.parent = l;
  }
};

/**
 * @return {Object}
 */
TreeMap.prototype.getFirstEntry = function () {
  let p = this._root_;
  if (p != null) {
    while (p.left != null) {
      p = p.left;
    }
  }
  return p;
};

/**
 * @param {Object} t
 * @return {Object}
 * @private
 */
TreeMap.successor = function (t) {
  if (t === null) {
    return null;
  } else if (t.right !== null) {
    let p = t.right;
    while (p.left !== null) {
      p = p.left;
    }
    return p;
  } else {
    let p = t.parent;
    let ch = t;
    while (p !== null && ch === p.right) {
      ch = p;
      p = p.parent;
    }
    return p;
  }
};

/**
 * @override
 */
TreeMap.prototype.size = function () {
  return this._size_;
};
