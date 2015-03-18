![turf](https://raw.githubusercontent.com/Turfjs/turf/9a1d5e8d99564d4080f1e2bf1517ed41d18012fa/logo.png) 
======

 <sup>[![Version Badge](http://vb.teelaun.ch/Turfjs/turf.svg)](https://npmjs.org/package/turf)</sup> [![Build Status](https://travis-ci.org/Turfjs/turf.svg?branch=master)](https://travis-ci.org/Turfjs/turf) [![Gitter chat](https://badges.gitter.im/Turfjs/turf.png)](https://gitter.im/Turfjs/turf)


***A modular geospatial engine written in JavaScript***

[turfjs.org](http://turfjs.org/)

- - -

[Turf](https://turfjs.org) is a [JavaScript library](https://en.wikipedia.org/wiki/JavaScript_library) for [spatial analysis](http://en.wikipedia.org/wiki/Spatial_analysis). It includes traditional spatial operations, helper functions for creating [GeoJSON](http://geojson.org) data, and data classification and statistics tools. Turf can be added to your website as a client-side plugin, or you can [run Turf server-side](https://www.npmjs.com/package/turf) with [Node.js](http://nodejs.org/) (see below).

##Installation

**In Node.js:**

```bash
npm install turf
```

**In browser:**

Download the [minified file](https://raw.github.com/morganherlocker/turf/master/turf.min.js), and include it in a script tag. This will expose a global variable named "turf".

```html
<script src="turf.min.js" charset="utf-8"></script>
```

**Browserify:**

All of Turf's functions can also be installed as separate modules. This works well with tools like [browserify](http://browserify.org/) where you want to install only the code you need. It also allows you to mix and match modules. This is the recommended usage pattern for most production environments. For example, to install the *point* and *buffer* modules use:

```sh
npm install turf-point turf-buffer
```

- - -

###Data in Turf

Turf uses <a href='http://geojson.org/'>GeoJSON</a> for all geographic data. Turf expects the data to be standard <a href='http://en.wikipedia.org/wiki/World_Geodetic_System'>WGS84</a> longitude, latitude coordinates. Check out <a href='http://geojson.io/#id=gist:anonymous/844f013aae8354eb889c&map=12/38.8955/-77.0135'>geojson.io</a> for a tool to easily create this data.

Most Turf functions work with GeoJSON features. These are are pieces of data that represent a collection of properties (ie: population, elevation, zipcode, etc.) along with a geometry. GeoJSON has several geometry types such as:

* Point
* LineString
* Polygon

Turf provides a few geometry functions of its own. These are nothing more than simple (and optional) wrappers that output plain old GeoJSON. For example, these two methods of creating a point are functionally equivalent:

```
var point1 = turf.point([0, 0]);

var point2 = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [0, 0]
  },
  properties: {}
};
```

- - -

##Functions

####geometry

[![Build Status](https://travis-ci.org/Turfjs/turf-point.svg?branch=master)](https://travis-ci.org/Turfjs/turf-point) [point](https://github.com/Turfjs/turf-point)

[![Build Status](https://travis-ci.org/Turfjs/turf-linestring.svg?branch=master)](https://travis-ci.org/Turfjs/turf-linestring) [linestring](https://github.com/Turfjs/turf-linestring)

[![Build Status](https://travis-ci.org/Turfjs/turf-polygon.svg?branch=master)](https://travis-ci.org/Turfjs/turf-polygon) [polygon](https://github.com/Turfjs/turf-polygon)

[![Build Status](https://travis-ci.org/Turfjs/turf-featurecollection.svg?branch=master)](https://travis-ci.org/Turfjs/turf-featurecollection) [featurecollection](https://github.com/Turfjs/turf-featurecollection)

####joins

[![Build Status](https://travis-ci.org/Turfjs/turf-inside.svg?branch=master)](https://travis-ci.org/Turfjs/turf-inside) [inside](https://github.com/Turfjs/turf-inside)

[![Build Status](https://travis-ci.org/Turfjs/turf-within.svg?branch=master)](https://travis-ci.org/Turfjs/turf-within) [within](https://github.com/Turfjs/turf-within)

[![Build Status](https://travis-ci.org/Turfjs/turf-tag.svg?branch=master)](https://travis-ci.org/Turfjs/turf-tag) [tag](https://github.com/Turfjs/turf-tag)

####data
[![Build Status](https://travis-ci.org/Turfjs/turf-remove.svg?branch=master)](https://travis-ci.org/Turfjs/turf-remove) [remove](https://github.com/Turfjs/turf-remove)

[![Build Status](https://travis-ci.org/Turfjs/turf-filter.svg?branch=master)](https://travis-ci.org/Turfjs/turf-filter) [filter](https://github.com/Turfjs/turf-filter)

[![Build Status](https://travis-ci.org/Turfjs/turf-sample.svg?branch=master)](https://travis-ci.org/Turfjs/turf-sample) [sample](https://github.com/Turfjs/turf-sample)

####measurement
[![Build Status](https://travis-ci.org/Turfjs/turf-distance.svg?branch=master)](https://travis-ci.org/Turfjs/turf-distance) [distance](https://github.com/Turfjs/turf-distance)

[![Build Status](https://travis-ci.org/Turfjs/turf-area.svg?branch=master)](https://travis-ci.org/Turfjs/turf-area) [area](https://github.com/Turfjs/turf-area)

[![Build Status](https://travis-ci.org/Turfjs/turf-nearest.svg?branch=master)](https://travis-ci.org/Turfjs/turf-nearest) [nearest](https://github.com/Turfjs/turf-nearest)

[![Build Status](https://travis-ci.org/Turfjs/turf-bbox-polygon.svg?branch=master)](https://travis-ci.org/Turfjs/turf-bbox-polygon) [bbox-polygon](https://github.com/Turfjs/turf-bbox-polygon)

[![Build Status](https://travis-ci.org/Turfjs/turf-envelope.svg?branch=master)](https://travis-ci.org/Turfjs/turf-envelope) [envelope](https://github.com/Turfjs/turf-envelope)

[![Build Status](https://travis-ci.org/Turfjs/turf-extent.svg?branch=master)](https://travis-ci.org/Turfjs/turf-extent) [extent](https://github.com/Turfjs/turf-extent)

[![Build Status](https://travis-ci.org/Turfjs/turf-square.svg?branch=master)](https://travis-ci.org/Turfjs/turf-square) [square](https://github.com/Turfjs/turf-square)

[![Build Status](https://travis-ci.org/Turfjs/turf-size.svg?branch=master)](https://travis-ci.org/Turfjs/turf-size) [size](https://github.com/Turfjs/turf-size)

[![Build Status](https://travis-ci.org/Turfjs/turf-center.svg?branch=master)](https://travis-ci.org/Turfjs/turf-center) [center](https://github.com/Turfjs/turf-center)

[![Build Status](https://travis-ci.org/Turfjs/turf-centroid.svg?branch=master)](https://travis-ci.org/Turfjs/turf-centroid) [centroid](https://github.com/Turfjs/turf-centroid)

[![Build Status](https://travis-ci.org/Turfjs/turf-point-on-surface.svg?branch=master)](https://travis-ci.org/Turfjs/turf-point-on-surface) [point-on-surface](https://github.com/Turfjs/turf-point-on-surface)

[![Build Status](https://travis-ci.org/Turfjs/turf-midpoint.svg?branch=master)](https://travis-ci.org/Turfjs/turf-midpoint) [midpoint](https://github.com/Turfjs/turf-midpoint)

[![Build Status](https://travis-ci.org/Turfjs/turf-bearing.svg?branch=master)](https://travis-ci.org/Turfjs/turf-bearing) [bearing](https://github.com/Turfjs/turf-bearing)

[![Build Status](https://travis-ci.org/Turfjs/turf-destination.svg?branch=master)](https://travis-ci.org/Turfjs/turf-destination) [destination](https://github.com/Turfjs/turf-destination)

[![Build Status](https://travis-ci.org/Turfjs/turf-line-distance.svg?branch=master)](https://travis-ci.org/Turfjs/turf-line-distance) [line-distance](https://github.com/Turfjs/turf-line-distance)

[![Build Status](https://travis-ci.org/Turfjs/turf-along.svg?branch=master)](https://travis-ci.org/Turfjs/turf-along) [along](https://github.com/Turfjs/turf-along)

####interpolation

[![Build Status](https://travis-ci.org/Turfjs/turf-tin.svg?branch=master)](https://travis-ci.org/Turfjs/turf-tin) [tin](https://github.com/Turfjs/turf-tin)

[![Build Status](https://travis-ci.org/Turfjs/turf-planepoint.svg?branch=master)](https://travis-ci.org/Turfjs/turf-planepoint) [planepoint](https://github.com/Turfjs/turf-planepoint)

[![Build Status](https://travis-ci.org/Turfjs/turf-isolines.svg?branch=master)](https://travis-ci.org/Turfjs/turf-isolines) [isolines](https://github.com/Turfjs/turf-isolines)

[![Build Status](https://travis-ci.org/Turfjs/turf-isobands.svg?branch=master)](https://travis-ci.org/Turfjs/turf-isobands) [isobands](https://github.com/Turfjs/turf-isobands)

####grids

[![Build Status](https://travis-ci.org/Turfjs/turf-point-grid.svg?branch=master)](https://travis-ci.org/Turfjs/turf-point-grid) [point-grid](https://github.com/Turfjs/turf-point-grid)

[![Build Status](https://travis-ci.org/Turfjs/turf-square-grid.svg?branch=master)](https://travis-ci.org/Turfjs/turf-square-grid) [square-grid](https://github.com/Turfjs/turf-square-grid)

[![Build Status](https://travis-ci.org/Turfjs/turf-hex-grid.svg?branch=master)](https://travis-ci.org/Turfjs/turf-hex-grid) [hex-grid](https://github.com/Turfjs/turf-hex-grid)

[![Build Status](https://travis-ci.org/Turfjs/turf-triangle-grid.svg?branch=master)](https://travis-ci.org/Turfjs/turf-triangle-grid) [triangle-grid](https://github.com/Turfjs/turf-triangle-grid)

####classification
[![Build Status](https://travis-ci.org/Turfjs/turf-quantile.svg?branch=master)](https://travis-ci.org/Turfjs/turf-quantile) [quantile](https://github.com/Turfjs/turf-quantile)

[![Build Status](https://travis-ci.org/Turfjs/turf-jenks.svg?branch=master)](https://travis-ci.org/Turfjs/turf-jenks) [jenks](https://github.com/Turfjs/turf-jenks)

[![Build Status](https://travis-ci.org/Turfjs/turf-reclass.svg?branch=master)](https://travis-ci.org/Turfjs/turf-reclass) [reclass](https://github.com/Turfjs/turf-reclass)

####aggregation
[![Build Status](https://travis-ci.org/Turfjs/turf-average.svg?branch=master)](https://travis-ci.org/Turfjs/turf-average) [average](https://github.com/Turfjs/turf-average)

[![Build Status](https://travis-ci.org/Turfjs/turf-median.svg?branch=master)](https://travis-ci.org/Turfjs/turf-median) [median](https://github.com/Turfjs/turf-median)

[![Build Status](https://travis-ci.org/Turfjs/turf-sum.svg?branch=master)](https://travis-ci.org/Turfjs/turf-sum) [sum](https://github.com/Turfjs/turf-sum)

[![Build Status](https://travis-ci.org/Turfjs/turf-min.svg?branch=master)](https://travis-ci.org/Turfjs/turf-min) [min](https://github.com/Turfjs/turf-min)

[![Build Status](https://travis-ci.org/Turfjs/turf-max.svg?branch=master)](https://travis-ci.org/Turfjs/turf-max) [max](https://github.com/Turfjs/turf-max)

[![Build Status](https://travis-ci.org/Turfjs/turf-count.svg?branch=master)](https://travis-ci.org/Turfjs/turf-count) [count](https://github.com/Turfjs/turf-count)

[![Build Status](https://travis-ci.org/Turfjs/turf-deviation.svg?branch=master)](https://travis-ci.org/Turfjs/turf-deviation) [deviation](https://github.com/Turfjs/turf-deviation)

[![Build Status](https://travis-ci.org/Turfjs/turf-variance.svg?branch=master)](https://travis-ci.org/Turfjs/turf-variance) [variance](https://github.com/Turfjs/turf-variance)

[![Build Status](https://travis-ci.org/Turfjs/turf-aggregate.svg?branch=master)](https://travis-ci.org/Turfjs/turf-aggregate) [aggregate](https://github.com/Turfjs/turf-aggregate)

####transformation
[![Build Status](https://travis-ci.org/Turfjs/turf-buffer.svg?branch=master)](https://travis-ci.org/Turfjs/turf-buffer) [buffer](https://github.com/Turfjs/turf-buffer)

[![Build Status](https://travis-ci.org/Turfjs/turf-bezier.svg?branch=master)](https://travis-ci.org/Turfjs/turf-bezier) [bezier](https://github.com/Turfjs/turf-bezier)

[![Build Status](https://travis-ci.org/Turfjs/turf-simplify.svg?branch=master)](https://travis-ci.org/Turfjs/turf-simplify) [simplify](https://github.com/Turfjs/turf-simplify)

[![Build Status](https://travis-ci.org/Turfjs/turf-union.svg?branch=master)](https://travis-ci.org/Turfjs/turf-union) [union](https://github.com/Turfjs/turf-union)

[![Build Status](https://travis-ci.org/Turfjs/turf-merge.svg?branch=master)](https://travis-ci.org/Turfjs/turf-merge) [merge](https://github.com/Turfjs/turf-merge)

[![Build Status](https://travis-ci.org/Turfjs/turf-intersect.svg?branch=master)](https://travis-ci.org/Turfjs/turf-intersect) [intersect](https://github.com/Turfjs/turf-intersect)

[![Build Status](https://travis-ci.org/Turfjs/turf-erase.svg?branch=master)](https://travis-ci.org/Turfjs/turf-erase) [erase](https://github.com/Turfjs/turf-erase)

[![Build Status](https://travis-ci.org/Turfjs/turf-convex.svg?branch=master)](https://travis-ci.org/Turfjs/turf-convex) [convex](https://github.com/Turfjs/turf-convex)

[![Build Status](https://travis-ci.org/Turfjs/turf-concave.svg?branch=master)](https://travis-ci.org/Turfjs/turf-concave) [concave](https://github.com/Turfjs/turf-concave)

####misc
[![Build Status](https://travis-ci.org/Turfjs/turf-flip.svg?branch=master)](https://travis-ci.org/Turfjs/turf-flip) [flip](https://github.com/Turfjs/turf-flip)

[![Build Status](https://travis-ci.org/Turfjs/turf-explode.svg?branch=master)](https://travis-ci.org/Turfjs/turf-explode) [explode](https://github.com/Turfjs/turf-explode)

[![Build Status](https://travis-ci.org/Turfjs/turf-combine.svg?branch=master)](https://travis-ci.org/Turfjs/turf-combine) [combine](https://github.com/Turfjs/turf-combine)

[![Build Status](https://travis-ci.org/Turfjs/turf-is-clockwise.svg?branch=master)](https://travis-ci.org/Turfjs/turf-is-clockwise) [is-clockwise](https://github.com/Turfjs/turf-is-clockwise)

[![Build Status](https://travis-ci.org/Turfjs/turf-kinks.svg?branch=master)](https://travis-ci.org/Turfjs/turf-kinks) [kinks](https://github.com/Turfjs/turf-kinks)
