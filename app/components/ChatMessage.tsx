import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Message } from '../../src/types/Message';
import ProgressIndicator from './ProgressIndicator';
import TypingIndicator from './TypingIndicator';

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
      <View style={[styles.messageContent, { backgroundColor: theme.AI_BUBBLE }]}>
        {isLoading ? (
          loadingStage ? (
            <ProgressIndicator stage={loadingStage} />
          ) : (
            <TypingIndicator />
          )
        ) : (
          <>
            <Text style={[styles.messageText, { color: getTextColor() }]}>{message.text}</Text>
            {timestamp && (
              <Text style={[styles.timestamp, { color: theme.TIMESTAMP }]}>{timestamp}</Text>
            )}
          </>
        )}
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  messageContent: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage;