"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./database"));
const path_1 = __importDefault(require("path"));
const shortUrl_controller_1 = require("./controller/shortUrl.controller");
const luxon_1 = require("luxon");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.default.get("corsOrigin"),
}));
const port = config_1.default.get("port");
// parse application/json
app.use(body_parser_1.default.json());
// Serve the index.html file
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Run the function initially to remove any existing expired URLs
(0, shortUrl_controller_1.removeExpiredUrls)();
// Schedule the function to run every day at a specific time (e.g., midnight)
const scheduledTime = luxon_1.DateTime.local()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .plus({ days: 1 });
const timeUntilScheduled = scheduledTime.diffNow().as("milliseconds");
setTimeout(() => {
    // Run the function periodically every day at the specified time
    setInterval(shortUrl_controller_1.removeExpiredUrls, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}, timeUntilScheduled);
app.listen(port, "0.0.0.0", () => {
    console.log(`Application listening at http://localhost:${port}`);
    (0, database_1.default)();
    (0, routes_1.default)(app);
});
exports.default = app;
//# sourceMappingURL=app.js.map