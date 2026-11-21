import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ethio_rewards';

  // Mask password for secure logging
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');

  try {
    console.log(`[Database] Connecting to MongoDB: ${maskedUri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[Database] MongoDB Atlas connected successfully.');
  } catch (err) {
    console.warn(`[Database] Warning: Could not connect to primary MongoDB (${err.message}).`);
    
    // Attempt fallback to in-memory MongoDB for local dev resilience
    try {
      console.log('[Database] Attempting in-memory MongoDB fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB connected: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] In-memory MongoDB failed as well:', memErr.message);
      console.error('[Database] Please verify your MongoDB Atlas password and network connection in backend/.env');
    }
  }
};
