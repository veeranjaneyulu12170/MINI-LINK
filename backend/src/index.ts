import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import authRoutes from './routes/auth';
import linkRoutes from './routes/links';
import path from 'path';

// Load environment variables first - keep this for other env vars
config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Directly use the connection string instead of env var for troubleshooting
const directMongoUri = 'mongodb+srv://Anji1:121121@cluster0.6wbmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
async function startServer() {
  try {
    console.log('Attempting to connect with direct string...');
    
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    } as ConnectOptions;

    await mongoose.connect(directMongoUri, mongooseOptions);
    
    console.log('Connected to MongoDB Atlas');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
    }
    process.exit(1);
  }
}

// Add error handlers for mongoose
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});