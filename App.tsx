import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './app/index';
import OnboardingScreen from './app/screens/OnboardingScreen';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      if (!onboarded) {
        setShowOnboarding(true);
      }
    };

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

    checkIfAlreadyOnboarded();
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        {showOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <HomeScreen />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});