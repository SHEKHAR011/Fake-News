import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useAuth } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const onboarded = await AsyncStorage.getItem('hasOnboarded');
          setIsOnboardingComplete(!!onboarded);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        } finally {
          setCheckingOnboarding(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isLoaded, isSignedIn]);

  // If auth isn't loaded yet, don't redirect
  if (!isLoaded) {
    return <Stack screenOptions={{ 
    headerShown: false,
    cardStyle: { 
      backgroundColor: '#f7f7f8'
    },
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  }} />;
  }

  // If not signed in, redirect to auth
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // If signed in but onboarding not complete, redirect to onboarding
  if (isSignedIn && !isOnboardingComplete && !checkingOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Stack screenOptions={{ 
    headerShown: false,
    cardStyle: { 
      backgroundColor: '#f7f7f8'
    },
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  }} />;
}