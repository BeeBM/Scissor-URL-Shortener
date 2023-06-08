import { Request, Response } from "express";
import shortUrl from "../models/shortUrl.model";
import analytics from "../models/analytics.model";
import { customAlphabet } from 'nanoid';

export async function createShortUrl(req: Request, res: Response) {
  // Get the destination and custom slug from the request body
  const { destination, slug } = req.body;

  // Check if the custom slug is provided
  let shortId;
  if (slug) {
    // Check if the custom slug is already taken
    const existingUrl = await shortUrl.findOne({ shortId: slug }).lean();
    if (existingUrl) {
      return res.status(400).json({ error: 'Custom slug is already taken' });
    }
    shortId = slug;
  } else {
    // Generate a random shortId if no custom slug is provided
    shortId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)();
  }

  // Create a shortUrl
  const newUrl = await shortUrl.create({ shortId, destination });

  // Return the shortUrl
  return res.json(newUrl);
}

export async function handleRedirect(req: Request, res: Response) {
  const { shortId } = req.params;

  const short = await shortUrl.findOne({ shortId }).lean();

  if (!short) {
    return res.sendStatus(404);
  }

  analytics.create({ shortUrl: short._id });

  return res.redirect(short.destination);
}

export async function getAnalytics(req: Request, res: Response) {
  const data = await analytics.find({}).lean();

  return res.send(data);
}

export async function getShortUrl(req: Request, res: Response) {
  const { shortId } = req.params;
  const short = await shortUrl.findOne({ shortId }).lean();

  if (!short) {
    return res.sendStatus(404);
  }

  return res.json(short);
}