// Example using MongoDB and Mongoose

const ShortUrl = require('../src/models/shortUrl.model');

// Background job or cron job to delete expired URLs
const deleteExpiredUrls = async () => {
  try {
    // Determine the expiration time (three months)
    const expirationTime = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000);

    // Find the URLs that have expired
    const expiredUrls = await ShortUrl.find({ createdAt: { $lt: expirationTime } });

    // Delete the expired URLs
    await ShortUrl.deleteMany({ createdAt: { $lt: expirationTime } });

    console.log(`Deleted ${expiredUrls.length} expired URLs`);
  } catch (error) {
    console.error('Error deleting expired URLs:', error);
  }
};

// Run the deleteExpiredUrls job every day
setInterval(deleteExpiredUrls, 24 * 60 * 60 * 1000);
