Basic contracts of functions:

* Functions do not modify their arguments e.g. change their order
* Invalid input, like empty lists to functions that need 1+ items to work, will cause functions to return `null`.

# Basic Array Operations

### .mixin()

_Optionally_ mix in the following functions into the `Array` prototype. Otherwise
you can use them off of the simple-statistics object itself.

### .mean(x)

Mean of a single-dimensional Array of numbers. _Also available as `.average(x)`_

### .sum(x)

Sum of a single-dimensional Array of numbers.

### .variance(x)

[Variance](http://en.wikipedia.org/wiki/Variance) of a single-dimensional Array of numbers.

### .standard_deviation(x)

[Standard Deviation](http://en.wikipedia.org/wiki/Standard_deviation) of a single-dimensional Array of numbers.

### .median_absolute_deviation(x)

The Median Absolute Deviation (MAD) is a robust measure of statistical
dispersion. It is more resilient to outliers than the standard deviation.
Accepts a single-dimensional array of numbers and returns a dispersion value.

Also aliased to `.mad(x)` for brevity.

### .median(x)

[Median](http://en.wikipedia.org/wiki/Median) of a single-dimensional array of numbers.

### .geometric_mean(x)

[Geometric mean](http://en.wikipedia.org/wiki/Geometric_mean) of a single-dimensional array of **positive** numbers.

### .harmonic_mean(x)

[Harmonic mean](http://en.wikipedia.org/wiki/Harmonic_mean) of a single-dimensional array of **positive** numbers.

### .min(x)

Finds the minimum of a single-dimensional array of numbers. This runs in linear `O(n)` time.

### .max(x)

Finds the maximum of a single-dimensional array of numbers. This runs in linear `O(n)` time.

### .t_test(sample, x)

Does a [student's t-test](http://en.wikipedia.org/wiki/Student's_t-test) of a dataset `sample`, represented by a single-dimensional array of numbers. `x` is the known value, and the result is a measure of [statistical significance](http://en.wikipedia.org/wiki/Statistical_significance).

### .t_test_two_sample(sample_x, sample_y, difference)

The two-sample t-test is used to compare samples from two populations or groups,
confirming or denying the suspicion (null hypothesis) that the populations are
the same. It returns a t-value that you can then look up to give certain
judgements of confidence based on a t distribution table.

This implementation expects the samples `sample_x` and `sample_y` to be given
as one-dimensional arrays of more than one number each.

### .sample_variance(x)

Produces [sample variance](http://mathworld.wolfram.com/SampleVariance.html)
of a single-dimensional array of numbers.

### .sample_covariance(x)

Produces [sample covariance](http://en.wikipedia.org/wiki/Sample_mean_and_sample_covariance)
of two single-dimensional arrays of numbers.

### .sample_correlation(x)

Produces [sample correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence)
of two single-dimensional arrays of numbers.

### .quantile(sample, p)

Does a [quantile](http://en.wikipedia.org/wiki/Quantile) of a dataset `sample`,
at p. For those familiary with the `k/q` syntax, `p == k/q`. `sample` must
be a single-dimensional array of numbers. p must be a number greater than or equal to
than zero and less or equal to than one, or an array of numbers following that rule.
If an array is given, an array of results will be returned instead of a single
number.

### .quantile_sorted(sample, p)

Does a [quantile](http://en.wikipedia.org/wiki/Quantile) of a dataset `sample`,
at p. `sample` must be a one-dimensional _sorted_ array of numbers, and
`p` must be a single number from zero to one.

### .iqr(sample)

Calculates the [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range) of
a sample - the difference between the upper and lower quartiles. Useful
as a measure of dispersion.

_Also available as `.interquartile_range(x)`_

### .sample_skewness(sample)

Calculates the [skewness](http://en.wikipedia.org/wiki/Skewness) of
a sample, a measure of the extent to which a probability distribution of a
real-valued random variable "leans" to one side of the mean.
The skewness value can be positive or negative, or even undefined.

This implementation uses the [Fisher-Pearson standardized moment coefficient](http://en.wikipedia.org/wiki/Skewness#Pearson.27s_skewness_coefficients),
which means that it behaves the same as Excel, Minitab, SAS, and SPSS.

Skewness is only valid for samples of over three values.

### .jenks(data, number_of_classes)

Find the [Jenks Natural Breaks](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization) for
a single-dimensional array of numbers as input and a desired `number_of_classes`.
The result is a single-dimensional with class breaks, including the minimum
and maximum of the input array.

### .r_squared(data, function)

Find the [r-squared](http://en.wikipedia.org/wiki/Coefficient_of_determination) value of a particular dataset, expressed as a two-dimensional `Array` of numbers, against a `Function`.

    var r_squared = ss.r_squared([[1, 1]], function(x) { return x * 2; });

### .cumulative_std_normal_probability(z)

Look up the given `z` value in a [standard normal table](http://en.wikipedia.org/wiki/Standard_normal_table)
to calculate the probability of a random variable appearing with a given value.

### .z_score(x, mean, standard_deviation)

The standard score is the number of standard deviations an observation
or datum is above or below the mean.

### .standard_normal_table

A [standard normal table](http://en.wikipedia.org/wiki/Standard_normal_table) from
which to pull values of Φ (phi).

## Regression

### .linear_regression()

Create a new linear regression solver.

#### .data([[1, 1], [2, 2]])

Set the data of a linear regression. The input is a two-dimensional array of numbers, which are treated as coordinates, like `[[x, y], [x1, y1]]`.

#### .line()

Get the linear regression line: this returns a function that you can
give `x` values and it will return `y` values. Internally, this uses the `m()`
and `b()` values and the classic `y = mx + b` equation.

    var linear_regression_line = ss.linear_regression()
        .data([[0, 1], [2, 2], [3, 3]]).line();
    linear_regression_line(5);

#### .m()

Just get the slope of the fitted regression line, the `m` component of the full
line equation. Returns a number.

#### .b()

Just get the y-intercept of the fitted regression line, the `b` component
of the line equation. Returns a number.

## Classification

### .bayesian()

Create a naïve bayesian classifier.

### .train(item, category)

Train the classifier to classify a certain item, given as an object with keys,
to be in a certain category, given as a string.

### .score(item)

Get the classifications of a certain item, given as an object of
`category -> score` mappings.

    var bayes = ss.bayesian();
    bayes.train({ species: 'Cat' }, 'animal');
    bayes.score({ species: 'Cat' });
    // { animal: 1 }
