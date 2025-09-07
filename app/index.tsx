import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { analyzeNewsWithGemini } from '../services/geminiService';
import { COLORS } from '../src/constants/AppConstants';
import { Message } from '../src/types/Message';
import { formatTime } from '../utils/helpers';
import { loadMessages, saveMessages } from '../utils/messageStorage';
import { validateNewsContent } from '../utils/validators';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load messages from storage on component mount
  useEffect(() => {
    const initializeMessages = async () => {
      const loadedMessages = await loadMessages();
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        // Set default welcome message if no messages exist
        const welcomeMessage: Message = {
          id: 1,
          text: "Hello! I'm your Fake News Detector. Send me any news content and I'll analyze its credibility for you.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };

    initializeMessages();
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const handleSend = async (inputText: string) => {
    // Validate input
    const validation = validateNewsContent(inputText);
    if (!validation.isValid) {
      // Show validation error as a message
      const errorMessage: Message = {
        id: messages.length + 1,
        text: validation.message,
        isUser: false,
        timestamp: new Date(),
        status: "uncertain",
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveMessages(newMessages);
      return newMessages;
    });
    setIsLoading(true);

    try {
      const analysis = await analyzeNewsWithGemini(inputText);

      // Decide status based on keywords
      let status: "real" | "fake" | "uncertain" = "uncertain";
      if (/low/i.test(analysis)) status = "real";
      else if (/high/i.test(analysis)) status = "fake";
      else if (/medium/i.test(analysis)) status = "uncertain";

      // Add AI response
      const aiMessage: Message = {
        id: messages.length + 2,
        text: analysis,
        isUser: false,
        timestamp: new Date(),
        status, // 👈 added
      };

      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        saveMessages(newMessages);
        return newMessages;
      });
    } catch (error) {
      console.error('Error analyzing news:', error);

      const errorMessage: Message = {
        id: messages.length + 2,
        text: `Sorry, I encountered an error: ${(error as Error).message}. Please check your API key and try again.`,
        isUser: false,
        timestamp: new Date(),
        status: "uncertain",
      };

      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        saveMessages(newMessages);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f8" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fake News Detector</Text>
        <Text style={styles.headerSubtitle}>Powered by Gemini AI</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            timestamp={formatTime(message.timestamp)}
          />
        ))}

        {isLoading && (
          <ChatMessage
            message={{
              id: 'typing',
              text: '',
              isUser: false,
              timestamp: new Date(),
            }}
            isLoading={true}
          />
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <InputArea
          onSend={handleSend}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: COLORS.DEFAULT_TEXT,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#565869',
    textAlign: 'center',
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 10,
  },
});
