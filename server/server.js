console.log(`[${new Date().toISOString()}] SERVER_LOG: server.js execution started.`);
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB().then(() => {
  console.log('MongoDB Connected successfully in server.js');
}).catch(err => {
  console.error('MongoDB connection failed in server.js:', err.message, err.stack);
});

const app = express();

app.use(express.json()); // Body parser for raw JSON

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);

// Middleware to log requests specifically to /api/posts
app.use('/api/posts', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] SERVER_LOG: Request received for ${req.method} ${req.originalUrl}`);
  if (req.method === 'GET' && req.path === '/') {
    console.log(`[${new Date().toISOString()}] SERVER_LOG: Matched GET /api/posts`);
  }
  next();
}, postRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only run app.listen if not in a Vercel environment (where Vercel handles it)
// For local development, this will start the server.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
}

module.exports = app; // Export the app for Vercel