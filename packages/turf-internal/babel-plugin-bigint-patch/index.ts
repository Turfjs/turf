import { PluginObj } from "@babel/core";

export default function replaceNumberWithJSBIToNumber(): PluginObj {
  return {
    name: "replace-number-with-jsbi-toNumber",
    visitor: {
      CallExpression(path) {
        if (!path.get("callee").isIdentifier({ name: "Number" })) return;

        const arg = path.get("arguments")[0];
        if (!arg) return;

        let shouldReplace = false;

        // Number(InternalClipper.MaxInt64 / 4n);
        // to
        // JSBI.toNumber(JSBI.divide(InternalClipper.MaxInt64, JSBI.BigInt("4")));
        if (
          arg.isBinaryExpression({ operator: "/" }) &&
          arg.get("left").isMemberExpression() &&
          arg.get("left.object").isIdentifier({ name: "InternalClipper" }) &&
          arg.get("left.property").isIdentifier({ name: "MaxInt64" }) &&
          arg.get("right").isBigIntLiteral()
        ) {
          shouldReplace = true;
        }

        // InternalClipper.Invalid64 = Number(InternalClipper.MaxInt64);
        // to
        // InternalClipper.Invalid64 = JSBI.toNumber(InternalClipper.MaxInt64);
        if (
          arg.isMemberExpression() &&
          arg.get("object").isIdentifier({ name: "InternalClipper" }) &&
          arg.get("property").isIdentifier({ name: "MaxInt64" })
        ) {
          shouldReplace = true;
        }

        if (!shouldReplace) return;

        path.get("callee").replaceWithSourceString("JSBI.toNumber");
      },
    },
  };
}
