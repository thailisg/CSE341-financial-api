require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

//If runs in Render then (process.env.RENDER is true)
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;

const doc = {
  info: {
    title: 'Financial API',
    description: 'API documentation for the Financial API project'
  },
  host: process.env.RENDER_EXTERNAL_HOSTNAME || 'cse341-financial-api.onrender.com',
  schemes: ['https', 'http']
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);