# @turf/midpoint

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## midpoint

Takes two [points][1] and returns a point midway between them.
The midpoint is calculated geodesically, meaning the curvature of the earth is taken into account.

**Parameters**

-   `point1` **[Coord][2]** first point
-   `point2` **[Coord][2]** second point

**Examples**

```javascript
var point1 = turf.point([144.834823, -37.771257]);
var point2 = turf.point([145.14244, -37.830937]);

var midpoint = turf.midpoint(point1, point2);

//addToMap
var addToMap = [point1, point2, midpoint];
midpoint.properties['marker-color'] = '#f00';
```

Returns **[Feature][3]&lt;[Point][4]>** a point midway between `pt1` and `pt2`

[1]: https://tools.ietf.org/html/rfc7946#section-3.1.2

[2]: https://tools.ietf.org/html/rfc7946#section-3.1.1

[3]: https://tools.ietf.org/html/rfc7946#section-3.2

[4]: https://tools.ietf.org/html/rfc7946#section-3.1.2

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/midpoint
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```