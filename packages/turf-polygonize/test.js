const test = require('tape'),
  { Graph, Node, Edge, EdgeRing } = require('./util'),
  { featureCollection, lineString, polygon } = require('@turf/helpers'),
  polygonize = require('./index.js');

test('graph.fromGeoJson', t => {
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

test('node.outerEdges CCW order', t => {
  const geoJson = featureCollection([
    lineString([[0, 1], [0, 0]]),
    lineString([[1, 1], [0, 0]]),
    lineString([[1, 0], [0, 0]]),
    lineString([[1, -1], [0, 0]]),
    lineString([[0, -1], [0, 0]]),
    lineString([[-1, -1], [0, 0]]),
    lineString([[-1, 0], [0, 0]]),
    lineString([[-1, 1], [0, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson),
    node = graph.getNode([0, 0]);

  t.deepEqual(
    node.outerEdges.map(e => e.to.coordinates),
    [[-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1]],
    'Outernodes have to ve in CCW order'
  );

  t.end();
});

test('deleteDangles', t => {
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

test('deleteCutEdges', t => {
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

test('getEdgeRings', t => {
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

test('EdgeRing.isHole', t => {
  function getNextEdge(edge) {
    return edge.to.outerEdges.find(e => !e.isEqual(edge.symetric));
  }
  const geoJson = featureCollection([
    lineString([[0, 0], [0, 1]]),
    lineString([[0, 1], [1, 0]]),
    lineString([[1, 0], [0, 0]]),
  ]),
    graph = Graph.fromGeoJson(geoJson);

  let edgeRing = new EdgeRing();
  edgeRing.push(graph.edges.find(e => e.from.id == Node.buildId([0,0]) && e.to.id == Node.buildId([1,0])));
  edgeRing.push(getNextEdge(edgeRing[0]));
  edgeRing.push(getNextEdge(edgeRing[1]));

  t.ok(edgeRing.isHole(), 'A EdgeRing with elements in CCW order has to be a Hole');

  edgeRing = new EdgeRing();
  edgeRing.push(graph.edges.find(e => e.from.id == Node.buildId([0,0]) && e.to.id == Node.buildId([0,1])));
  edgeRing.push(getNextEdge(edgeRing[0]));
  edgeRing.push(getNextEdge(edgeRing[1]));

  t.notOk(edgeRing.isHole(), 'A EdgeRing with elements in CW order does not have to be a Hole');

  t.end();
});

test('Polygonize', t => {
  const geoJson = featureCollection([
    lineString([[-58.3959417, -34.8036499], [-58.395087, -34.8031464]]),
    lineString([[-58.3964727, -34.8029764], [-58.3959417, -34.8036499]]),
    lineString([[-58.395087, -34.8031464], [-58.3942164, -34.8042266]]),
    lineString([[-58.3942164, -34.8042266], [-58.3949969, -34.8047067]]),
    lineString([[-58.3949969, -34.8047067], [-58.3957427, -34.8051655]]),
    lineString([[-58.396618, -34.8040484], [-58.3957427, -34.8051655]]),
    lineString([[-58.3976747, -34.8036356], [-58.3971168, -34.8043422]]),
    lineString([[-58.3976747, -34.8036356], [-58.3964727, -34.8029764]]),
    lineString([[-58.3971168, -34.8043422], [-58.396618, -34.8040484]]),
    lineString([[-58.396618, -34.8040484], [-58.3959417, -34.8036499]]),
  ]),
    expected = featureCollection([
      polygon([[[-58.3959417,-34.8036499],[-58.395087,-34.8031464],[-58.3942164,-34.8042266],[-58.3949969,-34.8047067],[-58.3957427,-34.8051655],[-58.396618,-34.8040484],[-58.3959417,-34.8036499]]]),
      polygon([[[-58.3964727,-34.8029764],[-58.3959417,-34.8036499],[-58.396618,-34.8040484],[-58.3971168,-34.8043422],[-58.3976747,-34.8036356],[-58.3964727,-34.8029764]]]),
    ]),
    polygons = polygonize(geoJson);

  t.deepEqual(polygons, expected);

  t.end();
});
