import CGAlgorithms from "../../algorithm/CGAlgorithms";
import TopologyException from "../../geom/TopologyException";
import MaximalEdgeRing from "./MaximalEdgeRing";
import Assert from "../../util/Assert";
import PlanarGraph from "../../geomgraph/PlanarGraph";

export default class PolygonBuilder {
  constructor() {
    this._shellList = [];
  }
  _sortShellsAndHoles(edgeRings, shellList, freeHoleList) {
    edgeRings.forEach((er) =>
      er.isHole() ? freeHoleList.push(er) : shellList.push(er)
    );
  }
  _computePolygons() {
    const resultPolyList = [];
    this._shellList.forEach((er) => {
      const poly = er.toPolygon();
      resultPolyList.push(poly);
    });
    return resultPolyList;
  }
  _placeFreeHoles(shellList, freeHoleList) {
    freeHoleList.forEach((hole) => {
      if (hole.getShell() === null) {
        const shell = this._findEdgeRingContaining(hole, shellList);
        if (shell === null)
          throw new TopologyException(
            "unable to assign hole to a shell",
            hole.getCoordinate(0)
          );
        hole.setShell(shell);
      }
    });
  }
  _buildMinimalEdgeRings(maxEdgeRings, shellList, freeHoleList) {
    const edgeRings = [];
    maxEdgeRings.forEach((er) => {
      if (er.getMaxNodeDegree() > 2) {
        er.linkDirectedEdgesForMinimalEdgeRings();
        const minEdgeRings = er.buildMinimalRings();
        const shell = this._findShell(minEdgeRings);
        if (shell !== null) {
          this._placePolygonHoles(shell, minEdgeRings);
          shellList.push(shell);
        } else {
          freeHoleList.push(...minEdgeRings);
        }
      } else {
        edgeRings.push(er);
      }
    });
    return edgeRings;
  }
  _buildMaximalEdgeRings(dirEdges) {
    const maxEdgeRings = [];
    dirEdges.forEach((de) => {
      if (de.isInResult() && de.getLabel().isArea()) {
        if (de.getEdgeRing() === null) {
          const er = new MaximalEdgeRing(de);
          maxEdgeRings.push(er);
          er.setInResult();
        }
      }
    });
    return maxEdgeRings;
  }
  _placePolygonHoles(shell, minEdgeRings) {
    minEdgeRings.forEach((er) => {
      if (er.isHole()) {
        er.setShell(shell);
      }
    });
  }
  getPolygons() {
    return this._computePolygons();
  }
  _findEdgeRingContaining(testEr, shellList) {
    const testRing = testEr.getLinearRing();
    const testEnv = testRing.getEnvelopeInternal();
    const testPt = testRing.getCoordinateN(0);
    let minShell = null;
    let minEnv = null;
    shellList.forEach((tryShell) => {
      const tryRing = tryShell.getLinearRing();
      const tryEnv = tryRing.getEnvelopeInternal();
      if (minShell !== null)
        minEnv = minShell.getLinearRing().getEnvelopeInternal();
      let isContained = false;
      if (
        tryEnv.contains(testEnv) &&
        CGAlgorithms.isPointInRing(testPt, tryRing.getCoordinates())
      )
        isContained = true;
      if (isContained) {
        if (minShell === null || minEnv.contains(tryEnv)) {
          minShell = tryShell;
        }
      }
    });
    return minShell;
  }
  _findShell(minEdgeRings) {
    let shellCount = 0;
    let shell = null;
    minEdgeRings.forEach((er) => {
      if (!er.isHole()) {
        shell = er;
        shellCount++;
      }
    });
    Assert.isTrue(shellCount <= 1, "found two shells in MinimalEdgeRing list");
    return shell;
  }
  add(dirEdges, nodes) {
    PlanarGraph.linkResultDirectedEdges(nodes);
    const maxEdgeRings = this._buildMaximalEdgeRings(dirEdges);
    const freeHoleList = [];
    const edgeRings = this._buildMinimalEdgeRings(
      maxEdgeRings,
      this._shellList,
      freeHoleList
    );
    this._sortShellsAndHoles(edgeRings, this._shellList, freeHoleList);
    this._placeFreeHoles(this._shellList, freeHoleList);
  }
}
