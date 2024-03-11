// Get around problems with moduleResolution node16 and some older libraries.
// Manifests as "This expression is not callable ... has no call signatures"
// https://stackoverflow.com/a/74709714

import lib from "rbush";

export const rbush = lib as unknown as typeof lib.default;
