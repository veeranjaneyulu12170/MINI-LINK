export interface Link {
  _id: string;
  title: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  userId: string;
  isShop?: boolean;
  productImage?: string | null;
  isEnabled?: boolean;
  shopPlatform?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  username?: string;
  bio?: string;
  profilePic?: string;
  bannerImage?: string;
  createdAt?: string;
  updatedAt?: string;
} 