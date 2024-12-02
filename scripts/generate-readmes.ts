#!/usr/bin/env node

const fs = require("fs-extra");
const { glob } = require("glob");
const path = require("path");
const { loadJsonFileSync } = require("load-json-file");
const yaml = require("yamljs");
const { ast, query } = require("@phenomnomnominal/tsquery");

(async () => {
  // documentation v14 has moved to ESM so need to import as if async, and wrap
  // in an IIFE as top level async not allowed.
  const documentation = await import("documentation");

  /**
   * When firing `npm run docs`:
   *   - inside a module, only the docs of that module will be generated
   *   - outside or at the root level it will generate docs for all modules
   */
  const currentFolder = process.cwd().split(path.sep).pop() as string;
  const packages = currentFolder.includes("packages/turf-")
    ? [path.join(process.cwd(), "package.json")]
    : glob.sync(
        path.join(__dirname, "..", "packages", "turf-*", "package.json")
      );

  // Template for README Markdown
  const postfix = fs.readFileSync(path.join(__dirname, "postfix.md"), "utf8");

  const paths = yaml.parse(
    fs.readFileSync(path.join(__dirname, "..", "documentation.yml"), "utf8")
  ).paths;

  packages.forEach((packagePath) => {
    const directory = path.parse(packagePath).dir;
    let indexPath = path.join(directory, "index.js");
    const pckg = loadJsonFileSync(packagePath);
    const name = pckg.name;
    const diagrams = glob
      .sync(path.join(directory, "diagrams", "*"))
      .filter(isImage);

    // some of the packages are typescript instead
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(directory, "index.ts");
    }

    // Build Documentation
    documentation
      .build(indexPath, { shallow: true })
      .then((res) => {
        if (res === undefined) return console.warn(packagePath);
        console.log("Building Docs: " + name);

        // Format Markdown
        documentation.formats
          .md(res, { paths })
          .then((markdown) => {
            markdown = `# ${name}\n\n${markdown}${postfix.replace(
              /{module}/,
              name
            )}`;

            if (packagePath.includes("turf-helpers")) {
              const helpersTs = fs.readFileSync(indexPath, "utf8").toString();
              const theAst = ast(helpersTs);

              // To learn how to write tsquery selectors, see: https://tsquery-playground.firebaseapp.com/ and paste the code from turf-helpers/index.ts

              // query Units string literal names
              // ToDo: malformed selector.  In addition to Units, it includes StringLiterals from AreaUnits as well (hectares, acres, degrees, radians)
              const unitLiterals = query(
                theAst,
                'TypeAliasDeclaration:has(Identifier[name="Units"]) UnionType LiteralType StringLiteral'
              );
              const unitArray = unitLiterals.map((sLiteral) =>
                sLiteral.getText().replaceAll('"', "")
              );
              const unitNames =
                unitLiterals.length > 0 ? "Units: " + unitArray.join(", ") : "";
              console.log(unitNames);

              // query all AreaUnits string literals (including exclusions)
              const areaUnitAllLiterals = query(
                theAst,
                'TypeAliasDeclaration:has(Identifier[name="AreaUnits"]) UnionType > LiteralType StringLiteral'
              );
              const areaUnitAllArray = areaUnitAllLiterals.map((sLiteral) =>
                sLiteral.getText().replaceAll('"', "")
              );
              console.log("areaUnitAllArray", areaUnitAllArray);

              // query AreaUnits string literals to Exclude
              const areaUnitExcludeLiterals = query(
                theAst,
                'TypeAliasDeclaration:has(Identifier[name="AreaUnits"]) UnionType TypeReference LiteralType StringLiteral'
              );
              const areaUnitExcludeArray = areaUnitExcludeLiterals.map(
                (sLiteral) => sLiteral.getText().replaceAll('"', "")
              );
              console.log("areaUnitExcludeArray", areaUnitExcludeArray);

              // AreaUnits to add = all AreaUnits - Exclude AreaUnits
              const newAreaUnitArray = areaUnitAllArray.filter(
                (name) => !areaUnitExcludeArray.includes(name)
              );
              // console.log("newAreaUnitArray", newAreaUnitArray)

              // Subtract Exclude AreaUnits from all AreaUnits and add new ones
              const areaUnitArray = unitArray
                .filter((name) => !areaUnitExcludeArray.includes(name))
                .concat(newAreaUnitArray);
              // console.log("areaUnitArray", areaUnitArray)
              const areaUnitNames =
                areaUnitArray.length > 0
                  ? "Area Units: " + areaUnitArray.join(", ")
                  : "";
              console.log("areaUnitNames", areaUnitNames);

              // extract area unit names.  unit names - exclusions + inclusions

              const insertText = "## helpers\n";
              markdown = markdown.replace(
                insertText,
                `${insertText}\n### units\n\n${unitNames}\n`
              );
            }

            if (diagrams.length)
              markdown += "\n\n### Diagrams\n\n" + diagramToMarkdown(diagrams);
            fs.writeFileSync(path.join(directory, "README.md"), markdown);
          })
          .catch((error) => console.warn(error));
      })
      .catch((error) => console.warn(error));
  });
})();

function isImage(image) {
  return [".gif", ".jpg", ".png"].indexOf(path.parse(image).ext) !== -1;
}

function diagramToMarkdown(diagrams) {
  return diagrams
    .map((image) => {
      const { name, base } = path.parse(image);
      return `![${name}](diagrams/${base})`;
    })
    .join("\n");
}
