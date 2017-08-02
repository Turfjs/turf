
/**
 * Euclidean distance
 */
function eudist(v1, v2, sqrt) {
  var len = v1.length;
  var sum = 0;

  for (var i = 0; i < len; i++) {
    var d = (v1[i] || 0) - (v2[i] || 0);
    sum += d * d;
  }
  // Square root not really needed
  return sqrt ? Math.sqrt(sum) : sum;
}

/**
 * Unidimensional distance
 */
function dist(v1, v2, sqrt) {
  var d = Math.abs(v1 - v2);
  return sqrt ? d : d * d;
}

function kmrand(data, k) {
  var map = {},
      ks = [],
      t = k << 2;
  var len = data.length;
  var multi = data[0].length > 0;

  while (ks.length < k && t-- > 0) {
    var d = data[Math.floor(Math.random() * len)];
    var key = multi ? d.join("_") : "" + d;
    if (!map[key]) {
      map[key] = true;
      ks.push(d);
    }
  }

  if (ks.length < k) throw new Error("Error initializating clusters");else return ks;
}


/**
* K-means++ initial centroid selection
*/
function kmpp(data, k) {
  var distance = data[0].length ? eudist : dist;
  var ks = [],
      len = data.length;
  var multi = data[0].length > 0;
  var map = {};

  // First random centroid
  var c = data[Math.floor(Math.random() * len)];
  var key = multi ? c.join("_") : "" + c;
  ks.push(c);
  map[key] = true;

  // Retrieve next centroids
  while (ks.length < k) {
    // Min Distances between current centroids and data points
    var dists = [],
        lk = ks.length;
    var dsum = 0,
        prs = [];

    for (var i = 0; i < len; i++) {
      var min = Infinity;
      for (var j = 0; j < lk; j++) {
        var _dist = distance(data[i], ks[j]);
        if (_dist <= min) min = _dist;
      }
      dists[i] = min;
    }

    // Sum all min distances
    for (var _i = 0; _i < len; _i++) {
      dsum += dists[_i];
    }

    // Probabilities and cummulative prob (cumsum)
    for (var _i2 = 0; _i2 < len; _i2++) {
      prs[_i2] = { i: _i2, v: data[_i2], pr: dists[_i2] / dsum, cs: 0 };
    }

    // Sort Probabilities
    prs.sort(function (a, b) {
      return a.pr - b.pr;
    });

    // Cummulative Probabilities
    prs[0].cs = prs[0].pr;
    for (var _i3 = 1; _i3 < len; _i3++) {
      prs[_i3].cs = prs[_i3 - 1].cs + prs[_i3].pr;
    }

    // Randomize
    var rnd = Math.random();

    // Gets only the items whose cumsum >= rnd
    var idx = 0;
    while (idx < len - 1 && prs[idx++].cs < rnd) {}
    ks.push(prs[idx - 1].v);
    /*
let done = false;
while(!done) {
// this is our new centroid
c = prs[idx-1].v
key = multi? c.join("_") : `${c}`;
if(!map[key]) {
  map[key] = true;
  ks.push(c);
  done = true;
}
else {
  idx++;
}
}
*/
  }

  return ks;
}

var MAX = 10000;

/**
 * Inits an array with values
 */
function init(len, val, v) {
  v = v || [];
  for (var i = 0; i < len; i++) {
    v[i] = val;
  }return v;
}

function skmeans(data, k, initial, maxit) {
  var ks = [],
      old = [],
      idxs = [],
      dist = [];
  var conv = false,
      it = maxit || MAX;
  var len = data.length,
      vlen = data[0].length,
      multi = vlen > 0;

  if (!initial) {
    var _idxs = {};
    while (ks.length < k) {
      var idx = Math.floor(Math.random() * len);
      if (!_idxs[idx]) {
        _idxs[idx] = true;
        ks.push(data[idx]);
      }
    }
  } else if (initial == "kmrand") {
    ks = kmrand(data, k);
  } else if (initial == "kmpp") {
    ks = kmpp(data, k);
  } else {
    ks = initial;
  }

  do {
    // For each value in data, find the nearest centroid
    for (var i = 0; i < len; i++) {
      var min = Infinity,
          _idx = 0;
      for (var j = 0; j < k; j++) {
        // Multidimensional or unidimensional
        var dist = multi ? eudist(data[i], ks[j]) : Math.abs(data[i] - ks[j]);
        if (dist <= min) {
          min = dist;
          _idx = j;
        }
      }
      idxs[i] = _idx;
    }

    // Recalculate centroids
    var count = [],
        sum = [],
        old = [],
        dif = 0;
    for (var _j = 0; _j < k; _j++) {
      // Multidimensional or unidimensional
      count[_j] = 0;
      sum[_j] = multi ? init(vlen, 0, sum[_j]) : 0;
      old[_j] = ks[_j];
    }

    // If multidimensional
    if (multi) {
      for (var _j2 = 0; _j2 < k; _j2++) {
        ks[_j2] = [];
      } // Sum values and count for each centroid
      for (var _i4 = 0; _i4 < len; _i4++) {
        var _idx2 = idxs[_i4],
            // Centroid for that item
        vsum = sum[_idx2],
            // Sum values for this centroid
        vect = data[_i4]; // Current vector

        // Accumulate value on the centroid for current vector
        for (var h = 0; h < vlen; h++) {
          vsum[h] += vect[h];
        }
        count[_idx2]++; // Number of values for this centroid
      }
      // Calculate the average for each centroid
      conv = true;
      for (var _j3 = 0; _j3 < k; _j3++) {
        var ksj = ks[_j3],
            // Current centroid
        sumj = sum[_j3],
            // Accumulated centroid values
        oldj = old[_j3],
            // Old centroid value
        cj = count[_j3]; // Number of elements for this centroid

        // New average
        for (var _h = 0; _h < vlen; _h++) {
          //ksj[h] = (sumj[h]+oldj[h])/(cj+1) || 0;	// New centroid
          ksj[_h] = sumj[_h] / cj || 0; // New centroid
        }
        // Find if centroids have moved
        if (conv) {
          for (var _h2 = 0; _h2 < vlen; _h2++) {
            if (oldj[_h2] != ksj[_h2]) {
              conv = false;
              break;
            }
          }
        }
      }
    }
    // If unidimensional
    else {
        // Sum values and count for each centroid
        for (var _i5 = 0; _i5 < len; _i5++) {
          var _idx3 = idxs[_i5];
          sum[_idx3] += data[_i5];
          count[_idx3]++;
        }
        // Calculate the average for each centroid
        for (var _j4 = 0; _j4 < k; _j4++) {
          ks[_j4] = sum[_j4] / count[_j4] || 0; // New centroid
        }
        // Find if centroids have moved
        conv = true;
        for (var _j5 = 0; _j5 < k; _j5++) {
          if (old[_j5] != ks[_j5]) {
            conv = false;
            break;
          }
        }
      }

    conv = conv || --it <= 0;
  } while (!conv);

  return {
    it: MAX - it,
    k: k,
    idxs: idxs,
    centroids: ks
  };
}

module.exports = skmeans;