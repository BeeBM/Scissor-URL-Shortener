import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import shortUrl, { ShortURL } from '../src/models/shortUrlModel';
import analytics from '../src/models/analyticsModel';
import request from 'supertest';
import express, { Express } from 'express';
import routes from '../src/routes/index';


describe('Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    // Middleware to parse JSON
    app.use(express.json());

    // Routes
    routes(app);
  });

  describe('GET /healthcheck', () => {
    it('should return 200 with "App is healthy" message', async () => {
      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(200);
      expect(response.text).toBe('App is healthy');
    });
  });

  it('should return 400 if the request data is invalid', async () => {
    const requestBody = {
      destination: 'invalid-url',
      slug: 'invalid-slug!',
    };

    const response = await request(app)
      .post('/scissor/url')
      .send(requestBody);

    expect(response.status).toBe(400);
    // Add additional assertions based on the expected behavior of the createShortUrl route
  });
});

describe('Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
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
      const shortId = 'abc1234';
    
      // Create a short URL with the same short ID
      await shortUrl.create({ shortId, destination: 'https://example.com' });
    
      // Attempt to create another short URL with the same short ID
      try {
        await shortUrl.create({ shortId, destination: 'https://example.org' });
      } catch (error) {
        expect(error).toBe('Custom slug is already taken');
      }
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
