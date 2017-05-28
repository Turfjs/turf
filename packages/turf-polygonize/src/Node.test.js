const test = require('tape'),
    Node = require('./Node'),
    Edge = require('./Edge');

test('Node.outerEdges CCW order', t => {
    const center = new Node([0, 0]),
        addNode = c => new Edge(center, new Node(c));

    addNode([0, 1]);
    addNode([1, 1]);
    addNode([1, 0]);
    addNode([1, -1]);
    addNode([0, -1]);
    addNode([-1, -1]);
    addNode([-1, 0]);
    addNode([-1, 1]);

    t.deepEqual(
        center.outerEdges.map(e => e.to.coordinates),
        [[-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1]],
        'Outernodes have to be in CCW order'
    );

    t.end();
});
