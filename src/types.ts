export interface Link {
  _id: string;
  shortUrl: string;
  originalUrl: string;
  url: string;
  title: string;
  clicks: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  clickData?: {
    timestamp: string;
    referrer?: string;
    device?: string;
    browser?: string;
    location?: string;
  }[];
  shortCode: string;
  order: number;
  isActive: boolean;
  icon?: string;
  isShop?: boolean;
  productImage?: string | null;
  isEnabled?: boolean;
  isLatestYouTube?: boolean;
  isLatestInstagram?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;  // Add username (optional)
  category?: string;  // Add category (optional)
  bio?: string;  // Add bio (optional)
  avatarUrl?: string;  // Add avatarUrl if missing
  createdAt: string;  // Make createdAt required, not optional
  // Add any other user properties you need
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface GoogleAuthResponse {
  token: string;
  user: User;
}

// Google API type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
          }) => void) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        }
      }
    }
  }
}