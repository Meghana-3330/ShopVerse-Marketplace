const mongoose = require('mongoose');

let mongoMemoryInstance = null;

const connectDB = async () => {
  const defaultUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_marketplace';

  try {
    // Attempt connecting to local/remote MongoDB daemon first with a 2-second timeout probe
    const conn = await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`[MongoDB Notice] Local MongoDB server not reachable at ${defaultUri} (${error.message}).`);
    console.log(`[MongoDB] Initializing in-memory embedded MongoDB instance for seamless standalone execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryInstance.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB Memory Connected] Running on embedded engine: ${memoryUri}`);

      // Auto seed memory database so it starts pre-loaded with marketplace data
      const Product = require('../models/Product');
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log(`[Database Auto-Seed] Populating fresh database with marketplace products and demo accounts...`);
        const { runSeed } = require('../utils/seedData');
        await runSeed();
      }

      return conn;
    } catch (memError) {
      console.error(`[MongoDB Fatal Error] Could not initialize in-memory database: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
