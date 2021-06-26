import { coordinates } from "../../../../utils/coordinates";
import Octant from "./Octant";
import SegmentNode from "./SegmentNode";
import RuntimeException from "../../../../java/lang/RuntimeException";
import Assert from "../util/Assert";
import TreeMap from "../../../../java/util/TreeMap";

export default class NodedSegmentString {
  constructor(pts, data) {
    this._nodeList = new SegmentNodeList(this);
    this._pts = pts;
    this._data = data;
  }
  getCoordinates() {
    return this._pts;
  }
  size() {
    return this._pts.length;
  }
  getCoordinate(i) {
    return this._pts[i];
  }
  isClosed() {
    return coordinates.equals(this._pts[0], this._pts[this._pts.length - 1]);
  }
  getSegmentOctant(index) {
    if (index === this._pts.length - 1) return -1;
    return this.safeOctant(
      this.getCoordinate(index),
      this.getCoordinate(index + 1)
    );
  }
  setData(data) {
    this._data = data;
  }
  safeOctant(p0, p1) {
    if (coordinates.equals(p0, p1)) return 0;
    return Octant.octant(p0, p1);
  }
  getData() {
    return this._data;
  }
  addIntersection(intPt, segmentIndex) {
    if (arguments.length === 4) {
      let li, intIndex;
      [li, segmentIndex, , intIndex] = arguments;
      intPt = li.getIntersection(intIndex);
    }
    this.addIntersectionNode(intPt, segmentIndex);
  }
  getNodeList() {
    return this._nodeList;
  }
  addIntersectionNode(intPt, segmentIndex) {
    var normalizedSegmentIndex = segmentIndex;
    var nextSegIndex = normalizedSegmentIndex + 1;
    if (nextSegIndex < this._pts.length) {
      var nextPt = this._pts[nextSegIndex];
      if (coordinates.equals(intPt, nextPt)) {
        normalizedSegmentIndex = nextSegIndex;
      }
    }
    var ei = this._nodeList.add(intPt, normalizedSegmentIndex);
    return ei;
  }
  addIntersections(li, segmentIndex, geomIndex) {
    for (var i = 0; i < li.getIntersectionNum(); i++) {
      this.addIntersection(li, segmentIndex, geomIndex, i);
    }
  }
  static getNodedSubstrings(segStrings) {
    var resultEdgelist = [];
    segStrings.forEach((segStr) =>
      segStr.getNodeList().addSplitEdges(resultEdgelist)
    );
    return resultEdgelist;
  }
}

class SegmentNodeList {
  constructor(edge) {
    this._nodeMap = new TreeMap();
    this._edge = edge;
  }
  addCollapsedNodes() {
    const collapsedVertexIndexes = [];
    this.findCollapsesFromInsertedNodes(collapsedVertexIndexes);
    this.findCollapsesFromExistingVertices(collapsedVertexIndexes);
    collapsedVertexIndexes.forEach((vertexIndex) => {
      this.add(this._edge.getCoordinate(vertexIndex), vertexIndex);
    });
  }
  findCollapsesFromExistingVertices(collapsedVertexIndexes) {
    for (let i = 0; i < this._edge.size() - 2; i++) {
      const p0 = this._edge.getCoordinate(i);
      // const p1 = this._edge.getCoordinate(i + 1)
      const p2 = this._edge.getCoordinate(i + 2);
      if (coordinates.equals(p0, p2)) {
        collapsedVertexIndexes.push(i + 1);
      }
    }
  }
  addSplitEdges(edgeList) {
    this.addEndpoints();
    this.addCollapsedNodes();
    const nodes = this._nodeMap.values();
    let eiPrev = nodes.shift();
    while (nodes.length) {
      const ei = nodes.shift();
      const newEdge = this.createSplitEdge(eiPrev, ei);
      edgeList.push(newEdge);
      eiPrev = ei;
    }
  }
  findCollapseIndex(ei0, ei1, collapsedVertexIndex) {
    if (!coordinates.equals(ei0.coord, ei1.coord)) return false;
    let numVerticesBetween = ei1.segmentIndex - ei0.segmentIndex;
    if (!ei1.isInterior()) {
      numVerticesBetween--;
    }
    if (numVerticesBetween === 1) {
      collapsedVertexIndex[0] = ei0.segmentIndex + 1;
      return true;
    }
    return false;
  }
  findCollapsesFromInsertedNodes(collapsedVertexIndexes) {
    const collapsedVertexIndex = new Array(1).fill(null);
    const nodes = this._nodeMap.values();
    let eiPrev = nodes.shift();
    while (nodes.length) {
      const ei = nodes.shift();
      const isCollapsed = this.findCollapseIndex(
        eiPrev,
        ei,
        collapsedVertexIndex
      );
      if (isCollapsed) collapsedVertexIndexes.push(collapsedVertexIndex[0]);
      eiPrev = ei;
    }
  }
  getEdge() {
    return this._edge;
  }
  addEndpoints() {
    const maxSegIndex = this._edge.size() - 1;
    this.add(this._edge.getCoordinate(0), 0);
    this.add(this._edge.getCoordinate(maxSegIndex), maxSegIndex);
  }
  createSplitEdge(ei0, ei1) {
    let npts = ei1.segmentIndex - ei0.segmentIndex + 2;
    const lastSegStartPt = this._edge.getCoordinate(ei1.segmentIndex);
    const useIntPt1 =
      ei1.isInterior() || !coordinates.equals(ei1.coord, lastSegStartPt);
    if (!useIntPt1) {
      npts--;
    }
    const pts = new Array(npts).fill(null);
    let ipt = 0;
    pts[ipt++] = [...ei0.coord];
    for (let i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
      pts[ipt++] = this._edge.getCoordinate(i);
    }
    if (useIntPt1) pts[ipt] = [...ei1.coord];
    return new NodedSegmentString(pts, this._edge.getData());
  }
  add(intPt, segmentIndex) {
    const eiNew = new SegmentNode(
      this._edge,
      intPt,
      segmentIndex,
      this._edge.getSegmentOctant(segmentIndex)
    );
    const ei = this._nodeMap.get(eiNew);
    if (ei !== null) {
      Assert.isTrue(
        coordinates.equals(ei.coord, intPt),
        "Found equal nodes with different coordinates"
      );
      return ei;
    }
    this._nodeMap.put(eiNew, eiNew);
    return eiNew;
  }
  checkSplitEdgesCorrectness(splitEdges) {
    const edgePts = this._edge.getCoordinates();
    const split0 = splitEdges.get(0);
    const pt0 = split0.getCoordinate(0);
    if (!coordinates.equals(pt0, edgePts[0]))
      throw new RuntimeException("bad split edge start point at " + pt0);
    const splitn = splitEdges.get(splitEdges.size() - 1);
    const splitnPts = splitn.getCoordinates();
    const ptn = splitnPts[splitnPts.length - 1];
    if (!coordinates.equals(ptn, edgePts[edgePts.length - 1]))
      throw new RuntimeException("bad split edge end point at " + ptn);
  }
}
