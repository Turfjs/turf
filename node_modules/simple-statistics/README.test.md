[![Build Status](https://secure.travis-ci.org/tmcw/simple-statistics.png?branch=master)](http://travis-ci.org/tmcw/simple-statistics)

A JavaScript implementation of descriptive, regression, and inference statistics.

Implemented in literate JavaScript with no dependencies, designed to work
in all modern browsers (including IE) as well as in node.js.

# [API](API.md)

[Full documentation](API.md)

---
```

 Basic Array Operations
    .mixin()
    .mean(x)
    .sum(x)
    .variance(x)
    .standard_deviation(x)
    .median_absolute_deviation(x)
    .median(x)
    .geometric_mean(x)
    .harmonic_mean(x)
    .min(x)
    .max(x)
    .t_test(sample, x)
    .t_test_two_sample(sample_x, sample_y, difference)
    .sample_variance(x)
    .sample_covariance(x)
    .sample_correlation(x)
    .quantile(sample, p)
    .iqr(sample)
    .sample_skewness(sample)
    .jenks(data, number_of_classes)
    .r_squared(data, function)
    .cumulative_std_normal_probability(z)
    .z_score(x, mean, standard_deviation)
    .standard_normal_table
  Regression
    .linear_regression()
      .data([[1, 1], [2, 2]])
      .line()
      .m()
      .b()
  Classification
    .bayesian()
    .train(item, category)
    .score(item)
```

---

# [Literate Source](http://macwright.org/simple-statistics/)

## Usage

To use it in browsers, grab [simple_statistics.js](https://raw.github.com/tmcw/simple-statistics/master/src/simple_statistics.js).
To use it in node, install it with [npm](https://npmjs.org/) or add it to your package.json.

    npm install simple-statistics

To use it with [component](https://github.com/component/component),

    component install tmcw/simple-statistics

To use it with [bower](http://bower.io/),

    bower install simple-statistics

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

### Bayesian Classifier

```javascript
var bayes = ss.bayesian();
bayes.train({ species: 'Cat' }, 'animal');
bayes.score({ species: 'Cat' });
// { animal: 1 }
```

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

## Examples

* [Linear regression with simple-statistics and d3js](http://bl.ocks.org/3931800)
* [Jenks Natural Breaks with a choropleth map with d3js](http://bl.ocks.org/tmcw/4969184)

# Contributors

* Tom MacWright
* [Matt Sacks](https://github.com/mattsacks)
* Doron Linder
* [Alexander Sicular](https://github.com/siculars)
