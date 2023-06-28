"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExpiredUrls = exports.getAnalytics = exports.handleRedirect = exports.createShortUrl = void 0;
const shortUrl_model_1 = __importDefault(require("../models/shortUrl.model"));
const analytics_model_1 = __importDefault(require("../models/analytics.model"));
const nanoid_1 = require("nanoid");
const luxon_1 = require("luxon");
function createShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the destination and custom slug from the request body
        const { destination, slug } = req.body;
        if (!destination) {
            return res.status(400).json({ error: 'Destination URL is required' });
        }
        // Check if the custom slug is provided
        let shortId;
        if (slug) {
            // Check if the custom slug is already taken
            const existingUrl = yield shortUrl_model_1.default.findOne({ shortId: slug }).lean();
            if (existingUrl) {
                return res.status(400).json({ error: 'Custom slug is already taken' });
            }
            shortId = slug;
        }
        else {
            // Generate a random shortId if no custom slug is provided
            shortId = (0, nanoid_1.customAlphabet)('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)();
        }
        // Create a shortUrl
        const newUrl = yield shortUrl_model_1.default.create({ shortId, destination });
        // Build the full shortened URL
        const fullShortUrl = `${req.protocol}://${req.get('host')}/${newUrl.shortId}`;
        return res.json({ shortUrl: fullShortUrl });
    });
}
exports.createShortUrl = createShortUrl;
// Handle the redirect to the destination URL based on the provided shortId
function handleRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { shortId } = req.params;
        // Find the corresponding short URL in the database
        const short = yield shortUrl_model_1.default.findOne({ shortId }).lean();
        // If the short URL is not found, return a 404 status
        if (!short) {
            return res.sendStatus(404);
        }
        // Create an analytics entry for tracking the visit to the short URL
        analytics_model_1.default.create({ shortUrl: short._id });
        // Redirect the user to the destination URL
        return res.redirect(short.destination);
    });
}
exports.handleRedirect = handleRedirect;
// Retrieve the analytics data for all short URL visits
function getAnalytics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { shortId } = req.params;
        // Retrieve all analytics data from the database
        const data = yield analytics_model_1.default.find({ shortId }).lean();
        // If the analytics data is not found, return a 404 status
        if (!data) {
            return res.sendStatus(404);
        }
        // Send the analytics data as a response
        return res.send(data);
    });
}
exports.getAnalytics = getAnalytics;
// Delete urls from the database after 3 months
function removeExpiredUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the current date and time
        const currentDate = luxon_1.DateTime.now().toJSDate();
        // Calculate the date three months ago
        const expirationDate = luxon_1.DateTime.fromJSDate(currentDate).minus({ months: 3 }).toJSDate();
        // Remove expired URLs from the database
        yield shortUrl_model_1.default.deleteMany({ createdAt: { $lt: expirationDate } });
    });
}
exports.removeExpiredUrls = removeExpiredUrls;
//# sourceMappingURL=shortUrl.controller.js.map