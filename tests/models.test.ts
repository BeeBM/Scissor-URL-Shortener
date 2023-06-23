import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import shortUrl, { ShortURL } from '../src/models/shortUrl.model';
import analytics from '../src/models/analytics.model';

describe('Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('ShortURL Model', () => {
    it('should create a new short URL', async () => {
      const newShortUrl: ShortURL = await shortUrl.create({
        destination: 'https://example.com',
      });

      expect(newShortUrl.shortId).toBeTruthy();
      expect(newShortUrl.destination).toBe('https://example.com');
    });

    it('should not allow duplicate short IDs', async () => {
      const shortId = 'abc123';

      await shortUrl.create({ shortId, destination: 'https://example.com' });

      // Attempt to create another short URL with the same short ID
      await expect(
        shortUrl.create({ shortId, destination: 'https://example.org' })
      ).rejects.toThrow();
    });
  });

  describe('Analytics Model', () => {
    it('should create a new analytics entry', async () => {
      // Create a short URL for testing
      const shortURL: ShortURL = await shortUrl.create({
        destination: 'https://example.com',
      });

      const newAnalytics = await analytics.create({
        shortUrl: shortURL._id,
      });

      expect(newAnalytics.shortUrl).toEqual(shortURL._id);
    });
  });
});
