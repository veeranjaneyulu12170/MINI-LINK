import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

interface ILink {
  shortId: string;
  url: string;
  // ... other properties
}

const linkSchema = new Schema<ILink>({
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid()
  },
  url: {
    type: String,
    required: true
  },
  // ... other fields
});

// ... rest of your code 