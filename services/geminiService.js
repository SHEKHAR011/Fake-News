// Direct Gemini API integration for React Native
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

export const analyzeNewsWithGemini = async (newsText) => {
  if (!newsText || typeof newsText !== 'string') {
    throw new Error('Invalid news text provided');
  }

  try {
    // Initialize the Gemini API client
    // In Expo, we access environment variables through Constants.expoConfig.extra
    const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please check your app.json configuration.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Concise prompt for fake news detection
    const prompt = `Analyze this news content for authenticity and credibility:
    
    "${newsText}"
    
    Provide a concise analysis with:
    1. Likelihood of being fake (Low/Medium/High)
    2. Key indicators
    3. Confidence level (0-100%)
    4. Verification recommendations
    
    Respond in a conversational tone.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API directly:', error);
    
    // Provide more specific error messages
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
      throw new Error('Invalid or missing GEMINI_API_KEY. Please check your API key configuration.');
    } else if (error.message.includes('Network')) {
      throw new Error('Network error connecting to Gemini API. Please check your internet connection.');
    }
    
    throw new Error(`Failed to analyze the news content: ${error.message}`);
  }
};

// Optional: Simple batch analysis function
export const analyzeBatchNews = async (newsItems) => {
  const results = [];
  
  for (const item of newsItems) {
    try {
      const analysis = await analyzeNewsWithGemini(item);
      results.push({ content: item.substring(0, 50) + '...', analysis });
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    } catch (error) {
      results.push({ content: item.substring(0, 50) + '...', error: error.message });
    }
  }
  
  return results;
};