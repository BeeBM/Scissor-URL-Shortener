"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortUrl_controller_1 = require("../controller/shortUrl.controller");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const createShortUrl_schema_1 = __importDefault(require("../schema/createShortUrl.schema"));
function routes(app) {
    app.get("/healthcheck", (req, res) => {
        return res.send("App is healthy");
    });
    app.post("/scissor/url", (0, validateResource_1.default)(createShortUrl_schema_1.default), shortUrl_controller_1.createShortUrl);
    app.get("/:shortId", shortUrl_controller_1.handleRedirect);
    app.get("/scissor/analytics", shortUrl_controller_1.getAnalytics);
}
exports.default = routes;
//# sourceMappingURL=index.js.map