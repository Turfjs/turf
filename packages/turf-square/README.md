# turf-square

# square

Takes a bounding box and calculates the minimum square bounding box that
would contain the input.

**Parameters**

-   `bbox` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** a bounding box

**Examples**

```javascript
var bbox = [-20,-20,-15,0];

var squared = turf.square(bbox);

var features = {
  "type": "FeatureCollection",
  "features": [
    turf.bboxPolygon(bbox),
    turf.bboxPolygon(squared)
  ]
};

//=features
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** a square surrounding `bbox`

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-square
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
