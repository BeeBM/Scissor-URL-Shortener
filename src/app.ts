import express from "express";
import config from "config";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import db from "./database";
import path from "path";

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

app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening at http://localhost:${port}`);

  db();

  routes(app);
});

export default app