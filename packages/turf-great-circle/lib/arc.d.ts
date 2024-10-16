export class GreatCircle {
  constructor(
    start: { x: number; y: number },
    end: { x: number; y: number },
    properties?: any
  );
  Arc(npoints: number, options: { offset: number }): { json: () => any };
}
