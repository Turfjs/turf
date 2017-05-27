const test = require('tape'),
  EdgeRing = require('./EdgeRing'),
  Edge = require('./Edge'),
  Node = require('./Node');

test('EdgeRing.isHole', t => {
  let edgeRing = new EdgeRing();
  edgeRing.push(new Edge(new Node([0, 0]), new Node([1, 0])));
  edgeRing.push(new Edge(edgeRing[0].to, new Node([0, 1])));
  edgeRing.push(new Edge(edgeRing[1].to, edgeRing[0].from));

  t.ok(edgeRing.isHole(), 'A EdgeRing with elements in CCW order has to be a Hole');

  edgeRing = new EdgeRing();
  edgeRing.push(new Edge(new Node([0, 0]), new Node([0, 1])));
  edgeRing.push(new Edge(edgeRing[0].to, new Node([1, 0])));
  edgeRing.push(new Edge(edgeRing[1].to, edgeRing[0].from));

  t.notOk(edgeRing.isHole(), 'A EdgeRing with elements in CW order does not have to be a Hole');

  t.end();
});
