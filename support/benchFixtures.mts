import path from "path";
import { readdir, readFile } from "node:fs/promises";
import Benchmark from "benchmark";

export async function benchFixtures(pkgName: string, fn: (input: any) => void) {
  const suite = new Benchmark.Suite(pkgName);
  const fixturesPath = path.join(process.cwd(), "test", "in");
  for (const file of await readdir(fixturesPath)) {
    const inputPath = path.join(fixturesPath, file);
    const inputData = JSON.parse(await readFile(inputPath, "utf-8"));
    suite.add(file, () => fn(inputData));
  }

  suite.on("cycle", (e: any) => console.log(String(e.target))).run();
}
