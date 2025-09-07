import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

interface AnalysisVisualizationProps {
  status: 'real' | 'fake' | 'uncertain';
  confidence?: number;
}

const AnalysisVisualization: React.FC<AnalysisVisualizationProps> = ({ status, confidence }) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'real':
        return {
          icon: 'verified',
          color: theme.REAL,
          bgColor: theme.REAL + '20',
          text: 'Real News',
          description: 'This content appears to be credible and factually accurate.'
        };
      case 'fake':
        return {
          icon: 'warning',
          color: theme.FAKE,
          bgColor: theme.FAKE + '20',
          text: 'Fake News',
          description: 'This content appears to contain false or misleading information.'
        };
      case 'uncertain':
        return {
          icon: 'help',
          color: theme.UNCERTAIN,
          bgColor: theme.UNCERTAIN + '20',
          text: 'Uncertain',
          description: 'The credibility of this content could not be definitively determined.'
        };
      default:
        return {
          icon: 'info',
          color: theme.DEFAULT_TEXT,
          bgColor: theme.HOVER,
          text: 'Analysis Result',
          description: 'News analysis result.'
        };
    }
  };

  const config = getStatusConfig();

  // Calculate confidence percentage for visualization
  let confidencePercentage = 50;
  if (confidence !== undefined) {
    confidencePercentage = confidence;
  } else if (status === 'real') {
    confidencePercentage = 85;
  } else if (status === 'fake') {
    confidencePercentage = 85;
  } else if (status === 'uncertain') {
    confidencePercentage = 30;
  }

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor, borderLeftColor: config.color }]}>
      <View style={styles.header}>
        <MaterialIcons name={config.icon as any} size={24} color={config.color} />
        <Text style={[styles.title, { color: config.color }]}>{config.text}</Text>
      </View>
      
      <Text style={[styles.description, { color: theme.DEFAULT_TEXT }]}>{config.description}</Text>
      
      <View style={styles.confidenceContainer}>
        <Text style={[styles.confidenceLabel, { color: theme.DEFAULT_TEXT }]}>Confidence Level</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: config.color, 
                width: `${confidencePercentage}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.confidenceValue, { color: config.color }]}>{confidencePercentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  progressBar: {
    flex: 2,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    width: 35,
    textAlign: 'right',
  },
});

export default AnalysisVisualization;