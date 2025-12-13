import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import OnboardingScreen from './screens/OnboardingScreen';

export default function OnboardingPage() {
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      // Redirect to home after onboarding is complete
      router.replace('/(home)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}