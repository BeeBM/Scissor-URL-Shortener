import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

// Import the app from your file
import app from '../src/app';

// Mock the config module
jest.mock('config', () => ({
  get: jest.fn((key: string) => {
    if (key === 'corsOrigin') {
      return 'http://example.com';
    }
    if (key === 'port') {
      return 4400;
    }
    return undefined;
  }),
}));

// Mock the routes module
jest.mock('./routes', () => (app: express.Application) => {
  app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route' });
  });
});

describe('App', () => {
  let expressApp: express.Application;

  beforeAll(() => {
    expressApp = express();
    expressApp.use(cors());
    expressApp.use(bodyParser.json());
    expressApp.use(express.static(path.join(__dirname, 'public')));
    app(expressApp);
  });

  afterAll(() => {
    // Clean up resources, if any
  });

  it('should return a successful response from the test route', async () => {
    const response = await request(expressApp).get('/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Test route' });
  });
});
