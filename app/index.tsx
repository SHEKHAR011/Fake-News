import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeNewsWithGemini } from '../services/geminiService';
import { Message } from '../src/types/Message';
import { formatTime } from '../utils/helpers';
import { validateNewsContent } from '../utils/validators';
import { Conversation, createConversation, loadConversations, saveConversations, loadConversationMessages, saveConversationMessages } from '../utils/conversationStorage';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import WelcomeMessage from './components/WelcomeMessage';
import { useTheme } from '../src/contexts/ThemeContext';

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'processing' | 'generating' | 'complete'>('analyzing');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const messageFadeAnims = useRef<{[key: string]: Animated.Value}>({}).current;
  const loadingFadeAnim = useRef(new Animated.Value(0)).current;

  const initializeApp = useCallback(async () => {
    // Load conversations
    const loadedConversations: Conversation[] = await loadConversations();
    
    if (loadedConversations.length > 0) {
      setConversations(loadedConversations);
      // Load messages for the first conversation
      const firstConversation = loadedConversations[0];
      setCurrentConversationId(firstConversation.id);
      const conversationMessages = await loadConversationMessages(firstConversation.id);
      if (conversationMessages.length > 0) {
        setMessages(conversationMessages);
        // Animate all loaded messages
        conversationMessages.forEach(message => {
          if (!messageFadeAnims[message.id]) {
            messageFadeAnims[message.id] = new Animated.Value(0);
          }
          Animated.timing(messageFadeAnims[message.id], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Set default welcome message with empty text to trigger WelcomeMessage component
        const welcomeMessage: Message = {
          id: 1,
          text: "",  // Empty text triggers WelcomeMessage component
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        // Animate welcome message
        if (!messageFadeAnims[welcomeMessage.id]) {
          messageFadeAnims[welcomeMessage.id] = new Animated.Value(0);
        }
        Animated.timing(messageFadeAnims[welcomeMessage.id], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // Check if this is the user's first time
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      
      // Create first conversation
      const newConversation = createConversation("New Analysis");
      setConversations([newConversation]);
      setCurrentConversationId(newConversation.id);
      await saveConversations([newConversation]);
      
      // Set appropriate welcome message with empty text to trigger WelcomeMessage component
      const welcomeMessage: Message = {
        id: 1,
        text: hasOnboarded ? "" : "",  // Empty text triggers WelcomeMessage component
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      await saveConversationMessages(newConversation.id, [welcomeMessage]);
      
      // Animate welcome message
      if (!messageFadeAnims[welcomeMessage.id]) {
        messageFadeAnims[welcomeMessage.id] = new Animated.Value(0);
      }
      Animated.timing(messageFadeAnims[welcomeMessage.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [messageFadeAnims]);

  // Load messages and conversations from storage on component mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Enhanced keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // Add a small delay to ensure the keyboard is fully shown
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Scroll to bottom when keyboard hides to maintain position
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Sidebar animation effect
  useEffect(() => {
    if (sidebarVisible) {
      // Reset values for slide in
      slideAnim.setValue(-300);
      fadeAnim.setValue(0);
      
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [sidebarVisible, slideAnim, fadeAnim]);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
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
      
      // Create fade animation for error message
      if (!messageFadeAnims[errorMessage.id]) {
        messageFadeAnims[errorMessage.id] = new Animated.Value(0);
      }
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Animate error message
      Animated.timing(messageFadeAnims[errorMessage.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      return;
    }

    if (isLoading || currentConversationId === null) return;

    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Add user message with animation
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    // Create fade animation for new message
    if (!messageFadeAnims[userMessage.id]) {
      messageFadeAnims[userMessage.id] = new Animated.Value(0);
    }
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveConversationMessages(currentConversationId, newMessages);
    
    // Animate new message
    Animated.timing(messageFadeAnims[userMessage.id], {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsLoading(true);
    setLoadingStage('analyzing');
    
    // Animate loading indicator
    loadingFadeAnim.setValue(0);
    Animated.timing(loadingFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();

    try {
      // Force each stage to be visible for a minimum time
      await new Promise(resolve => {
        setTimeout(() => {
          setLoadingStage('processing');
          setTimeout(() => {
            setLoadingStage('generating');
            setTimeout(() => {
              resolve(null);
            }, 1500); // Show generating for 1.5 seconds
          }, 1500); // Show processing for 1.5 seconds
        }, 1500); // Show analyzing for 1.5 seconds
      });
      
      const analysis = await analyzeNewsWithGemini(inputText);

      // Decide status based on keywords
      let status: "real" | "fake" | "uncertain" = "uncertain";
      if (/low/i.test(analysis)) status = "real";
      else if (/high/i.test(analysis)) status = "fake";
      else if (/medium/i.test(analysis)) status = "uncertain";

      // Add haptic feedback for response
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Add AI response with animation
      const aiMessage: Message = {
        id: messages.length + 2,
        text: analysis,
        isUser: false,
        timestamp: new Date(),
        status,
      };

      // Create fade animation for AI message
      if (!messageFadeAnims[aiMessage.id]) {
        messageFadeAnims[aiMessage.id] = new Animated.Value(0);
      }
      
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveConversationMessages(currentConversationId, finalMessages);
      
      // Animate AI message
      Animated.timing(messageFadeAnims[aiMessage.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error analyzing news:', error);

      // Provide more user-friendly error messages based on error type
      let errorMessageText = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        // Check for specific error messages and provide better user guidance
        if (error.message.includes('API_KEY')) {
          errorMessageText = 'API key configuration error. Please check your API key in app.json or .env file. Get your key from https://aistudio.google.com/  ';
        } else if (error.message.includes('Network')) {
          errorMessageText = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed to analyze')) {
          errorMessageText = error.message;
        } else {
          errorMessageText = `Sorry, I encountered an error: ${error.message}. Please try again.`;
        }
      }

      // Add haptic feedback for error
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorMessage: Message = {
        id: messages.length + 2,
        text: errorMessageText,
        isUser: false,
        timestamp: new Date(),
        status: "uncertain",
      };

      // Create fade animation for error message
      if (!messageFadeAnims[errorMessage.id]) {
        messageFadeAnims[errorMessage.id] = new Animated.Value(0);
      }
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveConversationMessages(currentConversationId, finalMessages);
      
      // Animate error message
      Animated.timing(messageFadeAnims[errorMessage.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } finally {
      // Fade out loading animation
      Animated.timing(loadingFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => {
        setIsLoading(false);
        setLoadingStage('analyzing');
      });
    }
  };

  const startNewConversation = async () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Create new conversation
    const newConversation = createConversation("New Analysis");
    
    // Add new conversation to the list
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    await saveConversations(updatedConversations);
    
    // Set as current conversation
    setCurrentConversationId(newConversation.id);
    
    // Clear messages and start a new conversation with empty welcome message
    // This will trigger the WelcomeMessage component to be displayed
    const welcomeMessage: Message = {
      id: 1,
      text: "",  // Empty text triggers WelcomeMessage component
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    await saveConversationMessages(newConversation.id, [welcomeMessage]);
    
    // Reset animation for welcome message
    if (messageFadeAnims[welcomeMessage.id]) {
      messageFadeAnims[welcomeMessage.id].setValue(0);
      Animated.timing(messageFadeAnims[welcomeMessage.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setSidebarVisible(false);
  };

  const switchConversation = async (conversationId: number) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Load messages for the selected conversation
    const conversationMessages = await loadConversationMessages(conversationId);
    setMessages(conversationMessages);
    setCurrentConversationId(conversationId);
    
    // Reset animations for the new messages
    Object.keys(messageFadeAnims).forEach(key => {
      messageFadeAnims[key].setValue(0);
      Animated.timing(messageFadeAnims[key], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    setSidebarVisible(false);
  };

  const deleteConversation = async (conversationId: number) => {
    // Show confirmation dialog
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Add haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // Prevent deleting the current conversation if it's the only one
            if (conversations.length <= 1) {
              // If this is the last conversation, create a new one first
              const newConversation = createConversation("New Analysis");
              setConversations([newConversation]);
              setCurrentConversationId(newConversation.id);
              await saveConversations([newConversation]);
              
              // Set default welcome message with empty text to trigger WelcomeMessage component
              const welcomeMessage: Message = {
                id: 1,
                text: "",  // Empty text triggers WelcomeMessage component
                isUser: false,
                timestamp: new Date(),
              };
              
              setMessages([welcomeMessage]);
              await saveConversationMessages(newConversation.id, [welcomeMessage]);
              
              // Reset animation for welcome message
              if (messageFadeAnims[welcomeMessage.id]) {
                messageFadeAnims[welcomeMessage.id].setValue(0);
                Animated.timing(messageFadeAnims[welcomeMessage.id], {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }
            } else {
              // If there are multiple conversations, delete this one
              const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
              setConversations(updatedConversations);
              await saveConversations(updatedConversations);
              
              // If we're deleting the current conversation, switch to the first one
              if (currentConversationId === conversationId) {
                const firstConversation = updatedConversations[0];
                setCurrentConversationId(firstConversation.id);
                const conversationMessages = await loadConversationMessages(firstConversation.id);
                setMessages(conversationMessages);
              }
            }
            
            // Delete the conversation's messages from storage
            try {
              await saveConversationMessages(conversationId, []);
            } catch (error) {
              console.error('Error deleting conversation messages:', error);
            }
            
            // Don't close the sidebar - keep it open so user can see the updated list
          }
        }
      ]
    );
  };

  const deleteAllConversations = async () => {
    // Show confirmation dialog
    Alert.alert(
      "Delete All Conversations",
      "Are you sure you want to delete all conversations? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            // Add haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            
            // Create a new conversation
            const newConversation = createConversation("New Analysis");
            setConversations([newConversation]);
            setCurrentConversationId(newConversation.id);
            await saveConversations([newConversation]);
            
            // Set default welcome message with empty text to trigger WelcomeMessage component
            const welcomeMessage: Message = {
              id: 1,
              text: "",  // Empty text triggers WelcomeMessage component
              isUser: false,
              timestamp: new Date(),
            };
            
            setMessages([welcomeMessage]);
            await saveConversationMessages(newConversation.id, [welcomeMessage]);
            
            // Reset animation for welcome message
            if (messageFadeAnims[welcomeMessage.id]) {
              messageFadeAnims[welcomeMessage.id].setValue(0);
              Animated.timing(messageFadeAnims[welcomeMessage.id], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
            
            // Delete all previous conversations' messages from storage
            for (const conversation of conversations) {
              try {
                await saveConversationMessages(conversation.id, []);
              } catch (error) {
                console.error('Error deleting conversation messages:', error);
              }
            }
            
            // Don't close the sidebar - keep it open so user can see the updated list
          }
        }
      ]
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
        <Text style={{ color: theme.DEFAULT_TEXT }}>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.BACKGROUND }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.HEADER_BACKGROUND} />
      
      {/* Sidebar Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <Animated.View 
          style={[
            styles.sidebarOverlay, 
            { 
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)', 
              opacity: fadeAnim 
            }
          ]}
          onTouchEnd={(e) => {
            // Close sidebar when tapping on overlay (but not on sidebar content)
            if (e.target === e.currentTarget) {
              setSidebarVisible(false);
            }
          }}
        >
          <Animated.View 
            style={[
              styles.sidebar, 
              { 
                backgroundColor: theme.SIDEBAR_BACKGROUND, 
                borderRightColor: theme.SIDEBAR_BORDER, 
                transform: [{ translateX: slideAnim }],
                shadowColor: '#000',
                shadowOffset: { width: -2, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 10,
              }
            ]}
          >
            <View style={[styles.sidebarHeader, { borderBottomColor: theme.SIDEBAR_BORDER, backgroundColor: theme.SIDEBAR_BACKGROUND }]}>
              <Text style={[styles.sidebarTitle, { color: theme.DEFAULT_TEXT }]}>Fake News Detector</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={theme.DEFAULT_TEXT} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.newChatButton} 
              onPress={startNewConversation}
              activeOpacity={0.7}
            >
              <View style={styles.newChatIconContainer}>
                <MaterialIcons name="add" size={28} color="#fff" />
              </View>
              <Text style={styles.newChatText}>New Analysis</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.FAKE }]} 
                onPress={deleteAllConversations}
              >
                <MaterialIcons name="delete-sweep" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Delete All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={[styles.conversationsList, { backgroundColor: theme.SIDEBAR_BACKGROUND }]}>
              {conversations.map((conversation) => (
                <View 
                  key={conversation.id} 
                  style={styles.conversationItemContainer}
                >
                  <TouchableOpacity 
                    style={[
                      styles.conversationItem,
                      currentConversationId === conversation.id && { backgroundColor: theme.HOVER }
                    ]}
                    onPress={() => switchConversation(conversation.id)}
                  >
                    <MaterialIcons name="chat" size={18} color={theme.DEFAULT_TEXT} />
                    <Text style={[styles.conversationTitle, { color: theme.DEFAULT_TEXT }]} numberOfLines={1}>
                      {conversation.title}
                    </Text>
                    <Text style={[styles.conversationTime, { color: theme.TIMESTAMP }]}>
                      {formatTime(conversation.timestamp)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteConversation(conversation.id)}
                  >
                    <MaterialIcons name="delete" size={18} color={theme.FAKE} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            
            <View style={[styles.sidebarFooter, { borderTopColor: theme.SIDEBAR_BORDER, backgroundColor: theme.SIDEBAR_BACKGROUND }]}>
              <Text style={[styles.sidebarFooterText, { color: theme.TIMESTAMP }]}>Powered by Gemini AI</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
      
      {/* Main Content */}
      <View style={[styles.mainContent, { backgroundColor: theme.BACKGROUND }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.HEADER_BACKGROUND, borderBottomColor: theme.HEADER_BORDER }]}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => setSidebarVisible(true)}
          >
            <MaterialIcons name="menu" size={24} color={theme.DEFAULT_TEXT} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.DEFAULT_TEXT }]}>Fake News Detector</Text>
          <TouchableOpacity 
            style={styles.headerAddButton} 
            onPress={startNewConversation}
          >
            <MaterialIcons name="add" size={26} color="#0ea5e9" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          style={[styles.chatContainer, { backgroundColor: theme.BACKGROUND }]}
          contentContainerStyle={[styles.chatContent, { backgroundColor: theme.BACKGROUND }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => {
            // Create a fade animation for this message if it doesn't exist
            if (!messageFadeAnims[message.id]) {
              messageFadeAnims[message.id] = new Animated.Value(0);
              // Start animation for new messages
              Animated.timing(messageFadeAnims[message.id], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
            
            return (
              <Animated.View
                key={message.id}
                style={{
                  opacity: messageFadeAnims[message.id],
                  transform: [{
                    translateY: messageFadeAnims[message.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }]
                }}
              >
                {message.text === "" ? (
                  <WelcomeMessage />
                ) : (
                  <ChatMessage
                    message={message}
                    timestamp={formatTime(message.timestamp)}
                  />
                )}
              </Animated.View>
            );
          })}

          {isLoading && (
            <Animated.View
              style={{
                opacity: loadingFadeAnim,
                transform: [{
                  translateY: loadingFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              <ChatMessage
                message={{
                  id: 'typing',
                  text: '',
                  isUser: false,
                  timestamp: new Date(),
                }}
                isLoading={true}
                loadingStage={loadingStage}
              />
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <InputArea
          onSend={handleSend}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)', // Light blue background
  },
  headerAddButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)', // Light blue background
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 10,
    flexGrow: 1,
  },
  sidebarOverlay: {
    flex: 1,
  },
  sidebar: {
    width: '85%',
    height: '100%',
    paddingTop: 60,
    borderRightWidth: 1,
    maxWidth: 320,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sidebarTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#0ea5e9', // Vibrant blue color
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  newChatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newChatText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 12,
    fontSize: 16,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  conversationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  conversationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
  },
  conversationTitle: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
    fontSize: 16,
  },
  conversationTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginLeft: 8,
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  sidebarFooterText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});