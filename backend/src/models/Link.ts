import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

interface IClickData {
  timestamp: string;
  referrer?: string;
  device?: string;
  browser?: string;
  location?: string;
}

interface ILink {
  userId: Schema.Types.ObjectId;
  title: string;
  url: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  order: number;
  isActive: boolean;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  clicks: number;
  clickData?: IClickData[];
}

const linkSchema = new Schema<ILink>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    unique: true,
    default: () => nanoid(8)  // Generate a unique 8-character code
  },
  icon: String,
  backgroundColor: String,
  textColor: String,
  clicks: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clickData: [{
    timestamp: String,
    referrer: String,
    device: String,
    browser: String,
    location: String
  }]
}, {
  timestamps: true
});

// Pre-save middleware to set shortUrl and originalUrl
linkSchema.pre('save', function(next) {
  try {
    console.log('Pre-save middleware running for link:', this);
    
    // Always set originalUrl to url if not already set
    if (!this.originalUrl) {
      console.log('Setting originalUrl to:', this.url);
      this.originalUrl = this.url;
    }
    
    // Generate shortCode if not already set
    if (!this.shortCode) {
      console.log('Generating new shortCode');
      this.shortCode = nanoid(8);
    }
    
    // Always set shortUrl based on shortCode
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    this.shortUrl = `${baseUrl}/l/${this.shortCode}`;
    console.log('Setting shortUrl to:', this.shortUrl);
    
    next();
  } catch (error) {
    console.error('Error in Link pre-save middleware:', error);
    next(error as Error);
  }
});

export default model<ILink>('Link', linkSchema); 