import Location from "../geom/Location";
import CGAlgorithms from "../algorithm/CGAlgorithms";
import Position from "./Position";
import TopologyException from "../geom/TopologyException";
import Label from "./Label";
import Assert from "../util/Assert";
import LinearRing from "../geom/LinearRing";

export default class EdgeRing {
  constructor(start) {
    this._startDe = null;
    this._maxNodeDegree = -1;
    this._pts = [];
    this._label = new Label(Location.NONE);
    this._ring = null;
    this._isHole = null;
    this._shell = null;
    this._holes = [];
    this.computePoints(start);
    this.computeRing();
  }
  computeRing() {
    if (this._ring !== null) return null;
    this._ring = new LinearRing(this._pts);
    this._isHole = CGAlgorithms.isCCW(this._ring.getCoordinates());
  }
  computePoints(start) {
    this._startDe = start;
    let de = start;
    let isFirstEdge = true;
    do {
      if (de === null) throw new TopologyException("Found null DirectedEdge");
      if (de.getEdgeRing() === this)
        throw new TopologyException(
          "Directed Edge visited twice during ring-building at " +
            de.getCoordinate()
        );
      const label = de.getLabel();
      Assert.isTrue(label.isArea());
      this.mergeLabel(label);
      this.addPoints(de.getEdge(), de.isForward(), isFirstEdge);
      isFirstEdge = false;
      this.setEdgeRing(de, this);
      de = this.getNext(de);
    } while (de !== this._startDe);
  }
  getLinearRing() {
    return this._ring;
  }
  getCoordinate(i) {
    return this._pts[i];
  }
  computeMaxNodeDegree() {
    this._maxNodeDegree = 0;
    let de = this._startDe;
    do {
      const node = de.getNode();
      const degree = node.getEdges().getOutgoingDegree(this);
      if (degree > this._maxNodeDegree) this._maxNodeDegree = degree;
      de = this.getNext(de);
    } while (de !== this._startDe);
    this._maxNodeDegree *= 2;
  }
  addPoints(edge, isForward, isFirstEdge) {
    const edgePts = edge.getCoordinates();
    if (isForward) {
      let startIndex = 1;
      if (isFirstEdge) startIndex = 0;
      for (let i = startIndex; i < edgePts.length; i++) {
        this._pts.push(edgePts[i]);
      }
    } else {
      let startIndex = edgePts.length - 2;
      if (isFirstEdge) startIndex = edgePts.length - 1;
      for (let i = startIndex; i >= 0; i--) {
        this._pts.push(edgePts[i]);
      }
    }
  }
  isHole() {
    return this._isHole;
  }
  setInResult() {
    let de = this._startDe;
    do {
      de.getEdge().setInResult(true);
      de = de.getNext();
    } while (de !== this._startDe);
  }
  addHole(ring) {
    this._holes.push(ring);
  }
  isShell() {
    return this._shell === null;
  }
  getLabel() {
    return this._label;
  }
  getMaxNodeDegree() {
    if (this._maxNodeDegree < 0) this.computeMaxNodeDegree();
    return this._maxNodeDegree;
  }
  getShell() {
    return this._shell;
  }
  mergeLabel() {
    if (arguments.length === 1) {
      const deLabel = arguments[0];
      this.mergeLabel(deLabel, 0);
      this.mergeLabel(deLabel, 1);
    } else if (arguments.length === 2) {
      const deLabel = arguments[0];
      const geomIndex = arguments[1];
      const loc = deLabel.getLocation(geomIndex, Position.RIGHT);
      if (loc === Location.NONE) return null;
      if (this._label.getLocation(geomIndex) === Location.NONE) {
        this._label.setLocation(geomIndex, loc);
        return null;
      }
    }
  }
  setShell(shell) {
    this._shell = shell;
    if (shell !== null) shell.addHole(this);
  }
  toPolygon() {
    return {
      type: "Polygon",
      coordinates: [this, ...this._holes].map((p) =>
        p.getLinearRing().getCoordinates()
      ),
    };
  }
}
