import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { analyzeNewsWithGemini } from '../services/geminiService';
import { Message } from '../src/types/Message';
import { formatTime } from '../utils/helpers';
import { validateNewsContent } from '../utils/validators';
import { Conversation, createConversation, loadConversations, saveConversations, loadConversationMessages, saveConversationMessages } from '../utils/conversationStorage';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
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

  // Load messages and conversations from storage on component mount
  useEffect(() => {
    const initializeApp = async () => {
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
      } else {
        // Create first conversation
        const newConversation = createConversation("New Analysis");
        setConversations([newConversation]);
        setCurrentConversationId(newConversation.id);
        await saveConversations([newConversation]);
        
        // Set default welcome message
        const welcomeMessage: Message = {
          id: 1,
          text: "Hello! I'm your Fake News Detector. Send me any news content and I'll analyze its credibility for you.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        await saveConversationMessages(newConversation.id, [welcomeMessage]);
      }
    };

    initializeApp();
  }, []);

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
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (isLoading || currentConversationId === null) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveConversationMessages(currentConversationId, newMessages);
    setIsLoading(true);
    setLoadingStage('analyzing');

    try {
      // Simulate stage progression for better UX
      setTimeout(() => setLoadingStage('processing'), 1000);
      setTimeout(() => setLoadingStage('generating'), 2000);
      
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
        status,
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveConversationMessages(currentConversationId, finalMessages);
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

      const errorMessage: Message = {
        id: messages.length + 2,
        text: errorMessageText,
        isUser: false,
        timestamp: new Date(),
        status: "uncertain",
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveConversationMessages(currentConversationId, finalMessages);
    } finally {
      setIsLoading(false);
      setLoadingStage('analyzing');
    }
  };

  const startNewConversation = async () => {
    // Create new conversation
    const newConversation = createConversation("New Analysis");
    
    // Add new conversation to the list
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    await saveConversations(updatedConversations);
    
    // Set as current conversation
    setCurrentConversationId(newConversation.id);
    
    // Clear messages and start a new conversation
    const welcomeMessage: Message = {
      id: 1,
      text: "Hello! I'm your Fake News Detector. Send me any news content and I'll analyze its credibility for you.",
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    await saveConversationMessages(newConversation.id, [welcomeMessage]);
    setSidebarVisible(false);
  };

  const switchConversation = async (conversationId: number) => {
    // Load messages for the selected conversation
    const conversationMessages = await loadConversationMessages(conversationId);
    setMessages(conversationMessages);
    setCurrentConversationId(conversationId);
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
            // Prevent deleting the current conversation if it's the only one
            if (conversations.length <= 1) {
              // If this is the last conversation, create a new one first
              const newConversation = createConversation("New Analysis");
              setConversations([newConversation]);
              setCurrentConversationId(newConversation.id);
              await saveConversations([newConversation]);
              
              // Set default welcome message
              const welcomeMessage: Message = {
                id: 1,
                text: "Hello! I'm your Fake News Detector. Send me any news content and I'll analyze its credibility for you.",
                isUser: false,
                timestamp: new Date(),
              };
              
              setMessages([welcomeMessage]);
              await saveConversationMessages(newConversation.id, [welcomeMessage]);
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
            // Create a new conversation
            const newConversation = createConversation("New Analysis");
            setConversations([newConversation]);
            setCurrentConversationId(newConversation.id);
            await saveConversations([newConversation]);
            
            // Set default welcome message
            const welcomeMessage: Message = {
              id: 1,
              text: "Hello! I'm your Fake News Detector. Send me any news content and I'll analyze its credibility for you.",
              isUser: false,
              timestamp: new Date(),
            };
            
            setMessages([welcomeMessage]);
            await saveConversationMessages(newConversation.id, [welcomeMessage]);
            
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
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={[styles.sidebarOverlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.sidebar, { backgroundColor: theme.SIDEBAR_BACKGROUND, borderRightColor: theme.SIDEBAR_BORDER }]}>
            <View style={[styles.sidebarHeader, { borderBottomColor: theme.SIDEBAR_BORDER, backgroundColor: theme.SIDEBAR_BACKGROUND }]}>
              <Text style={[styles.sidebarTitle, { color: theme.DEFAULT_TEXT }]}>Fake News Detector</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={20} color={theme.DEFAULT_TEXT} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={[styles.newChatButton, { backgroundColor: theme.USER_BUBBLE }]} onPress={startNewConversation}>
              <MaterialIcons name="add" size={20} color="#fff" />
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
          </View>
        </View>
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
            style={styles.menuButton} 
            onPress={startNewConversation}
          >
            <MaterialIcons name="add" size={24} color={theme.DEFAULT_TEXT} />
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
              loadingStage={loadingStage}
            />
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
  },
  menuButton: {
    padding: 8,
    borderRadius: 6,
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
    width: '80%',
    height: '100%',
    paddingTop: 60,
    borderRightWidth: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sidebarTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  newChatText: {
    color: '#fff',
    fontFamily: 'Inter_500Medium',
    marginLeft: 10,
    fontSize: 16,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: 'Inter_500Medium',
    marginLeft: 8,
    fontSize: 14,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  conversationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  conversationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
  },
  conversationTitle: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    marginLeft: 12,
    fontSize: 15,
  },
  conversationTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  sidebarFooterText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});