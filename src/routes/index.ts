import { Express, Request, Response } from "express";
import {
  createShortUrl,
  handleRedirect,
  getAnalytics,
  // getShortUrl,
} from "../controller/shortUrl.controller";
import validateResourse from "../middleware/validateResource";
import shortUrlSchema from "../schema/createShortUrl.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    return res.send("App is healthy");
  });

  app.post("/scissor/url", validateResourse(shortUrlSchema), createShortUrl);

  app.get("/:shortId", handleRedirect);

  // app.get("/scissor/url/:shortId", getShortUrl);

  app.get("/scissor/analytics", getAnalytics);
}

export default routes;
