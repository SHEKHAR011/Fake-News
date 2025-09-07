import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

interface ProgressIndicatorProps {
  stage: 'analyzing' | 'processing' | 'generating' | 'complete';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ stage }) => {
  const { theme } = useTheme();

  const getStageText = () => {
    switch (stage) {
      case 'analyzing': return 'Analyzing content...';
      case 'processing': return 'Processing information...';
      case 'generating': return 'Generating response...';
      case 'complete': return 'Complete!';
      default: return 'Analyzing...';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.DEFAULT_TEXT }]}>{getStageText()}</Text>
      <View style={[styles.progressBar, { backgroundColor: theme.BORDER }]}>
        <View style={[
          styles.progressFill, 
          { 
            width: 
              stage === 'analyzing' ? '30%' : 
              stage === 'processing' ? '60%' : 
              stage === 'generating' ? '90%' : 
              '100%',
            backgroundColor: theme.USER_BUBBLE
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ProgressIndicator;