import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Message } from '../../src/types/Message';
import ProgressIndicator from './ProgressIndicator';
import TypingIndicator from './TypingIndicator';
import AnalysisVisualization from './AnalysisVisualization';

interface ChatMessageProps {
  message: Message;
  timestamp?: string; 
  isLoading?: boolean;
  loadingStage?: 'analyzing' | 'processing' | 'generating' | 'complete';
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message, timestamp, isLoading = false, loadingStage = 'analyzing' }) => {
  const { theme } = useTheme();
  
  const getTextColor = () => {
    if (message.status === "real") return theme.REAL;
    if (message.status === "fake") return theme.FAKE;
    if (message.status === "uncertain") return theme.UNCERTAIN;
    return theme.DEFAULT_TEXT;
  };

  return (
    <View
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      {!message.isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.AI_AVATAR }]}>
          <MaterialIcons name="fact-check" size={20} color="#fff" />
        </View>
      )}
      <View style={styles.messageContainer}>
        <View style={[
          styles.messageContent, 
          { 
            backgroundColor: message.isUser ? theme.USER_BUBBLE : theme.AI_BUBBLE,
            borderBottomLeftRadius: message.isUser ? 4 : 18,
            borderBottomRightRadius: message.isUser ? 18 : 4,
          }
        ]}>
          {isLoading ? (
            loadingStage ? (
              <ProgressIndicator stage={loadingStage} />
            ) : (
              <TypingIndicator />
            )
          ) : (
            <>
              {!message.isUser && message.status && (
                <AnalysisVisualization status={message.status} />
              )}
              <Text style={[styles.messageText, { color: message.isUser ? '#fff' : getTextColor() }]}>{message.text}</Text>
              {timestamp && (
                <Text style={[styles.timestamp, { color: message.isUser ? '#e0f2fe' : theme.TIMESTAMP }]}>{timestamp}</Text>
              )}
            </>
          )}
        </View>
      </View>
      {message.isUser && (
        <View style={[styles.userAvatar, { backgroundColor: theme.USER_AVATAR }]}>
          <MaterialIcons name="person" size={20} color="#fff" />
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isUser === nextProps.message.isUser &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.loadingStage === nextProps.loadingStage
  );
});

// Add displayName for better debugging and to satisfy eslint react/display-name
ChatMessage.displayName = 'ChatMessage';

const styles = StyleSheet.create({
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '100%',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 24,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 24,
  },
  messageContent: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '90%',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage;