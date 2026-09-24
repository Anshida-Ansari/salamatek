import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async (): Promise<void> => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    const conn = await mongoose.connect(uri, { family: 4 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
