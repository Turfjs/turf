(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.skmeans = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	/**
	 * Euclidean distance
	 */
	eudist(v1,v2,sqrt) {
		var len = v1.length;
		var sum = 0;

		for(let i=0;i<len;i++) {
			var d = (v1[i]||0) - (v2[i]||0);
			sum += d*d;
		}
		// Square root not really needed
		return sqrt? Math.sqrt(sum) : sum;
	},

	/**
	 * Unidimensional distance
	 */
	dist(v1,v2,sqrt) {
		var d = Math.abs(v1-v2);
		return sqrt? d : d*d;
	}

}

},{}],2:[function(require,module,exports){
const
	Distance = require("./distance.js"),
	eudist = Distance.eudist,
	dist = Distance.dist;

module.exports = {
	kmrand(data,k) {
		var map = {}, ks = [], t = k<<2;
		var len = data.length;
		var multi = data[0].length>0;

		while(ks.length<k && (t--)>0) {
			let d = data[Math.floor(Math.random()*len)];
			let key = multi? d.join("_") : `${d}`;
			if(!map[key]) {
				map[key] = true;
				ks.push(d);
			}
		}

		if(ks.length<k) throw new Error("Error initializating clusters");
		else return ks;
	},

	/**
	 * K-means++ initial centroid selection
	 */
	kmpp(data,k) {
		var distance = data[0].length? eudist : dist;
		var ks = [], len = data.length;
		var multi = data[0].length>0;
		var map = {};

		// First random centroid
		var c = data[Math.floor(Math.random()*len)];
		var key = multi? c.join("_") : `${c}`;
		ks.push(c);
		map[key] = true;

		// Retrieve next centroids
		while(ks.length<k) {
			// Min Distances between current centroids and data points
			let dists = [], lk = ks.length;
			let dsum = 0, prs = [];

			for(let i=0;i<len;i++) {
				let min = Infinity;
				for(let j=0;j<lk;j++) {
					let dist = distance(data[i],ks[j]);
					if(dist<=min) min = dist;
				}
				dists[i] = min;
			}

			// Sum all min distances
			for(let i=0;i<len;i++) {
				dsum += dists[i]
			}

			// Probabilities and cummulative prob (cumsum)
			for(let i=0;i<len;i++) {
				prs[i] = {i:i, v:data[i],	pr:dists[i]/dsum, cs:0}
			}

			// Sort Probabilities
			prs.sort((a,b)=>a.pr-b.pr);

			// Cummulative Probabilities
			prs[0].cs = prs[0].pr;
			for(let i=1;i<len;i++) {
				prs[i].cs = prs[i-1].cs + prs[i].pr;
			}

			// Randomize
			let rnd = Math.random();

			// Gets only the items whose cumsum >= rnd
			let idx = 0;
			while(idx<len-1 && prs[idx++].cs<rnd);
			ks.push(prs[idx-1].v);
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

}

},{"./distance.js":1}],3:[function(require,module,exports){
/*jshint esversion: 6 */

const
	Distance = require("./distance.js"),
	ClusterInit = require("./kinit.js"),
	eudist = Distance.eudist,
	dist = Distance.dist,
	kmrand = ClusterInit.kmrand,
	kmpp = ClusterInit.kmpp;

const MAX = 10000;

/**
 * Inits an array with values
 */
function init(len,val,v) {
	v = v || [];
	for(let i=0;i<len;i++) v[i] = val;
	return v;
}

function skmeans(data,k,initial,maxit) {
	var ks = [], old = [], idxs = [], dist = [];
	var conv = false, it = maxit || MAX;
	var len = data.length, vlen = data[0].length, multi = vlen>0;

	if(!initial) {
		let idxs = {};
		while(ks.length<k) {
			let idx = Math.floor(Math.random()*len);
			if(!idxs[idx]) {
				idxs[idx] = true;
				ks.push(data[idx]);
			}
		}
	}
	else if(initial=="kmrand") {
		ks = kmrand(data,k);
	}
	else if(initial=="kmpp") {
		ks = kmpp(data,k);
	}
	else {
		ks = initial;
	}

	do {
		// For each value in data, find the nearest centroid
		for(let i=0;i<len;i++) {
			let min = Infinity, idx = 0;
			for(let j=0;j<k;j++) {
				// Multidimensional or unidimensional
				var dist = multi? eudist(data[i],ks[j]) : Math.abs(data[i]-ks[j]);
				if(dist<=min) {
					min = dist;
					idx = j;
				}
			}
			idxs[i] = idx;
		}

		// Recalculate centroids
		var count = [], sum = [], old = [], dif = 0;
		for(let j=0;j<k;j++) {
			// Multidimensional or unidimensional
			count[j] = 0;
			sum[j] = multi? init(vlen,0,sum[j]) : 0;
			old[j] = ks[j];
		}

		// If multidimensional
		if(multi) {
			for(let j=0;j<k;j++) ks[j] = [];

			// Sum values and count for each centroid
			for(let i=0;i<len;i++) {
				let idx = idxs[i],	// Centroid for that item
					vsum = sum[idx],	// Sum values for this centroid
					vect = data[i];		// Current vector

				// Accumulate value on the centroid for current vector
				for(let h=0;h<vlen;h++) {
					vsum[h] += vect[h];
				}
				count[idx]++;	// Number of values for this centroid
			}
			// Calculate the average for each centroid
			conv = true;
			for(let j=0;j<k;j++) {
				let ksj = ks[j],	// Current centroid
					sumj = sum[j],	// Accumulated centroid values
					oldj = old[j], 	// Old centroid value
					cj = count[j];	// Number of elements for this centroid

				// New average
				for(let h=0;h<vlen;h++) {
					//ksj[h] = (sumj[h]+oldj[h])/(cj+1) || 0;	// New centroid
					ksj[h] = (sumj[h])/(cj) || 0;	// New centroid
				}
				// Find if centroids have moved
				if(conv) {
					for(let h=0;h<vlen;h++) {
						if(oldj[h]!=ksj[h]) {
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
			for(let i=0;i<len;i++) {
				let idx = idxs[i];
				sum[idx] += data[i];
				count[idx]++;
			}
			// Calculate the average for each centroid
			for(let j=0;j<k;j++) {
				ks[j] = sum[j]/count[j] || 0;	// New centroid
			}
			// Find if centroids have moved
			conv = true;
			for(let j=0;j<k;j++) {
				if(old[j]!=ks[j]) {
					conv = false;
					break;
				}
			}
		}

		conv = conv || (--it<=0);
	}while(!conv);

	return {
		it : MAX-it,
		k : k,
		idxs : idxs,
		centroids : ks
	};
}

module.exports = skmeans;

},{"./distance.js":1,"./kinit.js":2}]},{},[3])(3)
});