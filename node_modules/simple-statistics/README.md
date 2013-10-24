[![Build Status](https://secure.travis-ci.org/tmcw/simple-statistics.png?branch=master)](http://travis-ci.org/tmcw/simple-statistics)

A project to learn about and make simple reference implementations
of statistics algorithms.

This code is designed to work in browsers (including IE)
as well as in node.js.

## Basic Descriptive Statistics

```javascript
// Require simple statistics
var ss = require('simple-statistics');

// The input is a simple array
var list = [1, 2, 3];

// Many different descriptive statistics are supported
var sum = ss.sum(list),
    mean = ss.mean(list),
    min = ss.min(list),
    geometric_mean = ss.geometric_mean(list),
    max = ss.max(list),
    quantile = ss.quantile(0.25);
```

## Linear Regression

```javascript
// For a linear regression, it's a two-dimensional array
var data = [ [1, 2], [2, 3] ];

// simple-statistics can produce a linear regression and return
// a friendly javascript function for the line.
var line = ss.linear_regression()
    .data(data)
    .line();

// get a point along the line function
line(0);

var line = ss.linear_regression()

// Get the r-squared value of the line estimation
ss.r_squared(data, line);
```

## [Literate Documentation](http://macwright.org/simple-statistics/)

### Mixin Style

_This is **optional** and not used by default. You can opt-in to mixins
with `ss.mixin()`._

This mixes `simple-statistics` methods into the Array prototype - note that
[extending native objects](http://perfectionkills.com/extending-built-in-native-objects-evil-or-not/) is a
tricky move.

This will _only work_ if `defineProperty` is available, which means modern browsers
and nodejs - on IE8 and below, calling `ss.mixin()` will throw an exception.

```javascript
// mixin to Array class
ss.mixin();

// The input is a simple array
var list = [1, 2, 3];

// The same descriptive techniques as above, but in a simpler style
var sum = list.sum(),
    mean = list.mean(),
    min = list.min(),
    max = list.max(),
    quantile = list.quantile(0.25);
```

### Bayesian Classifier

```javascript
var bayes = ss.bayesian();
bayes.train({ species: 'Cat' }, 'animal');
bayes.score({ species: 'Cat' });
// { animal: 1 }
```

## Examples

* [Linear regression with simple-statistics and d3js](http://bl.ocks.org/3931800)
* [Jenks Natural Breaks with a choropleth map with d3js](http://bl.ocks.org/tmcw/4969184)

## Usage

To use it in browsers, grab [simple_statistics.js](https://raw.github.com/tmcw/simple-statistics/master/src/simple_statistics.js).
To use it in node, install it with [npm](https://npmjs.org/) or add it to your package.json.

    npm install simple-statistics

To use it with [component](https://github.com/component/component),

    component install tmcw/simple-statistics

# [Documentation](https://github.com/tmcw/simple-statistics/blob/master/API.md)
# [Tests](http://travis-ci.org/#!/tmcw/simple-statistics)

# Contributors

* Tom MacWright
* [Matt Sacks](https://github.com/mattsacks)
* Doron Linder
* [Alexander Sicular](https://github.com/siculars)

## See Also

* [stream-statistics](https://github.com/tmcw/stream-statistics), a sister project that implements
  many of the same measures for streaming data - as online algorithms

### Javascript

* [science.js](https://github.com/jasondavies/science.js)
* [atoll.js](https://github.com/nsfmc/atoll.js)
* [descriptive_statistics](https://github.com/thirtysixthspan/descriptive_statistics)
* [jStat](http://www.jstat.org/)
* [classifier](https://github.com/harthur/classifier) is a naive bayesian classifier (though specialized for the words-spam case)
* [underscore.math](https://github.com/syntagmatic/underscore.math/blob/master/underscore.math.js)

### Python

* [Pandas](http://pandas.pydata.org/)
* [SciPy](http://www.scipy.org/)

### Their Own Language

* [Julia Language](http://julialang.org/)
* [R language](http://www.r-project.org/)
