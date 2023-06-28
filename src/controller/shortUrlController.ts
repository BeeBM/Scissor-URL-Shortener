import { Request, Response } from "express";
import shortUrl from "../models/shortUrlModel";
import analytics from "../models/analyticsModel";
import { customAlphabet } from "nanoid";
import { DateTime } from "luxon";

export async function createShortUrl(req: Request, res: Response) {
  // Get the destination and custom slug from the request body
  const { destination, slug } = req.body;

  if (!destination) {
    return res.status(400).json({ error: 'Destination URL is required' });
  }

  // Check if the custom slug is provided
  let shortId: string;
  if (slug) {
    try {
      // Check if the custom slug is already taken
      const existingUrl = await shortUrl.findOne({ shortId: slug }).lean();
      if (existingUrl) {
        return res.status(400).json({ error: 'Custom slug is already taken' });
      }
      shortId = slug as string;
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Generate a random shortId if no custom slug is provided
    shortId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)();
  }
  
  try {
    // Create a shortUrl
    const newUrl = await shortUrl.create({ shortId, destination });

    // Build the full shortened URL
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${newUrl.shortId}`;

    return res.json({ shortUrl: fullShortUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle the redirect to the destination URL based on the provided shortId
export async function handleRedirect(req: Request, res: Response) {
  const { shortId } = req.params;

  // Find the corresponding short URL in the database
  const short = await shortUrl.findOne({ shortId }).lean();

  // If the short URL is not found, return a 404 status
  if (!short) {
    return res.sendStatus(404);
  }

  // Create an analytics entry for tracking the visit to the short URL
  analytics.create({ shortUrl: short._id });

  // Redirect the user to the destination URL
  return res.redirect(short.destination);
}

// Retrieve the analytics data for all short URL visits
export async function getAnalytics(req: Request, res: Response) {
  const { shortId } = req.params;

  try {
    // Retrieve analytics data from the database for the given shortId
    const data = await analytics.find({ shortId }).lean();

    // If no analytics data is found, return a 404 status
    if (data.length === 0) {
      return res.sendStatus(404);
    }

    // Send the analytics data as a response
    return res.send(data);
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.sendStatus(500).json ({ error: 'Error fetching analytics data' });
  }
}

// Delete urls from the database after 3 months
export async function removeExpiredUrls() {
  // Get the current date and time
  const currentDate = DateTime.now().toJSDate();

  // Calculate the date three months ago
  const expirationDate = DateTime.fromJSDate(currentDate).minus({ months: 3 }).toJSDate();

  // Remove expired URLs from the database
  await shortUrl.deleteMany({ createdAt: { $lt: expirationDate } });
}