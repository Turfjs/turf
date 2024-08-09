declare module "earcut" {
  declare function earcut(
    vertices: number[],
    holes: number[],
    dimensions: number
  );

  export default earcut;
}
