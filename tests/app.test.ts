import request from 'supertest';
import express from 'express';
import app from '../src/app';
import routes from '../src/routes/index';

describe('App', () => {
  let expressApp: express.Application;

  beforeAll(() => {
    expressApp = express();
    app(expressApp, res);
  });

  it('should return 200 OK when the app is running', async () => {
    const response = await request(expressApp).get('/');
    expect(response.status).toBe(200);
  });

  it('should return the expected response when making a request to a specific endpoint', async () => {
    const response = await request(expressApp).get('/api/endpoint');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Endpoint response' });
  });
});
