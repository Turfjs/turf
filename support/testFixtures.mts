import assert from "node:assert";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TestContext } from "node:test";

const VALID_TYPES: ReadonlySet<string> = new Set([
  "Feature",
  "FeatureCollection",
  "GeometryCollection",
  "Point",
  "LineString",
  "Polygon",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
]);

export async function testFixtures(t: TestContext, fn: (input: any) => any) {
  const dirs = {
    in: path.join(process.cwd(), "test", "in"),
    out: path.join(process.cwd(), "test", "out"),
  };

  for (const file of await readdir(dirs.in)) {
    await t.test(file, async () => {
      const inputPath = path.join(dirs.in, file);
      const inputData = JSON.parse(await readFile(inputPath, "utf-8"));
      const result = fn(inputData);

      let outputPath = path.join(dirs.out, file);
      // if we don't have geojson output, we should use .json instead
      if (
        result == null ||
        typeof result != "object" ||
        !VALID_TYPES.has(result.type)
      ) {
        outputPath = outputPath.replace(/\.geojson$/, ".json");
      }

      if (process.env.REGEN) {
        await writeFile(outputPath, JSON.stringify(result, null, 2));
      } else {
        const expected = JSON.parse(await readFile(outputPath, "utf-8"));
        assert.deepStrictEqual(result, expected);
      }
    });
  }
}
