const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');
const errorHandler = require('./src/middleware/errorHandler');
const { sequelize } = require('./src/models');
const typeDefs = require('./src/graphql/schema');
const resolvers = require('./src/graphql/resolvers');
const seedData = require('./src/seedData');
const logger = require('./src/logger');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ force: false });
    logger.info('Tables created');

    await seedData();
    logger.info('Seed data loaded');

    const app = express();

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        logger.error('GraphQL Error:', error);
        return error;
      }
    });
    await apolloServer.start();
    logger.info('GraphQL server started');

    app.use(morgan('dev'));
    app.use(express.json());
    app.use(cors({ origin: '*', credentials: true }));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/members', require('./src/routes/members'));
    app.use('/books', require('./src/routes/books'));
    app.use('/loans', require('./src/routes/loans'));
    app.use('/services', require('./src/routes/services'));

    // GraphQL GET handler for browser visibility
    app.get('/graphql', (req, res) => {
      res.json({
        message: 'GraphQL endpoint is running!',
        usage: 'Send POST requests to this endpoint',
        example_query: '{ getBooks(page: 1, limit: 10) { total data { id title author } } }',
        example_mutation: 'mutation { createBook(isbn: "123", title: "Test", author: "Author") { id title } }',
        tool: 'Use Thunder Client, Postman or any GraphQL client to test'
      });
    });

    app.use('/graphql',
      cors({ origin: '*', credentials: true }),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ req })
      })
    );

    app.get('/health', (req, res) => res.json({
      status: 'ok',
      message: 'Library Management System is running',
      endpoints: {
        rest: `https://library-management-api.azurewebsites.net`,
        graphql: `https://library-management-api.azurewebsites.net/graphql`,
        docs: `https://library-management-api.azurewebsites.net/api-docs`,
        services: `https://library-management-api.azurewebsites.net/services`
      }
    }));

    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`REST API: http://localhost:${PORT}/members`);
      logger.info(`GraphQL: http://localhost:${PORT}/graphql`);
      logger.info(`API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`Services: http://localhost:${PORT}/services`);
    });

  } catch (err) {
    logger.error('Failed to start', { error: err.message });
    process.exit(1);
  }
}

start();