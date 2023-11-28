// Copied from @types/javascript-astar@0.0.34
/*
MIT License

Copyright (c) Microsoft Corporation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
*/

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
