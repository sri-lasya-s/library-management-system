const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'A REST API for managing library books, members and loans',
    },
    servers: [
      { 
        url: 'https://library-management-api.azurewebsites.net',
        description: 'Production server'
      },
      { 
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);