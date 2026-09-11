const mongoose = require('mongoose');
const dns = require('dns');

// Force Node's resolver to use public DNS servers — some networks/VPNs
// hand out a local DNS server that Node's c-ares resolver can't reach
// for SRV lookups, even though the OS resolver (nslookup) works fine.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Stop server on DB failure
  }
};

module.exports = connectDB;