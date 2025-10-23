import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import OnboardingScreen from './screens/OnboardingScreen';

export default function OnboardingPage() {
  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        // Redirect to home after onboarding is complete
        router.replace('/(home)/');
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    };

    // This component just renders the onboarding screen with a callback
    // that completes onboarding and navigates to home
    // The actual onboarding component should call completeOnboarding when done
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      // Redirect to home after onboarding is complete
      router.replace('/(home)/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}