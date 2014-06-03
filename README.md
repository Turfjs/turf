turf
======

[![Build Status](https://travis-ci.org/atdrago/turf.png)](https://travis-ci.org/atdrago/turf)

![turf](https://raw.github.com/morganherlocker/turf/master/img/turf.png)

***a fast and fully featured open gis engine written in javascript***

- - -

##Installation

```bash
npm install turf
```

Turf can also be run in a browser. To use it, download the [minified file](https://raw.github.com/morganherlocker/turf/master/turf.min.js), and include it in a script tag.

**NOTE: Browser functionality is currently unstable. Please consider using turf from node.js. Work is in progress on resolving the issues.**

```html
<script src="turf.min.js"></script>
```

It can also be installed using bower:

```bash
bower install turf
```

- - -

##Features

####geometry
- [point](https://github.com/Turfjs/turf-point)
- [linestring](https://github.com/Turfjs/turf-linestring)
- [polygon](https://github.com/Turfjs/turf-polygon)
- [featurecollection](https://github.com/Turfjs/turf-featurecollection)

####joins
- [inside](https://github.com/Turfjs/turf-inside)
- [within](https://github.com/Turfjs/turf-within)
- [tag](https://github.com/Turfjs/turf-tag)

####data
- [remove](https://github.com/Turfjs/turf-remove)
- [filter](https://github.com/Turfjs/turf-filter)
- [sample](https://github.com/Turfjs/turf-sample)

####measurement
- [distance](https://github.com/Turfjs/turf-distance)
- [nearest](https://github.com/Turfjs/turf-nearest)
- [bboxPolygon](https://github.com/Turfjs/turf-bboxPolygon)
- [envelope](https://github.com/Turfjs/turf-envelope)
- [extent](https://github.com/Turfjs/turf-extent)
- [square](https://github.com/Turfjs/turf-square)
- [size](https://github.com/Turfjs/turf-size)
- [center](https://github.com/Turfjs/turf-center)
- [centroid](https://github.com/Turfjs/turf-centroid)
- [midpoint](https://github.com/Turfjs/turf-midpoint)

####interpolation
- [tin](https://github.com/Turfjs/turf-tin)
- [grid](https://github.com/Turfjs/turf-grid)
- [planepoint](https://github.com/Turfjs/turf-planepoint)
- [isolines](https://github.com/Turfjs/turf-isolines)
- [isobands](https://github.com/Turfjs/turf-isolines)

####classification
- [quantile](https://github.com/Turfjs/turf-quantile)
- [jenks](https://github.com/Turfjs/turf-jenks)
- [reclass](https://github.com/Turfjs/turf-reclass)

####aggregation
- [average](https://github.com/Turfjs/turf-average)
- [median](https://github.com/Turfjs/turf-median)
- [sum](https://github.com/Turfjs/turf-sum)
- [min](https://github.com/Turfjs/turf-min)
- [max](https://github.com/Turfjs/turf-max)
- [count](https://github.com/Turfjs/turf-count)
- [deviation](https://github.com/Turfjs/turf-deviation)
- [variance](https://github.com/Turfjs/turf-variance)
- [aggregate](https://github.com/Turfjs/turf-aggregate)

####transformation
- [buffer](https://github.com/Turfjs/turf-buffer)
- [bezier](https://github.com/Turfjs/turf-bezier)
- [simplify](https://github.com/Turfjs/turf-simplify)
- [union](https://github.com/Turfjs/turf-union)
- [merge](https://github.com/Turfjs/turf-merge)
- [intersect](https://github.com/Turfjs/turf-intersect)
- [erase](https://github.com/Turfjs/turf-erase)
- [donuts](https://github.com/Turfjs/turf-donuts)
- [convex](https://github.com/Turfjs/turf-convex)
- [concave](https://github.com/Turfjs/turf-concave)

####misc
- [flip](https://github.com/Turfjs/turf-flip)
- [explode](https://github.com/Turfjs/turf-explode)
- [combine](https://github.com/Turfjs/turf-combine)
- [isClockwise](https://github.com/Turfjs/turf-isClockwise)

- - -


This library is built and maintained by [@morganherlocker](https://twitter.com/morganherlocker) :)
