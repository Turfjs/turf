const test = require('tape'),
  Graph = require('./Graph'),
  Node = require('./Node'),
  { featureCollection, lineString } = require('@turf/helpers');

test('Graph :: fromGeoJson', t => {
  const geoJson = featureCollection([
    lineString([[0, 1], [0, 0]]),
    lineString([[1, 1], [0, 0]]),
    lineString([[1, 0], [0, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson);

  t.equal(Object.keys(graph.nodes).length, 4, 'The graph has to have the correct number of nodes');

  // Edges are symetric
  t.equal(graph.edges.length, 6, 'The graph has to have the correct number of edges');

  t.end();
});

test('Graph :: deleteDangles', t => {
  const geoJson = featureCollection([
    lineString([[0, 0], [0, 1]]),
    lineString([[0, 1], [0, 2]]),
    lineString([[0, 1], [1, 1]]),
    lineString([[1, 1], [1, 0]]),
    lineString([[1, 0], [0, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson);

  graph.deleteDangles();

  t.equal(Object.keys(graph.nodes).length, 4);

  t.notOk(graph.nodes[Node.buildId([0,2])], "Dangle node has to be removed");

  t.end();
});

test('Graph :: deleteCutEdges', t => {
  const geoJson = featureCollection([
    lineString([[0, 0], [0, 1]]),
    lineString([[0, 1], [1, 1]]),
    lineString([[0, 0], [1, 1]]),
    lineString([[1, 1], [2, 1]]),
    lineString([[2, 1], [3, 1]]),
    lineString([[3, 1], [3, 0]]),
    lineString([[2, 1], [3, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson);

  graph.deleteCutEdges();

  t.equal(Object.keys(graph.nodes).length, 6);
  t.equal(graph.edges.length, 12);

  t.notOk(graph.edges.find(e => e.to.id == Node.buildId([1, 1]) && e.from.id == Node.buildId([2, 1])));
  t.notOk(graph.edges.find(e => e.to.id == Node.buildId([2, 1]) && e.from.id == Node.buildId([1, 1])));

  t.end();
});

test('Graph :: getEdgeRings', t => {
  const geoJson = featureCollection([
    lineString([[0, 0], [0, 1]]),
    lineString([[0, 1], [1, 1]]),
    lineString([[0, 0], [1, 1]]),
    lineString([[1, 1], [2, 1]]),
    lineString([[2, 1], [3, 1]]),
    lineString([[3, 1], [3, 0]]),
    lineString([[2, 1], [3, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson);

  graph.deleteCutEdges();
  const edgeRings = graph.getEdgeRings();

  t.equal(edgeRings.length, 4);

  edgeRings.forEach(edgeRing => {
    t.equal(edgeRing.length, 3);
  });

  t.end();
});
