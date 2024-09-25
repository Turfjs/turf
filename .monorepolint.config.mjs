// @ts-check
import {
  alphabeticalDependencies,
  alphabeticalScripts,
  fileContents,
  packageOrder,
  packageEntry,
  packageScript,
  requireDependency,
} from "@monorepolint/rules";

const MAIN_PACKAGE = "@turf/turf";

export default {
  rules: [
    fileContents({
      options: {
        file: "tsconfig.json",
        template: `{
  "extends": "../../tsconfig.shared.json"
}
`,
      },
      excludePackages: ["@turf/isobands", "@turf/isolines", "@turf/tesselate"],
    }),

    // Special treatment for three packages with locally defined .d.ts files for
    // untyped Javascript dependencies. Might be possible to remove should those
    // libraries be retired / types added to DefinitelyTyped.
    fileContents({
      options: {
        file: "tsconfig.json",
        template: `{
  "extends": "../../tsconfig.shared.json",
  "files": ["index.ts", "marchingsquares.d.ts"]
}
`,
      },
      includePackages: ["@turf/isobands", "@turf/isolines"],
    }),
    fileContents({
      options: {
        file: "tsconfig.json",
        template: `{
  "extends": "../../tsconfig.shared.json",
  "files": ["index.ts", "earcut.d.ts"]
}
`,
      },
      includePackages: ["@turf/tesselate"],
    }),

    packageOrder({
      options: {
        order: [
          "name",
          "version",
          "private",
          "description",
          "author",
          "contributors",
          "license",
          "bugs",
          "homepage",
          "repository",
          "funding",
          "publishConfig",
          "keywords",
          "type",
          "main",
          "module",
          "types",
          "exports",
          "browser",
          "sideEffects",
          "files",
          "scripts",
          "husky",
          "lint-staged",
          "packageManager",
          "devDependencies",
          "dependencies",
        ],
      },
      includeWorkspaceRoot: true,
    }),
    alphabeticalDependencies({ includeWorkspaceRoot: true }),
    alphabeticalScripts({ includeWorkspaceRoot: true }),

    // All packages ...
    packageEntry({
      options: {
        entries: {
          type: "module",
          main: "dist/cjs/index.cjs",
          module: "dist/esm/index.js",
          types: "dist/esm/index.d.ts",
          sideEffects: false,
          funding: "https://opencollective.com/turf",
          publishConfig: {
            access: "public",
          },
          exports: {
            "./package.json": "./package.json",
            ".": {
              import: {
                types: "./dist/esm/index.d.ts",
                default: "./dist/esm/index.js",
              },
              require: {
                types: "./dist/cjs/index.d.cts",
                default: "./dist/cjs/index.cjs",
              },
            },
          },
        },
      },
    }),
    // All except @turf/turf
    packageEntry({
      options: {
        entries: {
          files: ["dist"],
        },
      },
      excludePackages: [MAIN_PACKAGE],
    }),
    // @turf/turf only
    packageEntry({
      options: {
        entries: {
          // @turf/turf is commonly consumed through CDNs, moving this output file is a breaking change for anyone
          // who has a hardcoded reference to this specific file, instead of letting the CDN pick the path.
          // Example of a URL that will break: https://unpkg.com/@turf/turf/dist/turf.min.js
          // Example of a URL that will keep working: https://unpkg.com/@turf/turf
          browser: "turf.min.js",
          files: ["dist", "turf.min.js"],
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          docs: "tsx ../../scripts/generate-readmes.ts",
          test: "npm-run-all --npm-path npm test:*",
          "test:tape": "tsx test.ts",
          "test:types": "tsc --noEmit",
        },
      },
      excludePackages: [MAIN_PACKAGE],
    }),

    packageScript({
      options: {
        scripts: {
          build: "tsup --config ../../tsup.config.ts",
        },
      },
    }),

    requireDependency({
      options: {
        dependencies: {
          "@types/geojson": "^7946.0.10",
          tslib: "^2.6.2",
        },
        devDependencies: {
          "@types/benchmark": "^2.1.5",
          "@types/tape": "^4.2.32",
          benchmark: "^2.1.4",
          "npm-run-all": "^4.1.5",
          tape: "^5.7.2",
          tsx: "^4.6.2",
          typescript: "^5.5.4",
        },
      },
    }),

    requireDependency({
      options: {
        devDependencies: {
          rollup: "^2.79.1",
        },
      },
      includePackages: [MAIN_PACKAGE],
    }),
  ],
};
