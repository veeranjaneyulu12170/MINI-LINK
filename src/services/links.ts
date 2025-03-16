import axiosInstance from './axiosConfig';
import { Link } from '../types';

interface CreateLinkData {
  title: string;
  url: string;
  originalUrl?: string;
  shortUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  userId: string;
  icon?: string;
}

export default class LinksService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAll() {
    try {
      const response = await axiosInstance.get<Link[]>(`${this.baseUrl}/api/links`);
      return response;
    } catch (error) {
      console.error('Error fetching links:', error);
      throw error;
    }
  }

  async create(linkData: CreateLinkData) {
    try {
      console.log('Creating link with data:', linkData);
      console.log('API URL:', axiosInstance.defaults.baseURL);
      console.log('Full request URL:', `${axiosInstance.defaults.baseURL}/api/links`);
      
      // Validate required fields
      if (!linkData.title?.trim() || !linkData.url?.trim()) {
        throw new Error('Title and URL are required');
      }

      // Validate userId
      if (!linkData.userId) {
        throw new Error('User ID is required');
      }

      // Clean and validate URL
      let url = linkData.url.trim();
      if (!url.match(/^https?:\/\//i)) {
        url = `https://${url}`;
      }

      try {
        new URL(url);
      } catch (err) {
        throw new Error('Invalid URL format');
      }

      // Clean the data by removing undefined/null values
      const cleanedData = {
        title: linkData.title.trim(),
        url,
        originalUrl: url, // Add originalUrl field with the same value as url
        userId: linkData.userId,
        ...(linkData.backgroundColor && { backgroundColor: linkData.backgroundColor }),
        ...(linkData.textColor && { textColor: linkData.textColor }),
        ...(linkData.icon && { icon: linkData.icon })
      };
      
      console.log('Sending link data to server:', cleanedData);
      const response = await axiosInstance.post('/api/links', cleanedData);
      console.log('Server response:', response);
      return response;
    } catch (error: any) {
      console.error('Error creating link:', error);
      
      // Log more detailed error information
      if (error.response?.data) {
        console.error('Server error response:', error.response.data);
        
        // If the error is related to validation, provide a more specific error message
        if (error.response.data.error && error.response.data.error.includes('validation failed')) {
          const errorMessage = error.response.data.error;
          console.error('Validation error:', errorMessage);
          
          // Check for specific validation errors
          if (errorMessage.includes('shortUrl') || errorMessage.includes('originalUrl')) {
            console.error('Missing required fields: shortUrl or originalUrl');
          }
        }
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/api/links/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  }

  async incrementClicks(id: string, analyticsData: {
    referrer: string;
    device: string;
    browser: string;
    location: string;
  }) {
    try {
      const response = await axiosInstance.post<Link>(`${this.baseUrl}/api/links/${id}/clicks`, analyticsData);
      return response;
    } catch (error) {
      console.error('Error incrementing clicks:', error);
      throw error;
    }
  }

  async reorder(linkIds: string[]) {
    try {
      const response = await axiosInstance.post<Link[]>(`${this.baseUrl}/api/links/reorder`, { linkIds });
      return response;
    } catch (error) {
      console.error('Error reordering links:', error);
      throw error;
    }
  }
}