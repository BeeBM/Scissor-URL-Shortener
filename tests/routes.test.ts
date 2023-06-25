// import request from 'supertest';
// import express, { Express } from 'express';
// import routes from '../src/routes/index';

// describe('Integration Tests', () => {
//   let app: Express;

//   beforeAll(() => {
//     app = express();

//     // Middleware to parse JSON
//     app.use(express.json());

//     // Routes
//     routes(app);
//   });

//   describe('GET /healthcheck', () => {
//     it('should return 200 with "App is healthy" message', async () => {
//       const response = await request(app).get('/healthcheck');

//       expect(response.status).toBe(200);
//       expect(response.text).toBe('App is healthy');
//     });
//   });

//   describe('POST /scissor/url', () => {
//     it('should return 200 if the request data is valid', async () => {
//       const requestBody = {
//         destination: 'https://example.com',
//         slug: 'custom-slug',
//       };

//       const response = await request(app)
//         .post('/scissor/url')
//         .send(requestBody);

//       expect(response.status).toBe(200);
//       // Add additional assertions based on the expected behavior of the createShortUrl route
//     });

//     it('should return 400 if the request data is invalid', async () => {
//       const requestBody = {
//         destination: 'invalid-url',
//         slug: 'invalid-slug!',
//       };

//       const response = await request(app)
//         .post('/scissor/url')
//         .send(requestBody);

//       expect(response.status).toBe(400);
//       // Add additional assertions based on the expected behavior of the createShortUrl route
//     });
//   });

//   describe('GET /:shortId', () => {
//     it('should return 302 and redirect to the destination URL', async () => {
//       // Create a short URL in the database for testing
//       // ...

//       const response = await request(app).get('/custom-slug');

//       expect(response.status).toBe(302);
//       expect(response.header.location).toBe('https://example.com');
//       // Add additional assertions based on the expected behavior of the handleRedirect route
//     });

//     it('should return 404 if the short URL is not found', async () => {
//       const response = await request(app).get('/non-existent-slug');

//       expect(response.status).toBe(404);
//       // Add additional assertions based on the expected behavior of the handleRedirect route
//     });
//   });

//   describe('GET /scissor/url/:shortId', () => {
//     it('should return 200 with the full shortened URL', async () => {
//       // Create a short URL in the database for testing
//       // ...

//       const response = await request(app).get('/scissor/url/custom-slug');

//       expect(response.status).toBe(200);
//       // Add additional assertions based on the expected behavior of the getShortUrl route
//     });

//     it('should return 404 if the short URL is not found', async () => {
//       const response = await request(app).get('/scissor/url/non-existent-slug');

//       expect(response.status).toBe(404);
//       // Add additional assertions based on the expected behavior of the getShortUrl route
//     });
//   });

//   describe('GET /scissor/analytics', () => {
//     it('should return 200 with the analytics data', async () => {
//       // Add test data to the analytics collection in the database
//       // ...

//       const response = await request(app).get('/scissor/analytics');

//       expect(response.status).toBe(200);
//       // Add additional assertions based on the expected behavior of the getAnalytics route
//     });
//   });
// });
