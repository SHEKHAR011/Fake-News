import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const TypingIndicator: React.FC = () => {
  return (
    <View style={styles.typingIndicator}>
      <ActivityIndicator size="small" color="#19c37d" />
      <Text style={styles.typingText}>Analyzing...</Text>
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
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default TypingIndicator;