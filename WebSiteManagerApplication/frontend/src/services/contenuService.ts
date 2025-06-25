import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const generateContent = async (data: {
  title: string;
  description: string;
  layoutType: string;
  theme?: string;
  style?: string;
  rawContent: string;
}) => {
  try {
    console.log('Sending request to:', `${API_URL}/contenus/generate`);
    console.log('Request data:', data);
    
    const response = await axios.post(`${API_URL}/contenus/generate`, data);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Error generating content:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
}; 