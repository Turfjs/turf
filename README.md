![turf](https://raw.githubusercontent.com/Turfjs/turf/9a1d5e8d99564d4080f1e2bf1517ed41d18012fa/logo.png)
======
[![GitHub Actions Status](https://github.com/Turfjs/turf/actions/workflows/ci.yml/badge.svg)](https://github.com/Turfjs/turf/actions/workflows/ci.yml/badge.svg)
[![Version Badge][npm-img]][npm-url]
[![Gitter chat][gitter-img]][gitter-url]
[![Backers on Open Collective][oc-backer-badge]](#backers)
[![Sponsors on Open Collective][oc-sponsor-badge]](#sponsors) [![Coverage Status](https://coveralls.io/repos/github/Turfjs/turf/badge.svg)](https://coveralls.io/github/Turfjs/turf)

[npm-img]: https://img.shields.io/npm/v/@turf/turf.svg
[npm-url]: https://www.npmjs.com/package/@turf/turf
[gitter-img]: https://badges.gitter.im/Turfjs/turf.svg
[gitter-url]: https://gitter.im/Turfjs/turf
[oc-backer-badge]: https://opencollective.com/turf/backers/badge.svg
[oc-sponsor-badge]: https://opencollective.com/turf/sponsors/badge.svg

***A modular geospatial engine written in JavaScript***

[Turf](https://turfjs.org) is a [JavaScript library](https://en.wikipedia.org/wiki/JavaScript_library) for [spatial analysis](https://en.wikipedia.org/wiki/Spatial_analysis). It includes traditional spatial operations, helper functions for creating [GeoJSON](https://geojson.org) data, and data classification and statistics tools. Turf can be added to your website as a client-side module, or you can [run Turf server-side](https://www.npmjs.com/package/@turf/turf) with [Node.js](https://nodejs.org/) (see below).


## Getting Started

Read our [getting started guide](https://turfjs.org/docs/getting-started) to begin working with Turf.

Or explore the Turf API and examples at [turfjs.org](https://turfjs.org/).

## Runtime support

Turf is currently published to work with any reasonably modern JavaScript runtime.

Node is a first class citizen, and we recommend using an [Active or Maintenance LTS](https://nodejs.org/en/about/previous-releases) release.

Other runtimes, such as Deno or Bun, are not officially supported. We would be very interested to hear your experiences though.

## Precision

Although we make a reasonable effort for precision in our implementations, we are ultimately limited by the fact that we are handling GeoJSON data.
For lots of consumer devices, GPS accuracy is within a few meters of the actual point. When using latitude and longitude, 6 digits after the decimal
works out to an [error around 10cm](https://datatracker.ietf.org/doc/html/rfc7946#section-11.2). Although libraries exist to provide arbitrary
precision math, we try to use JavaScript's built in types for performance reasons.

Although it is possible to specify GeoJSON positions with more than 6 digits of precision, Turf cannot guarantee correctness at these scales.
Certain operations may run into issues when the distances involved are very small, at the limit of what our Number type can represent.

We may close bugs that cannot be reproduced after the GeoJSON has been run through @turf/truncate to 6 digits.

We may return results with additional precision to avoid having to perform truncation, but that
[should not be interpreted](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.10) as the level of real precision in the result.

If you have stricter precision needs or aren't using latitude/longitude, you may want to use Turf as a reference for your own implementation,
carefully controlling the projection and library call steps.

## Browser support

@turf/turf includes a `browser` target which can be useful to load from a CDN. This uses Babel to transpile to a JavaScript version usable by most modern browsers.
This will include any browser that matches the `default` criteria as defined by [Browserslist](https://browsersl.ist/#q=defaults).
We may roll forward and drop support for older browsers within a given major release, please pin an exact version if you need to preserve specific browser compatibility.

## NPM package syntax

All of the individual @turf/* packages are written in TypeScript and are compiled to target ESNext. That means that we may use new syntax features without changing the major version.
If you have specific browser support requirements please apply Babel, SWC, or another tool in your own bundling step in order to control the amount of supporting code.

Some of the packages are implemented using other NPM libraries, which may also need to be transformed.

Note: Our ability to adopt the latest syntax will still be restricted by the supported Node versions for a given major version of Turf.

## Contributors

This project exists thanks to all the people who contribute. If you are interested in helping, check out the [Contributing Guide](docs/CONTRIBUTING.md).

<a href="https://github.com/Turfjs/turf/graphs/contributors"><img src="https://opencollective.com/turf/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/turf#backer)]

<a href="https://opencollective.com/turf#backers" target="_blank"><img src="https://opencollective.com/turf/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/turf#sponsor)]

<a href="https://opencollective.com/turf/sponsor/0/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/1/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/2/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/3/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/4/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/5/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/6/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/7/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/8/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/turf/sponsor/9/website" target="_blank"><img src="https://opencollective.com/turf/sponsor/9/avatar.svg"></a>
