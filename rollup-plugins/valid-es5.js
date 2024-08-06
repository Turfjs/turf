export default function validES5() {
  return {
    name: "valid-es5",
    renderChunk(code) {
      removeComments(code)
        .match(/[\w\=\>]+/g) // eslint-disable-line
        .forEach((word) => {
          switch (word) {
            case "const":
            case "let":
            case "=>":
              throw new Error(word + " is not valid ES5 syntax");
          }
        });
      return code;
    },
  };
}

function removeComments(code) {
  // Remove comments block comments
  code = code.replace(/\/\*\*[\w\s*\.@{}|<>,=()[\];\/\-'`":]+\*\//g, ""); // eslint-disable-line
  // Remove inline comments
  code = code.replace(/\/\/.+\n/g, "\n");
  return code;
}
