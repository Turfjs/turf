declare module 'cdt2d';
export default function cdt2d(points: number[][], edges: number[][],
                              option: {delaunay?: boolean, interior? : boolean, exterior?: boolean, infinity? :boolean}): number[][];