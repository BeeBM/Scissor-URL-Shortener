// import request from 'supertest';
// import express, { Request, Response, NextFunction } from 'express';
// // import { AnyObjectSchema } from 'yup';
// import validateResource from '../src/middleware/validateResource';
// import urlShortenerSchema from '../src/schema/createShortUrl.schema';

// describe('Integration Tests', () => {
//     let app: express.Application;
  
//     beforeAll(() => {
//       app = express();
  
//       // Middleware to parse JSON
//       app.use(express.json());
  
//       // Routes
//       app.post(
//         '/scissor/url',
//         validateResource(urlShortenerSchema),
//         (req: Request, res: Response) => {
//           res.sendStatus(200);
//         }
//       );
//     });
  
//     describe('POST /scissor/url', () => {
//       it('should return 200 if the request data is valid', async () => {
//         const requestBody = {
//           destination: 'https://example.com',
//           slug: 'valid-slug',
//         };
  
//         const response = await request(app)
//           .post('/your-route')
//           .send(requestBody);
  
//         expect(response.status).toBe(200);
//       });
  
//       it('should return 400 if the request data is invalid', async () => {
//         const requestBody = {
//           destination: 'invalid-url',
//           slug: 'invalid-slug!',
//         };
  
//         const response = await request(app)
//           .post('/scissor/url')
//           .send(requestBody);
  
//         expect(response.status).toBe(400);
//       });
//     });
//   });