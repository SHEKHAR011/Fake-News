import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AuthOnboardingProvider } from '../src/contexts/AuthOnboardingContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { tokenCache } from '../src/utils/token-cache';

// Custom component to handle Clerk initialization
function ClerkRoot({ children }: { children: React.ReactNode }) {
  const publishableKey = 
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
    Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error('Missing CLERK_PUBLISHABLE_KEY. Please add it to your environment variables.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}

export default function RootLayout() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate in the app after a small delay to ensure everything is loaded
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
    }, 100);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <ThemeProvider>
      <ClerkRoot>
        <AuthOnboardingProvider>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <Stack screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#f7f7f8' },
              animation: 'slide_from_right',
            }}>
              <Stack.Screen 
                name="index" 
                options={{
                  headerShown: false,
                }} 
              />
            </Stack>
          </Animated.View>
        </AuthOnboardingProvider>
      </ClerkRoot>
    </ThemeProvider>
  );
}