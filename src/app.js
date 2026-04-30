const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/members', require('./routes/members'));
app.use('/books', require('./routes/books'));
app.use('/loans', require('./routes/loans'));
app.use('/services', require('./routes/services'));

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Library Management System is running' }));

app.use(errorHandler);

module.exports = app;