# @turf/line-offset

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## lineOffset

Takes a [line][1] and returns a [line][1] at offset by the specified distance.

### Parameters

*   `geojson` **([Geometry][2] | [Feature][3]<([LineString][1] | [MultiLineString][4])>)** input GeoJSON
*   `distance` **[number][5]** distance to offset the line (can be of negative value)
*   `options` **[Object][6]** Optional parameters (optional, default `{}`)

    *   `options.units` **Units** Supports all valid Turf [Units][7]. (optional, default `'kilometers'`)

### Examples

```javascript
var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]], { "stroke": "#F00" });

var offsetLine = turf.lineOffset(line, 2, {units: 'miles'});

//addToMap
var addToMap = [offsetLine, line]
offsetLine.properties.stroke = "#00F"
```

Returns **[Feature][3]<([LineString][1] | [MultiLineString][4])>** Line offset from the input line

[1]: https://tools.ietf.org/html/rfc7946#section-3.1.4

[2]: https://tools.ietf.org/html/rfc7946#section-3.1

[3]: https://tools.ietf.org/html/rfc7946#section-3.2

[4]: https://tools.ietf.org/html/rfc7946#section-3.1.5

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[7]: https://turfjs.org/docs/api/types/Units

<!-- This file is automatically generated. Please don't edit it directly. If you find an error, edit the source file of the module in question (likely index.js or index.ts), and re-run "yarn docs" from the root of the turf project. -->

---

This module is part of the [Turfjs project](https://turfjs.org/), an open source module collection dedicated to geographic algorithms. It is maintained in the [Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create PRs and issues.

### Installation

Install this single module individually:

```sh
$ npm install @turf/line-offset
```

Or install the all-encompassing @turf/turf module that includes all modules as functions:

```sh
$ npm install @turf/turf
```
