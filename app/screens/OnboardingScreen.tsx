import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const onboardingData = [
    {
      icon: 'fact-check',
      title: 'Detect Fake News',
      description: 'Easily identify false or misleading information with our AI-powered analysis.',
      color: theme.ACCENT,
    },
    {
      icon: 'shield',
      title: 'Stay Informed',
      description: 'Make better decisions by verifying the credibility of news sources.',
      color: theme.REAL,
    },
    {
      icon: 'auto-awesome',
      title: 'Smart Analysis',
      description: 'Get detailed explanations of why content is classified as real or fake.',
      color: theme.FAKE,
    },
  ];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.TIMESTAMP }]}>Skip</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.animationContainer, { opacity: fadeAnim }]}>
          <View style={[styles.iconContainer, { backgroundColor: onboardingData[currentIndex].color + '20' }]}>
            <MaterialIcons 
              name={onboardingData[currentIndex].icon as any} 
              size={80} 
              color={onboardingData[currentIndex].color} 
            />
          </View>
          
          <Text style={[styles.title, { color: theme.DEFAULT_TEXT }]}>
            {onboardingData[currentIndex].title}
          </Text>
          
          <Text style={[styles.description, { color: theme.TIMESTAMP }]}>
            {onboardingData[currentIndex].description}
          </Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentIndex ? onboardingData[currentIndex].color : theme.BORDER,
                },
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: onboardingData[currentIndex].color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons 
            name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-forward'} 
            size={20} 
            color="#fff" 
            style={styles.nextButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 20,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  animationContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  bottomContainer: {
    padding: 30,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 10,
  },
  nextButtonIcon: {
    marginTop: 2,
  },
});

export default OnboardingScreen;