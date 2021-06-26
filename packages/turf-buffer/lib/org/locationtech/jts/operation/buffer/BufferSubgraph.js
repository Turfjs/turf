import Position from "../../geomgraph/Position";
import RightmostEdgeFinder from "./RightmostEdgeFinder";
import TopologyException from "../../geom/TopologyException";
import Envelope from "../../geom/Envelope";
import { x } from "../../../../../utils/coordinates";

export default class BufferSubgraph {
  constructor() {
    this._dirEdgeList = [];
    this._nodes = [];
    this._rightMostCoord = null;
    this._env = null;
    this._finder = new RightmostEdgeFinder();
  }
  clearVisitedEdges() {
    this._dirEdgeList.forEach((de) => de.setVisited(false));
  }
  getRightmostCoordinate() {
    return this._rightMostCoord;
  }
  computeNodeDepth(node) {
    const startEdge = node
      .getEdges()
      .getEdges()
      .find((de) => de.isVisited() || de.getSym().isVisited());
    if (startEdge === undefined)
      throw new TopologyException(
        "unable to find edge to compute depths at " + node.getCoordinate()
      );
    node.getEdges().computeDepths(startEdge);
    node
      .getEdges()
      .getEdges()
      .forEach((de) => {
        de.setVisited(true);
        this.copySymDepths(de);
      });
  }
  computeDepth(outsideDepth) {
    this.clearVisitedEdges();
    const de = this._finder.getEdge();
    // const n = de.getNode()
    // const label = de.getLabel()
    de.setEdgeDepths(Position.RIGHT, outsideDepth);
    this.copySymDepths(de);
    this.computeDepths(de);
  }
  create(node) {
    this.addReachable(node);
    this._finder.findEdge(this._dirEdgeList);
    this._rightMostCoord = this._finder.getCoordinate();
  }
  findResultEdges() {
    this._dirEdgeList.forEach((de) => {
      if (
        de.getDepth(Position.RIGHT) >= 1 &&
        de.getDepth(Position.LEFT) <= 0 &&
        !de.isInteriorAreaEdge()
      ) {
        de.setInResult(true);
      }
    });
  }
  computeDepths(startEdge) {
    const nodesVisited = new Set();
    const nodeQueue = [];
    const startNode = startEdge.getNode();
    nodeQueue.push(startNode);
    nodesVisited.add(startNode);
    startEdge.setVisited(true);
    while (nodeQueue.length) {
      const node = nodeQueue.shift();
      nodesVisited.add(node);
      this.computeNodeDepth(node);
      node
        .getEdges()
        .getEdges()
        .forEach((de) => {
          const sym = de.getSym();
          if (sym.isVisited()) return;
          const adjNode = sym.getNode();
          if (!nodesVisited.has(adjNode)) {
            nodeQueue.push(adjNode);
            nodesVisited.add(adjNode);
          }
        });
    }
  }
  compareTo(o) {
    const graph = o;
    if (x(this._rightMostCoord) < x(graph._rightMostCoord)) {
      return -1;
    }
    if (x(this._rightMostCoord) > x(graph._rightMostCoord)) {
      return 1;
    }
    return 0;
  }
  getEnvelope() {
    if (this._env === null) {
      const edgeEnv = new Envelope();
      this._dirEdgeList.forEach((dirEdge) => {
        const pts = dirEdge.getEdge().getCoordinates();
        for (let i = 0; i < pts.length - 1; i++) {
          edgeEnv.expandToInclude(pts[i]);
        }
      });
      this._env = edgeEnv;
    }
    return this._env;
  }
  addReachable(startNode) {
    const nodeStack = [];
    nodeStack.push(startNode);
    while (nodeStack.length) {
      const node = nodeStack.pop();
      this.add(node, nodeStack);
    }
  }
  copySymDepths(de) {
    const sym = de.getSym();
    sym.setDepth(Position.LEFT, de.getDepth(Position.RIGHT));
    sym.setDepth(Position.RIGHT, de.getDepth(Position.LEFT));
  }
  add(node, nodeStack) {
    node.setVisited(true);
    this._nodes.push(node);
    node
      .getEdges()
      .getEdges()
      .forEach((de) => {
        this._dirEdgeList.push(de);
        const sym = de.getSym();
        const symNode = sym.getNode();
        if (!symNode.isVisited()) nodeStack.push(symNode);
      });
  }
  getNodes() {
    return this._nodes;
  }
  getDirectedEdges() {
    return this._dirEdgeList;
  }
}
