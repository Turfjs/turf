JSTS Topology Suite
===================

The JSTS Topology Suite is a JavaScript library of spatial predicates and functions 
for processing geometry conforming to the Simple Features Specification for SQL published by
the Open Geospatial Consortium. JSTS Topology Suite is also a JavaScript port of the well 
established Java library [JTS Topology Suite](http://tsusiatsoftware.net/jts/main.html) with
a built in parser for OpenLayers geometries.

[SWECO Position AB](http://en.sweco.se/en/enswecose/Expertise-/Geographical-IT) (my current employer) has gratiously 
provided sponsoring for this project.

The primary goal of the project is to provide OpenLayers applications with a complete library for processing
and analysing simple geometries, but as of version 0.11.0 hard dependencies to OpenLayers was removed
which makes it possible to use JSTS Topology Suite as a free standing geometry library.

A [Google group](http://groups.google.com/group/jsts-devs) is available for developer discussions.

[Unit tests](http://bjornharrtell.github.com/jsts/test/SpecRunner.html) are made
using the [Jasmine testing framework](https://github.com/pivotal/jasmine). A 
[port](http://bjornharrtell.github.com/jsts/validationsuite/index.html) of
[JTS Validation Suite](http://www.vividsolutions.com/jts/tests/index.html) provides
additional tests.

A recent trunk snapshot of [API docs is available](http://bjornharrtell.github.com/jsts/doc/api/index.html). Also
available are simple example use of [buffer](http://bjornharrtell.github.com/jsts/examples/buffer.html), 
[overlay](http://bjornharrtell.github.com/jsts/examples/overlay.html) and [triangulation](http://bjornharrtell.github.com/jsts/examples/triangulation.html)
operations. The examples uses a build of [attache-array-js](http://github.com/olooney/attache-array-js) to meet JavaScript ES5 requirements in some browsers.

The code tries to be conformant to the
[Google JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) and
[JSLint](http://www.jslint.com/) and is licensed with the LGPL 2.1 license.

Development environment
-----------------------

* Eclipse 3.6 (Helios) using custom builders to check and enforce the Google JavaScript Style Guide and JSLint
* Custom builders requirements:
  * Installed Closure Linter from http://code.google.com/closure/utilities
  * Compiled 'shell' sample from V8 JavaScript Engine (http://code.google.com/apis/v8) in /tools
  * External JavaScript jslint.js and json2.js from https://github.com/douglascrockford in /tools
* Assumes OpenLayers 2.12 distribution in project root from http://www.openlayers.org/
* Assumes OS Ubuntu/Linux

Design changes
--------------

These are effective/potential changes from the original JTS Topology Suite:

* Skip abstracted CoordinateSequence interface/implementation

JSTS in use
-----------

* [Viper](https://github.com/bjornharrtell/viper) - a game that uses quadtree index and the robust line intersection algorithm.
