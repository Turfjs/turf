import Location from "../../geom/Location";
import BufferSubgraph from "./BufferSubgraph";
import PolygonBuilder from "../overlay/PolygonBuilder";
import Position from "../../geomgraph/Position";
import MCIndexNoder from "../../noding/MCIndexNoder";
import SubgraphDepthLocater from "./SubgraphDepthLocater";
import OffsetCurveSetBuilder from "./OffsetCurveSetBuilder";
import Label from "../../geomgraph/Label";
import EdgeList from "../../geomgraph/EdgeList";
import RobustLineIntersector from "../../algorithm/RobustLineIntersector";
import IntersectionAdder from "../../noding/IntersectionAdder";
import Edge from "../../geomgraph/Edge";
import PlanarGraph from "../../geomgraph/PlanarGraph";
import { coordinates } from "../../../../../utils/coordinates";

export default class BufferBuilder {
  constructor(quadrantSegments) {
    this._workingNoder = null;
    this._edgeList = new EdgeList();
    this._quadrantSegments = quadrantSegments || null;
  }
  insertUniqueEdge(edge) {
    const existingEdge = this._edgeList.findEqualEdge(edge);
    if (existingEdge !== null) {
      const existingLabel = existingEdge.getLabel();
      let labelToMerge = edge.getLabel();
      if (!existingEdge.isPointwiseEqual(edge)) {
        labelToMerge = new Label(edge.getLabel());
        labelToMerge.flip();
      }
      existingLabel.merge(labelToMerge);
      const mergeDelta = BufferBuilder.depthDelta(labelToMerge);
      const existingDelta = existingEdge.getDepthDelta();
      const newDelta = existingDelta + mergeDelta;
      existingEdge.setDepthDelta(newDelta);
    } else {
      this._edgeList.add(edge);
      edge.setDepthDelta(BufferBuilder.depthDelta(edge.getLabel()));
    }
  }
  buildSubgraphs(subgraphList, polyBuilder) {
    const processedGraphs = [];
    subgraphList.forEach((subgraph) => {
      const p = subgraph.getRightmostCoordinate();
      const locater = new SubgraphDepthLocater(processedGraphs);
      const outsideDepth = locater.getDepth(p);
      subgraph.computeDepth(outsideDepth);
      subgraph.findResultEdges();
      processedGraphs.push(subgraph);
      polyBuilder.add(subgraph.getDirectedEdges(), subgraph.getNodes());
    });
  }
  createSubgraphs(graph) {
    const subgraphList = [];
    graph.getNodes().forEach((node) => {
      if (!node.isVisited()) {
        const subgraph = new BufferSubgraph();
        subgraph.create(node);
        subgraphList.push(subgraph);
      }
    });
    subgraphList.sort((a, b) => b.compareTo(a));
    return subgraphList;
  }
  createEmptyResultGeometry() {
    return { type: "Polygon", coordinates: [] };
  }
  getNoder() {
    if (this._workingNoder !== null) return this._workingNoder;
    const li = new RobustLineIntersector();
    return new MCIndexNoder(new IntersectionAdder(li));
  }
  buffer(g, distance) {
    const curveSetBuilder = new OffsetCurveSetBuilder(
      g,
      distance,
      this._quadrantSegments
    );
    const bufferSegStrList = curveSetBuilder.getCurves();
    if (bufferSegStrList.length <= 0) {
      return this.createEmptyResultGeometry();
    }
    this.computeNodedEdges(bufferSegStrList);
    const graph = new PlanarGraph();
    graph.addEdges(this._edgeList.getEdges());
    const subgraphList = this.createSubgraphs(graph);
    const polyBuilder = new PolygonBuilder();
    this.buildSubgraphs(subgraphList, polyBuilder);
    const resultPolyList = polyBuilder.getPolygons();
    if (resultPolyList.length <= 0) {
      return this.createEmptyResultGeometry();
    }
    if (resultPolyList.length === 1) {
      return resultPolyList[0];
    }
    const coordinates = resultPolyList.map((polygon) => polygon.coordinates);
    const multiPolygon = { type: "MultiPolygon", coordinates };
    return multiPolygon;
  }
  computeNodedEdges(bufferSegStrList) {
    const noder = this.getNoder();
    noder.computeNodes(bufferSegStrList);
    const nodedSegStrings = noder.getNodedSubstrings();
    nodedSegStrings.forEach((segStr) => {
      const pts = segStr.getCoordinates();
      if (pts.length === 2 && coordinates.equals(pts[0], pts[1])) return;
      const oldLabel = segStr.getData();
      const edge = new Edge(segStr.getCoordinates(), new Label(oldLabel));
      this.insertUniqueEdge(edge);
    });
  }
  static depthDelta(label) {
    const lLoc = label.getLocation(0, Position.LEFT);
    const rLoc = label.getLocation(0, Position.RIGHT);
    if (lLoc === Location.INTERIOR && rLoc === Location.EXTERIOR) return 1;
    else if (lLoc === Location.EXTERIOR && rLoc === Location.INTERIOR)
      return -1;
    return 0;
  }
}
