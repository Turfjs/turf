# turf-bbox-polygon

# bboxPolygon

Takes a bbox and returns an equivalent [polygon](Polygon).

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** an Array of bounding box coordinates in the form: `[xLow, yLow, xHigh, yHigh]`

**Examples**

```javascript
var bbox = [0, 0, 10, 10];

var poly = turf.bboxPolygon(bbox);

//=poly
```

Returns **Feature&lt;Polygon>** a Polygon representation of the bounding box

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-bbox-polygon
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
