# Consumer test harnesses

Each directory is an example configuration that we may expect a Turf consumer to depend on. It allows us to test various configurations in CI and avoid shipping breaking changes unintentionally across a variety of different user groups.

Note that the CI runs include a matrix of Node versions, so each of these scenarios is tested across those as well.

The TypeScript settings were inspired by the [Choosing Compiler Options](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html) documentation on the recommended configurations in May 2026.
