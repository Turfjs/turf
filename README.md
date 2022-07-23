![turf](https://raw.githubusercontent.com/Turfjs/turf/9a1d5e8d99564d4080f1e2bf1517ed41d18012fa/logo.png)
======
[![GitHub Actions Status](https://github.com/Turfjs/turf/actions/workflows/turf.yml/badge.svg)](https://github.com/Turfjs/turf/actions/workflows/turf.yml/badge.svg)
[![Version Badge][npm-img]][npm-url]
[![Gitter chat][gitter-img]][gitter-url]
[![Backers on Open Collective][oc-backer-badge]](#backers)
[![Sponsors on Open Collective][oc-sponsor-badge]](#sponsors) [![Coverage Status](https://coveralls.io/repos/github/Turfjs/turf/badge.svg)](https://coveralls.io/github/Turfjs/turf)

[npm-img]: https://img.shields.io/npm/v/@turf/turf.svg
[npm-url]: https://www.npmjs.com/package/@turf/turf
[gitter-img]: https://badges.gitter.im/Turfjs/turf.svg
[gitter-url]: https://gitter.im/Turfjs/turf
[oc-backer-badge]: https://opencollective.com/turf/backers/badge.svg
[oc-sponsor-badge]: https://opencollective.com/turf/sponsors/badge.svg

***A modular geospatial engine written in JavaScript***

[turfjs.org](http://turfjs.org/)

- - -

[Turf](https://turfjs.org) is a [JavaScript library](https://en.wikipedia.org/wiki/JavaScript_library) for [spatial analysis](http://en.wikipedia.org/wiki/Spatial_analysis). It includes traditional spatial operations, helper functions for creating [GeoJSON](http://geojson.org) data, and data classification and statistics tools. Turf can be added to your website as a client-side plugin, or you can [run Turf server-side](https://www.npmjs.com/package/@turf/turf) with [Node.js](http://nodejs.org/) (see below).

## Installation

### In Node.js

```bash
# get all of turf
npm install @turf/turf

# or get individual packages
npm install @turf/helpers
npm install @turf/buffer
```

### In browser

Download the [minified file](https://npmcdn.com/@turf/turf/turf.min.js), and include it in a script tag. This will expose a global variable named `turf`.

```html
<script src="turf.min.js" charset="utf-8"></script>
```

You can also include it directly from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
```

### TypeScript

TypeScript definitions are packaged with each module. No DefinitelyTyped packages required.

### Other languages

Ports of Turf.js are available in:

- [Java](https://github.com/mapbox/mapbox-java/tree/master/services-turf/src/main/java/com/mapbox/turf) (Android, Java SE)
  - > [The current to-do list for porting to Java](https://github.com/mapbox/mapbox-java/blob/master/docs/turf-port.md)
- [Swift](https://github.com/mapbox/turf-swift/) (iOS, macOS, tvOS, watchOS, Linux)
  - > Turf for Swift is **experimental** and its public API is subject to change. Please use with care.
- [Dart/Flutter](https://github.com/dartclub/turf_dart) (Dart Web, Dart Native; Flutter for iOS, Android, macOS, Windows, Linux, Web)
  - > The Turf for Dart port is still in progress, the implementation status can be found in the [README](https://github.com/dartclub/turf_dart#components).
- - -

## Data in Turf

Turf uses <a href='http://geojson.org/'>GeoJSON</a> for all geographic data. Turf expects the data to be standard <a href='http://en.wikipedia.org/wiki/World_Geodetic_System'>WGS84</a> longitude, latitude coordinates. Check out <a href='http://geojson.io/#id=gist:anonymous/844f013aae8354eb889c&map=12/38.8955/-77.0135'>geojson.io</a> for a tool to easily create this data.

> **NOTE:** Turf expects data in (longitude, latitude) order per the GeoJSON standard.

Most Turf functions work with GeoJSON features. These are pieces of data that represent a collection of properties (ie: population, elevation, zipcode, etc.) along with a geometry. GeoJSON has several geometry types such as:

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

## Browser support

Turf packages are compiled to target ES2017. However, the browser version of @turf/turf is transpiled to also include support for IE11. If you are using these packages and need to target IE11, please transpile the following packages as part of your build:

```
@turf/*
robust-predicates
rbush
tinyqueue
```

## Contributors

This project exists thanks to all the people who contribute. If you are interested in helping, check out the [Contributing Guide](CONTRIBUTING.md).

<a href="https://github.com/Turfjs/turf/graphs/contributors"><img src="https://opencollective.com/turf/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/turf#backer)]

<a href="https://opencollective.com/turf#backers" target="_blank"><img src="https://opencollective.com/turf/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/turf#sponsor)]

<a href="https://opencollective.com/turf/sponsor/0/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/1/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/2/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/3/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/4/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/5/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/6/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/7/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/8/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/9/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/9/avatar.svg"></a>
