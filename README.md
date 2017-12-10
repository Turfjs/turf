![turf](https://raw.githubusercontent.com/Turfjs/turf/9a1d5e8d99564d4080f1e2bf1517ed41d18012fa/logo.png)
======

[![Version Badge][npm-img]][npm-url]
[![Travis CI](https://travis-ci.org/Turfjs/turf.svg?branch=master)](https://travis-ci.org/Turfjs/turf)
[![Gitter chat][gitter-img]][gitter-url]
[![Coverage Status](https://coveralls.io/repos/github/Turfjs/turf/badge.svg)](https://coveralls.io/github/Turfjs/turf)
[![Greenkeeper badge](https://badges.greenkeeper.io/Turfjs/turf.svg)](https://greenkeeper.io/)

[npm-img]: https://img.shields.io/npm/v/@turf/turf.svg
[npm-url]: https://www.npmjs.com/package/@turf/turf
[gitter-img]: https://badges.gitter.im/Turfjs/turf.svg
[gitter-url]: https://gitter.im/Turfjs/turf

***A modular geospatial engine written in JavaScript***

[turfjs.org](http://turfjs.org/)

- - -

[Turf](https://turfjs.org) is a [JavaScript library](https://en.wikipedia.org/wiki/JavaScript_library) for [spatial analysis](http://en.wikipedia.org/wiki/Spatial_analysis). It includes traditional spatial operations, helper functions for creating [GeoJSON](http://geojson.org) data, and data classification and statistics tools. Turf can be added to your website as a client-side plugin, or you can [run Turf server-side](https://www.npmjs.com/package/turf) with [Node.js](http://nodejs.org/) (see below).

## Installation

### In Node.js

```bash
npm install @turf/turf
```

### In browser

Download the [minified file](https://npmcdn.com/@turf/turf/turf.min.js), and include it in a script tag. This will expose a global variable named `turf`.

```html
<script src="turf.min.js" charset="utf-8"></script>
```

You can also include it directly from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js"></script>
```

You can create light-weight turf builds with only the functions you need using the [turfjs-builder UI](https://turfjs-builder.herokuapp.com/) or using browserify as described below.

### Browserify

All of Turf's functions can also be installed as separate modules. This works well with tools like [browserify](http://browserify.org/) where you want to install only the code you need. It also allows you to mix and match modules. This is the recommended usage pattern for most production environments. For example, to install the *point* and *buffer* modules use:

```sh
npm install @turf/helpers @turf/buffer
```

### Bower [NOTE: Bower support has been dropped Jan 1st 2017]

_Not recommended. Please don't use Bower. Use Browserify, Webpack, or the CDN instead._

### TypeScript

TypeScript is supported internally within each module, no installs required.

### Other languages

Ports of Turf.js are underway [in Swift](https://github.com/mapbox/turf-swift/) (for iOS and macOS) and [in Java](https://github.com/mapbox/mapbox-java/tree/master/mapbox/libjava-services/src/main/java/com/mapbox/services/api/utils/turf/) (for Android and Java SE).

- - -

## Data in Turf

Turf uses <a href='http://geojson.org/'>GeoJSON</a> for all geographic data. Turf expects the data to be standard <a href='http://en.wikipedia.org/wiki/World_Geodetic_System'>WGS84</a> longitude, latitude coordinates. Check out <a href='http://geojson.io/#id=gist:anonymous/844f013aae8354eb889c&map=12/38.8955/-77.0135'>geojson.io</a> for a tool to easily create this data.

> **NOTE:** Turf expects data in (longitude, latitude) order per the GeoJSON standard.

Most Turf functions work with GeoJSON features. These are are pieces of data that represent a collection of properties (ie: population, elevation, zipcode, etc.) along with a geometry. GeoJSON has several geometry types such as:

* Point
* LineString
* Polygon

Turf provides a few geometry functions of its own. These are nothing more than simple (and optional) wrappers that output plain old GeoJSON. For example, these two methods of creating a point are functionally equivalent:

```js
// Note order: longitude, latitude.
var point1 = turf.point([-73.988214, 40.749128]);

var point2 = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    // Note order: longitude, latitude.
    coordinates: [-73.988214, 40.749128]
  },
  properties: {}
};
```
