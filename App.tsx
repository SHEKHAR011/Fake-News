import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    // Optionally print debug info when DEBUG is enabled in env or expo.extra
    try {
      const expoExtra = Constants.expoConfig?.extra ?? Constants.manifest?.extra;
      const debugFlag = (expoExtra && expoExtra.DEBUG === 'true') || process.env.DEBUG === 'true';
      if (debugFlag) {
        const hasExpo = !!expoExtra?.GEMINI_API_KEY;
        const hasEnv = !!process.env.GEMINI_API_KEY;
        console.log('[DEBUG] GEMINI_API_KEY presence - expo.extra:', hasExpo, 'process.env:', hasEnv);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  // The actual navigation is handled by Expo Router
  return (
    <ThemeProvider>
      {/* The router handles all navigation */}
      <SplashScreen />
    </ThemeProvider>
  );
}