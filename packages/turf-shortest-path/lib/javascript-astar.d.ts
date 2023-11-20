// Copied from @types/javascript-astar@0.0.34
// Added "export" to each top level element so it would appear as a TS module.
export declare class Graph {
  grid: Array<Array<GridNode>>;
  constructor(
    grid: Array<Array<number>>,
    options?: { diagonal?: boolean | undefined }
  );
}

export declare class GridNode {
  x: number;
  y: number;
}

export interface Heuristic {
  (pos0: { x: number; y: number }, pos1: { x: number; y: number }): number;
}

export interface Heuristics {
  manhattan: Heuristic;
  diagonal: Heuristic;
}

export declare namespace astar {
  function search(
    graph: Graph,
    start: { x: number; y: number },
    end: { x: number; y: number },
    options?: {
      closest?: boolean | undefined;
      heuristic?: Heuristic | undefined;
    }
  ): Array<GridNode>;
  var heuristics: Heuristics;
}
