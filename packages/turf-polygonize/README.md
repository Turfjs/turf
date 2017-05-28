# @turf/polygonize

# index

Implementation of GEOSPolygonize function (`geos::operation::polygonize::Polygonizer`).

Polygonizes a set of lines that represents edges in a planar graph. Edges must be correctly
noded, i.e., they must only meet at their endpoints. LineStrings must only have two coordinate
points.

The implementation correctly handles:

-   Dangles: edges which have one or both ends which are not incident on another edge endpoint.
-   Cut Edges (bridges): edges that are connected at both ends but which do not form part
      of a polygon.

**Parameters**

-   `geoJson` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** Lines in order to polygonize

Returns **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Polygons created

# Graph

Represents a planar graph of edges and nodes that can be used to compute a
polygonization.

Although, this class is inspired by GEOS's `geos::operation::polygonize::PolygonizeGraph`,
it isn't a rewrite. As regards algorithm, this class implements the same logic, but it
isn't a javascript transcription of the C++ source.

This graph is directed (both directions are created)

## getNode

Creates or get a Node.

**Parameters**

-   `coordinates` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Coordinates of the node

Returns **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** The created or stored node

## addEdge

Adds an Edge and its symetricall.
Edges are added symetrically, i.e.: we also add its symetric

**Parameters**

-   `from` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Node which starts the Edge
-   `to` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Node which ends the Edge

## deleteDangles

Removes Dangle Nodes (nodes with grade 1).

## \_removeIfDangle

Check if node is dangle, if so, remove it.
It calls itself recursively, removing a dangling node might cause another dangling node

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Node to check if it's a dangle

## deleteCutEdges

Delete cut-edges (bridge edges).

The graph will be traversed, all the edges will be labeled according the ring
in which they are. (The label is a number incremented by 1). Edges with the same
label are cut-edges.

## \_computeNextCWEdges

Set the `next` property of each Edge.
The graph will be transversed in a CW form, so, we set the next of the symetrical edge as the previous one.
OuterEdges are sorted CCW.

**Parameters**

-   `node` **\[[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)]** If no node is passed, the function calls itself for every node in the Graph

## \_computeNextCCWEdges

Computes the next edge pointers going CCW around the given node, for the given edgering label.
This algorithm has the effect of converting maximal edgerings into minimal edgerings

XXX: method literally transcribed from `geos::operation::polygonize::PolygonizeGraph::computeNextCCWEdges`,
could be written in a more javascript way.

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Node
-   `label` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Ring's label

## \_findLabeledEdgeRings

