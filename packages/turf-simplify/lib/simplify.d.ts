// Copied from https://github.com/mourner/simplify-js/blob/master/index.d.ts
interface Point {
  x: number;
  y: number;
}

declare function simplify<T extends Point>(
  points: T[],
  tolerance?: number,
  highQuality?: boolean
): T[];
declare namespace simplify {}

export = simplify;
