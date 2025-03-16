import axios, { AxiosError } from 'axios';

// Then in your catch block:
} catch (error: unknown) {
  console.error('Error creating link:', error);
  
  // Check if it's an Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.data) {
      console.error('Server error response:', axiosError.response.data);
      
      // Type check for the data structure
      const responseData = axiosError.response.data as any;
      
      if (responseData.error && typeof responseData.error === 'string' && 
          responseData.error.includes('validation failed')) {
        const errorMessage = responseData.error;
        console.error('Validation error:', errorMessage);
        
        if (errorMessage.includes('shortUrl') || errorMessage.includes('originalUrl')) {
          console.error('Missing required fields: shortUrl or originalUrl');
        }
      }
    }
    
    if (axiosError.response?.data && (axiosError.response.data as any).error) {
      throw new Error((axiosError.response.data as any).error);
    }
  }
  
  // Re-throw the original error
  throw error;
} 