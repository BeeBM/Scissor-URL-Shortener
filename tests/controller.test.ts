import request from 'supertest';
import express from 'express';
import {
  createShortUrl,
  handleRedirect,
  getAnalytics,
} from '../src/controller/shortUrl.controller';
import shortUrl from '../src/models/shortUrl.model';
import analytics from '../src/models/analytics.model';

jest.mock('../src/models/shortUrl.model');
jest.mock('../src/models/analytics.model');

describe('Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    // Middleware to parse JSON
    app.use(express.json());

    // Routes
    app.post('/shorten', createShortUrl);
    app.get('/redirect/:shortId', handleRedirect);
    app.get('/analytics', getAnalytics);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('POST /shorten', () => {
    it('should create a short URL without a custom slug', async () => {
      const destination = 'https://example.com';

      const createSpy = jest.spyOn(shortUrl, 'create').mockResolvedValueOnce({
        shortId: 'abcdef', 
      });

      const response = await request(app)
        .post('/shorten')
        .send({ destination });

      expect(createSpy).toHaveBeenCalledWith({
        shortId: expect.any(String),
        destination,
      });
      expect(response.status).toBe(200);
      expect(response.body.shortUrl).toMatch(/^http:\/\/[^/]+\/abcdef$/);
    });

    it('should create a short URL with a custom slug', async () => {
      const destination = 'https://example.com';
      const slug = 'customslug';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce(null);
      const createSpy = jest.spyOn(shortUrl, 'create').mockResolvedValueOnce({
        shortId: slug as string,
      });

      const response = await request(app)
        .post('/shorten')
        .send({ destination, slug });

      expect(createSpy).toHaveBeenCalledWith({
        shortId: slug,
        destination,
      });
      expect(response.status).toBe(200);
      expect(response.body.shortUrl).toMatch(/^http:\/\/[^/]+\/customslug$/);
    });

    it('should return an error if the custom slug is already taken', async () => {
      const destination = 'https://example.com';
      const slug = 'existingslug';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce({});

      const response = await request(app)
        .post('/shorten')
        .send({ destination, slug });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Custom slug is already taken');
    });
  });

  describe('GET /redirect/:shortId', () => {
    it('should redirect to the destination URL if the shortId exists', async () => {
      const shortId = 'abcdef';
      const destination = 'https://example.com';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce({ destination });

      const redirectSpy = jest.spyOn(express.response, 'redirect');

      const response = await request(app).get(`/redirect/${shortId}`);

      expect(redirectSpy).toHaveBeenCalledWith(destination);
      expect(response.status).toBe(302);
    });

    it('should return 404 status if the shortId does not exist', async () => {
      const shortId = 'nonexistent';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).get(`/redirect/${shortId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /analytics', () => {
    it('should retrieve and send analytics data', async () => {
      const analyticsData = [{ id: '123', shortUrl: 'abcdef' }];

      (analytics.find as jest.Mock).mockResolvedValueOnce(analyticsData);

      const sendSpy = jest.spyOn(express.response, 'send');

      const response = await request(app).get('/analytics');

      expect(sendSpy).toHaveBeenCalledWith(analyticsData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(analyticsData);
    });
  });

  describe('GET /shortUrl/:shortId', () => {
    it('should return the full shortened URL if the shortId exists', async () => {
      const shortId = 'abcdef';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce({ shortId });

      const response = await request(app).get(`/shortUrl/${shortId}`);

      expect(response.status).toBe(200);
      expect(response.body.shortUrl).toMatch(/^http:\/\/[^/]+\/abcdef$/);
    });

    it('should return 404 status if the shortId does not exist', async () => {
      const shortId = 'nonexistent';

      (shortUrl.findOne as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).get(`/shortUrl/${shortId}`);

      expect(response.status).toBe(404);
    });
  });
});
// const createSpy = jest.fn().mockResolvedValueOnce({
//   shortId: 'abcdef',
// });
// shortUrl.create = createSpy;