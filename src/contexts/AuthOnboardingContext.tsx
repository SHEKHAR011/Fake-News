import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';

type AuthOnboardingContextType = {
  isOnboardingComplete: boolean;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthOnboardingContext = createContext<AuthOnboardingContextType | undefined>(undefined);

export function AuthOnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        setIsOnboardingComplete(!!onboarded);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <AuthOnboardingContext.Provider 
      value={{ 
        isOnboardingComplete, 
        completeOnboarding, 
        isLoading,
        isAuthenticated: !!isSignedIn
      }}
    >
      {children}
    </AuthOnboardingContext.Provider>
  );
}

export function useAuthOnboarding() {
  const context = useContext(AuthOnboardingContext);
  if (context === undefined) {
    throw new Error('useAuthOnboarding must be used within an AuthOnboardingProvider');
  }
  return context;
}