Finds rings and labels edges according to which rings are.
The label is a number which is increased for each ring.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Edge](#edge)>** edges that start rings

## getEdgeRings

Computes the EdgeRings formed by the edges in this graph.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[EdgeRing](#edgering)>** A list of all the EdgeRings in the graph.

## \_findIntersectionNodes

Find all nodes in a Maxima EdgeRing which are self-intersection nodes.

**Parameters**

-   `startEdge` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Start Edge of the Ring

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)>** intersection nodes

## \_findEdgeRing

Get the edge-ring which starts from the provided Edge.

**Parameters**

-   `startEdge` **[Edge](#edge)** starting edge of the edge ring

Returns **[EdgeRing](#edgering)** EdgeRing which start Edge is the provided one.

## removeNode

Removes a node from the Graph.

It also removes edges asociated to that node

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** Node to be removed

## removeEdge

Remove edge from the graph and deletes the edge.

**Parameters**

-   `edge` **[Edge](#edge)** Edge to be removed

## fromGeoJson

Creates a graph from a GeoJSON.

**Parameters**

-   `geoJson` **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** it must comply with the restrictions detailed in the index

Returns **[Graph](#graph)** The newly created graph

# addOuterEdge

Outer edges are stored CCW order.
XXX: on each add we are ordering, this could be optimized

**Parameters**

-   `edge` **[Edge](#edge)** Edge to add as an outerEdge.

# Edge

This class is inspired by GEOS's geos::operation::polygonize::PolygonizeDirectedEdge

## getSymetric

Creates or get the symetric Edge.

Returns **[Edge](#edge)** Symetric Edge.

## constructor

**Parameters**

-   `from` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** start node of the Edge
-   `to` **[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling)** end node of the edge

## deleteEdge

Removes edge from from and to nodes.

## isEqual

Compares Edge equallity.
An edge is equal to another, if the from and to nodes are the same.

**Parameters**

-   `edge` **[Edge](#edge)** Another Edge

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if Edges are equal, False otherwise

## toLineString

Returns a LineString representation of the Edge

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[LineString](http://geojson.org/geojson-spec.html#linestring)>** LineString representation of the Edge

## compareTo

Comparator of two edges.
Implementation of geos::planargraph::DirectedEdge::compareTo.

**Parameters**

-   `edge` **[Edge](#edge)** Another edge to compare with this one

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** \-1 if this Edge has a greater angle with the positive x-axis than b,
                   0 if the Edges are colinear,
                   1 otherwise

# EdgeRing

**Extends Array**

Ring of edges which form a polygon.
The ring may be either an outer shell or a hole.

This class is inspired in GEOS's geos::operation::polygonize::EdgeRing

## isValid

Check if the ring is valid in geomtry terms.
A ring must have either 0 or 4 or more points. The first and the last must be
equal (in 2D)
geos::geom::LinearRing::validateConstruction

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Validity of the EdgeRing

## isHole

Tests whether this ring is a hole.
A ring is a hole if it is oriented counter-clockwise.
Similar implementation of geos::algorithm::CGAlgorithms::isCCW

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true: if it is a hole

## toMultiPoint

Creates a MultiPoint representing the EdgeRing (discarts edges directions).

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[MultiPoint](http://geojson.org/geojson-spec.html#multipoint)>** Multipoint representation of the EdgeRing

## toPolygon

Creates a Polygon representing the EdgeRing.
XXX: the polygon could be cached

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Polygon representation of the Edge Ring

## getEnvelope

Calculates the envelope of the EdgeRing.
XXX: the envelope could be cached

Returns **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** envelope

## inside

Checks if the point is inside the edgeRing

**Parameters**

-   `point` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>** Point to check if it is inside the edgeRing

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if it is inside, False otherwise

## findEdgeRingContaining

`geos::operation::polygonize::EdgeRing::findEdgeRingContaining`

**Parameters**

-   `testEdgeRing` **[EdgeRing](#edgering)** EdgeRing to look in the list
-   `shellList` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[EdgeRing](#edgering)>** List of EdgeRing in which to search

Returns **[EdgeRing](#edgering)** EdgeRing which contains the testEdgeRing

# orientationIndex

Returns the direction of the point q relative to the vector p1 -> p2.
Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
(same as geos::algorithm::CGAlgorithm::computeOrientation())

**Parameters**

-   `p1` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** the origin point of the vector
-   `p2` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** the final point of the vector
-   `q` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** the point to compute the direction to

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 1 if q is ccw (left) from p1->p2,
       \-1 if q is cw (right) from p1->p2,
        0 if q is colinear with p1->p2

# envelopeIsEqual

Checks if two envelopes are equal.
The function assumes that the arguments are envelopes, i.e.: Rectangular polygon

**Parameters**

-   `env1` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Envelope
-   `env2` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Envelope

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if the envelopes are equal

# envelopeContains

Check if a envelope is contained in other one.
The function assumes that the arguments are envelopes, i.e.: Convex polygon
XXX: Envelopes are rectangular, checking if a point is inside a rectangule is something easy,
this could be further improved.

**Parameters**

-   `self` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Envelope
-   `env` **[Feature](http://geojson.org/geojson-spec.html#feature-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** Envelope

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if env is contained in self

# coordinatesEqual

Checks if two coordinates are equal.

**Parameters**

-   `coord1` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** First coordinate
-   `coord2` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Second coordinate

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True if coordinates are equal

<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source file (likely index.js), and re-run
./scripts/generate-readmes in the turf project. -->

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install @turf/polygonize
```

Or install the Turf module that includes it as a function:

```sh
$ npm install @turf/turf
```
