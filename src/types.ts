export interface Link {
  id: string;
  title: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties you need
}