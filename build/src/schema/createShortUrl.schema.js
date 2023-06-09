"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
exports.default = (0, yup_1.object)({
    body: (0, yup_1.object)({
        destination: (0, yup_1.string)()
            .url("Must be a valid URL")
            .required("Destination is required"),
        slug: (0, yup_1.string)()
            .trim()
            .matches(/^[a-zA-Z0-9_-]*$/, 'Invalid slug format'),
    }),
});
//# sourceMappingURL=createShortUrl.schema.js.map