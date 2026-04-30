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
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ force: false });
    console.log('✅ Tables created');

    const app = express();

    const apolloServer = new ApolloServer({ 
      typeDefs, 
      resolvers,
      formatError: (error) => {
        console.error(error);
        return error;
      }
    });
    await apolloServer.start();
    console.log('✅ GraphQL server started');

    app.use(morgan('dev'));
    app.use(express.json());
    app.use(cors({ origin: '*', credentials: true }));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/members', require('./src/routes/members'));
    app.use('/books', require('./src/routes/books'));
    app.use('/loans', require('./src/routes/loans'));
    app.use('/services', require('./src/routes/services'));

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
        rest: `http://localhost:${PORT}`,
        graphql: `http://localhost:${PORT}/graphql`,
        docs: `http://localhost:${PORT}/api-docs`,
        services: `http://localhost:${PORT}/services`
      }
    }));

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 REST API: http://localhost:${PORT}/members`);
      console.log(`🔮 GraphQL: http://localhost:${PORT}/graphql`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 Services: http://localhost:${PORT}/services`);
    });

  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();