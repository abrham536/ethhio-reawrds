import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import posRoutes from './routes/posRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Ethio Rewards Backend API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/invest', investmentRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start listening
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 [Ethio Rewards API] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
