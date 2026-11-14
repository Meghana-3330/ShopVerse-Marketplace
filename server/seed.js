const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runSeed } = require('./utils/seedData');

dotenv.config();

const main = async () => {
  try {
    await connectDB();
    await runSeed();
    console.log('----------------------------------------------------');
    console.log(' MARKETPLACE SEED COMPLETED SUCCESSFULLY!');
    console.log(' Demo Accounts Created:');
    console.log(' - Admin:      admin@marketplace.com     | admin123');
    console.log(' - Vendor 1:   vendor1@marketplace.com   | vendor123 (Approved - Fashion)');
    console.log(' - Vendor 2:   vendor2@marketplace.com   | vendor123 (Approved - Electronics)');
    console.log(' - Vendor 3:   vendor3@marketplace.com   | vendor123 (Approved - Home)');
    console.log(' - Pending:    pending@marketplace.com   | vendor123 (Pending Approval)');
    console.log(' - Customer 1: customer@marketplace.com  | customer123');
    console.log(' - Customer 2: meghana@example.com       | customer123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Seed execution error:', err);
    process.exit(1);
  }
};

main();
