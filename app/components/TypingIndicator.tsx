import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

const TypingIndicator: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.typingIndicator}>
      <ActivityIndicator size="small" color={theme.REAL} />
      <Text style={[styles.typingText, { color: theme.TIMESTAMP }]}>Analyzing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default TypingIndicator;