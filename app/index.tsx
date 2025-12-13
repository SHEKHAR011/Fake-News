import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../src/contexts/ThemeContext';

export default function Root() {
  const { isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    
    spinAnimation.start();

    return () => {
      spinAnimation.stop(); // Clean up animation
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Show a themed loading state while checking auth
  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
        <Text style={[styles.loadingText, { color: theme.DEFAULT_TEXT, marginTop: 16 }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // If signed in, redirect to home (main app)
  if (isSignedIn) {
    return <Redirect href="/(home)" />;
  }
  
  // If not signed in, redirect to auth
  return <Redirect href="/(auth)/sign-in" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#007AFF',  // Using a default color that works for both themes
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
});