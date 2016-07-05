# turf-flip

# flip

Takes input features and flips all of their coordinates
from `[x, y]` to `[y, x]`.

**Parameters**

-   `input` **(Feature | FeatureCollection)** input features

**Examples**

```javascript
var serbia = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [20.566406, 43.421008]
  }
};

//=serbia

var saudiArabia = turf.flip(serbia);

//=saudiArabia
```

Returns **(Feature | FeatureCollection)** a feature or set of features of the same type as `input` with flipped coordinates

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-flip
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
