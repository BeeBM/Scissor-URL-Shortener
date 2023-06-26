# **SCISSOR Documentation**

**Table of Contents**

- [**SCISSOR Documentation**](#scissor-documentation)
  - [**Introduction**](#introduction)
  - [**Features**](#features)
  - [**Technologies Used**](#technologies-used)
    - [Backend:](#backend)
    - [Frontend:](#frontend)
    - [Development Dependencies](#development-dependencies)
  - [**Setup Instructions**](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
    - [API Endpoints](#api-endpoints)
    - [Testing](#testing)
    - [Deployment](#deployment)
  - [**Conclusion**](#conclusion)
  - [**License**](#license)

## **Introduction**
Scissor is a web application that allows users to create short URLs for long and complex web addresses. It helps to make long URLs more manageable and shareable. This documentation provides an overview of the application, its features, and how to set it up.

## **Features**
Scissor includes the following features:

1. Shorten URLs: Users can enter a long URL and create a shortened version of it.
2. Custom Slugs: Users have the option to specify a custom slug for the shortened URL.
3. Redirection: Shortened URLs redirect to the original long URLs when accessed.
4. Analytics: The application tracks and displays the number of clicks for each shortened URL.
5. Expiration: Shortened URLs expire after a certain time (e.g., three months) and are automatically removed from the system.

## **Technologies Used**
Scissor is built using the following technologies:

### Backend:
- Node.js: A JavaScript runtime for executing server-side code.
- Express.js: A web application framework for building server-side applications.
- MongoDB: A NoSQL database for storing URL and analytics data.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB.
- nanoid: A library for generating unique and URL-friendly IDs.
- body-parser: A middleware for parsing request bodies.
- config: A library for handling application configuration.
- cors: A middleware for enabling Cross-Origin Resource Sharing.
- dotenv: A library for loading environment variables from a .env file.
- luxon: A library for handling dates and times.
- nodemon: A development utility for automatically restarting the server.
- yup: A library for data validation.

### Frontend:
- HTML: Markup language for creating the user interface.
- CSS: Styling language for customizing the application's appearance.
- TypeScript: Programming language for adding interactivity to the frontend.
- Fetch API: TypeScript API for making HTTP requests to the backend.

### Development Dependencies
The application uses the following development dependencies:
- @jest/globals: Jest testing framework globals.
- @types/body-parser: Type definitions for body-parser.
- @types/config: Type definitions for config.
- @types/cors: Type definitions for cors.
- @types/express: Type definitions for express.
- @types/jest: Type definitions for Jest.
- @types/luxon: Type definitions for luxon.
- @types/nanoid: Type definitions for nanoid.
- @types/node: Type definitions for Node.js.
- @types/supertest: Type definitions for supertest.
- @types/yup: Type definitions for yup.
- jest: JavaScript testing framework.
- rimraf: A cross-platform tool for deleting files and directories.
- copyfiles: Used in build scripts or development workflows to copy specific files or directories to a target location.
- ts-jest: Typescript support in Jest for running tests and transpiling TypeScript code to JavaScript.
- mongodb-memory-server: In-memory MongoDB server for testing.
- supertest: Library for testing HTTP requests.
- ts-node: TypeScript execution environment for running scripts.
- typescript: TypeScript compiler.

These development dependencies are primarily used for testing and development purposes. They provide type definitions, testing frameworks, and tools for running tests and compiling TypeScript code.

Make sure to install and configure these dependencies appropriately for your development environment.

## **Setup Instructions**
### Prerequisites
- Node.js and npm: Make sure Node.js and npm are installed on your system. You can download them from the official Node.js website (https://nodejs.org).

### Installation
1. Clone the repository:

    ```git clone https://github.com/BeeBM/Scissor-URL-Shortener.git```
2. Navigate to the project directory:
   
    ```cd Scissor-URL-Shortener```
3. Install dependencies:
   
    ```npm install```

### Configuration
1. Create a .env file in the root of the project directory.
2. Define the following environment variables in the .env file:
   
    ```PORT=<port-number>```

    ```MONGODB_URI=<mongodb-uri>```

    ```CORS_ORIGIN=<cors-origin>```
 - port-number: The port on which the application will run (e.g., 3000).
 - mongodb-uri: The connection URI for the MongoDB database.
 - cors-origin: The allowed origin for CORS requests (e.g., http://localhost:3000)

### Running the Application
1. Start the server:
    
    ```npm start```
2. Open a web browser and navigate to http://localhost:<port-number>, where <port-number> is the port specified in the .env file.

### API Endpoints
1. POST /api/url: Create a shortened URL.
 - Request Body:
    - destination: The long URL to be shortened.
    - suggest end part of URL (optional): A custom slug for the shortened URL.
 - Response:
    - shortUrl: The generated shortened URL.
2. GET /api/analytics/:shortId: Get analytics data for a specific shortened URL.
 - Request Parameters:
    - shortId: The short ID of the URL.
 - Response:
    - clicks: The number of clicks for the shortened URL.

### Testing
The application includes unit tests to ensure its functionality. To run the tests, use the following command:
    
  ```npm test```

### Deployment
This application was deployed on [Render](render.com) at https://scissor-mpf3.onrender.com.

## **Conclusion**
Scissor provides an easy way to shorten and manage long URLs. With its simple yet powerful features, it can be used in various scenarios where short and shareable URLs are required. The provided documentation should guide you through the setup, configuration, and deployment processes. Feel free to explore and customize the application to suit your specific requirements.

## **License**
MIT License
