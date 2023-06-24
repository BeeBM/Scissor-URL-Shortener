import express from "express";
import config from "config";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import db from "./database";
import path from "path";
import { removeExpiredUrls } from "./controller/shortUrl.controller";
import { DateTime } from "luxon";

const app = express(); 

app.use(
  cors({
    origin: config.get("corsOrigin"),
  })
);

const port = config.get("port") as number;

// parse application/json
app.use(bodyParser.json());

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'public')));

// Run the function initially to remove any existing expired URLs
removeExpiredUrls();

// Schedule the function to run every day at a specific time (e.g., midnight)
const scheduledTime = DateTime.local()
  .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  .plus({ days: 1 });
const timeUntilScheduled = scheduledTime.diffNow().as("milliseconds");

setTimeout(() => {
  // Run the function periodically every day at the specified time
  setInterval(removeExpiredUrls, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}, timeUntilScheduled);

app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening at http://localhost:${port}`);

  db();

  routes(app);
});

export default app