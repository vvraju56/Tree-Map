const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const treeRoutes = require('./routes/trees');
const memberRoutes = require('./routes/members');
const relationshipRoutes = require('./routes/relationships');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/relationships', relationshipRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tree-Map API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDb();
    console.log('✅ Connected to Turso (libSQL)');
    app.listen(PORT, () => {
    console.log(`🚀 Tree-Map server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
