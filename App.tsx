import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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