# turf-sample

# sample

Takes a [FeatureCollection](FeatureCollection) and returns a FeatureCollection with given number of [features](Feature) at random.

**Parameters**

-   `featurecollection` **FeatureCollection** set of input features
-   `num` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of features to select

**Examples**

```javascript
var points = turf.random('points', 1000);

//=points

var sample = turf.sample(points, 10);

//=sample
```

Returns **FeatureCollection** a FeatureCollection with `n` features

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-sample
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
