import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

interface ProgressIndicatorProps {
  stage: 'analyzing' | 'processing' | 'generating' | 'complete';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ stage }) => {
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    spinAnimation.start();
    
    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  // Interpolate rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getStageText = () => {
    switch (stage) {
      case 'analyzing':
        return 'Analyzing...';
      case 'processing':
        return 'Processing...';
      case 'generating':
        return 'Generating...';
      case 'complete':
        return '✅ Complete!';
      default:
        return '🔍 Analyzing...';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'analyzing':
        return 'search';
      case 'processing':
        return 'hourglass-empty';
      case 'generating':
        return 'auto-awesome';
      case 'complete':
        return 'check-circle';
      default:
        return 'search';
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'analyzing':
        return theme.ACCENT;
      case 'processing':
        return theme.UNCERTAIN;
      case 'generating':
        return theme.REAL;
      case 'complete':
        return theme.REAL;
      default:
        return theme.ACCENT;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialIcons 
          name={getStageIcon() as any} 
          size={24} 
          color={getStageColor()} 
        />
      </Animated.View>
      <Text style={[styles.text, { color: theme.DEFAULT_TEXT, marginLeft: 12 }]}>
        {getStageText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    margin: 4,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
});

export default ProgressIndicator;