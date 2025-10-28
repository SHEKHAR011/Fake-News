// Direct Gemini API integration for React Native
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

export const analyzeNewsWithGemini = async (newsText) => {
  if (!newsText || typeof newsText !== 'string') {
    throw new Error('Invalid news text provided');
  }

  try {
    // Initialize the Gemini API client
    // Strictly require the API key to come from `.env` injected into Expo runtime
    // config (expo.extra) via `app.config.js`. We do not fall back to other sources.
    const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;

    // Only print debug details when DEBUG=true is set in expo.extra or process.env
    try {
      const expoExtra = Constants.expoConfig?.extra ?? Constants.manifest?.extra;
      const debugFlag = (expoExtra && expoExtra.DEBUG === 'true') || process.env.DEBUG === 'true';
      if (debugFlag) {
        console.log('[DEBUG] GEMINI_API_KEY present in expo.extra:', !!apiKey);
        if (apiKey) {
          try {
            const masked = `${apiKey.slice(0,6)}...${apiKey.slice(-4)}`;
            console.log('[DEBUG] GEMINI_API_KEY loaded (masked):', masked);
          } catch {}
        }
      }
    } catch {}

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in expo.extra. Ensure you have a `.env` at project root and restart the Expo dev server so app.config.js injects the key.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Concise prompt for fake news detection
    const prompt = `Analyze this news content for authenticity and credibility:
    
    "${newsText}"
    
    Provide a concise analysis with:
    1. Likelihood of being fake (Low/Medium/High) ("and answer should be on Low/Medium/High only keep in mind")
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