import { Request, Response } from "express";
import shortUrl from "../models/shortUrl.model";
import analytics from "../models/analytics.model";
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
    // Check if the custom slug is already taken
    const existingUrl = await shortUrl.findOne({ shortId: slug }).lean();
    if (existingUrl) {
      return res.status(400).json({ error: 'Custom slug is already taken' });
    }
    shortId = slug as string;
  } else {
    // Generate a random shortId if no custom slug is provided
    shortId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)();
  }
  
  // Create a shortUrl
  const newUrl = await shortUrl.create({ shortId, destination });
  
  // Build the full shortened URL
  const fullShortUrl = `${req.protocol}://${req.get('host')}/${newUrl.shortId}`;

  return res.json({ shortUrl: fullShortUrl });
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
  // Retrieve all analytics data from the database
  const data = await analytics.find({ shortId }).lean();

   // If the analytics data is not found, return a 404 status
   if (!data) {
    return res.sendStatus(404);
  }

  // Send the analytics data as a response
  return res.send(data);
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


// // Retrieve a specific short URL by its shortId
// export async function getShortUrl(req: Request, res: Response) {
//   const { shortId } = req.params;

//   // Find the corresponding short URL in the database
//   const short = await shortUrl.findOne({ shortId }).lean();

//   // If the short URL is not found, return a 404 status
//   if (!short) {
//     return res.sendStatus(404);
//   }

//   // Build the full shortened URL
//   const fullShortUrl = `${req.protocol}://${req.get('host')}/${short.shortId}`;

//   return res.json({ shortUrl: fullShortUrl });
// }