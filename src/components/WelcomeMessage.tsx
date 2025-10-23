import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

const WelcomeMessage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.AI_BUBBLE }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.ACCENT + '20' }]}>
        <MaterialIcons name="fact-check" size={40} color={theme.ACCENT} />
      </View>
      <Text style={[styles.title, { color: theme.DEFAULT_TEXT }]}>Welcome to Fake News Detector!</Text>
      <Text style={[styles.description, { color: theme.TIMESTAMP }]}>
        I&apos;m here to help you identify fake news and verify information. 
        Just paste any news content and I&apos;ll analyze its credibility for you.
      </Text>
      <View style={[styles.tipContainer, { backgroundColor: theme.UNCERTAIN + '20', borderLeftColor: theme.UNCERTAIN }]}>
        <MaterialIcons name="tips-and-updates" size={20} color={theme.UNCERTAIN} />
        <Text style={[styles.tipText, { color: theme.DEFAULT_TEXT }]}>
          Tip: For best results, paste the full article content rather than just headlines.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginLeft: 10,
  },
});

export default WelcomeMessage;