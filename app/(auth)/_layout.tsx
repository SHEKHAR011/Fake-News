import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useEffect, useState } from 'react';

    export default function AuthLayout() {
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
        }
        };

        checkOnboardingStatus();
    }, [isLoaded, isSignedIn]);

    // If auth isn't loaded yet, don't redirect
    if (!isLoaded) {
        return <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: '#f7f7f8',
      },
      animation: 'slide_from_right',
    }} />;
    }

    // If signed in but onboarding not complete, redirect to onboarding
    if (isSignedIn && !isOnboardingComplete && !checkingOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    // If signed in and onboarding is complete, redirect to home
    if (isSignedIn && isOnboardingComplete) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: '#f7f7f8',
      },
      animation: 'slide_from_right',
    }} />;
    }