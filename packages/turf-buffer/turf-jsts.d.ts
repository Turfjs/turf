declare namespace jsts {
  export type JSTSGeometry = unknown & { __brand: JSTSGeometry };

  export class GeoJSONReader {
    /** @argument projected any GeoJSON */
    read(projected: any): JSTSGeometry;
  }

  export class GeoJSONWriter {
    /** @returns any GeoJSON */
    write(buffered: JSTSGeometry): any;
  }

  export class BufferOp {
    /** @returns a Polygon JSTSGeometry */
    static bufferOp(
      geom: JSTSGeometry,
      distance: number,
      steps: number
    ): JSTSGeometry;
  }
}

declare module "@turf/jsts" {
  export = jsts;
}
