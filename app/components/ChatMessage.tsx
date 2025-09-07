import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../src/constants/AppConstants';
import { Message } from '../../src/types/Message';
import TypingIndicator from './TypingIndicator';

interface ChatMessageProps {
  message: Message;
  timestamp?: string; 
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message, timestamp, isLoading = false }) => {
  
  const getTextColor = () => {
    if (message.status === "real") return styles.realText;
    if (message.status === "fake") return styles.fakeText;
    if (message.status === "uncertain") return styles.uncertainText;
    return styles.defaultText;
  };

  return (
    <View
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      {!message.isUser && (
        <View style={styles.avatar}>
          <MaterialIcons name="fact-check" size={20} color="#fff" />
        </View>
      )}
      <View style={styles.messageContent}>
        {isLoading ? (
          <TypingIndicator />
        ) : (
          <>
            <Text style={[styles.messageText, getTextColor()]}>{message.text}</Text>
            {timestamp && (
              <Text style={styles.timestamp}>{timestamp}</Text>
            )}
          </>
        )}
      </View>
      {message.isUser && (
        <View style={styles.userAvatar}>
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
    prevProps.isLoading === nextProps.isLoading
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
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.BORDER_RADIUS,
    backgroundColor: COLORS.AI_AVATAR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.MARGIN,
  },
  userAvatar: {
    width: SIZES.AVATAR_SIZE,
    height: SIZES.AVATAR_SIZE,
    borderRadius: SIZES.BORDER_RADIUS,
    backgroundColor: COLORS.USER_AVATAR,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.MARGIN,
  },
  messageContent: {
    flex: 1,
    backgroundColor: COLORS.AI_BUBBLE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
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
  defaultText: {
    color: COLORS.DEFAULT_TEXT,
  },
  realText: {
    color: COLORS.REAL,
  },
  fakeText: {
    color: COLORS.FAKE,
  },
  uncertainText: {
    color: COLORS.UNCERTAIN,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: COLORS.TIMESTAMP,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default ChatMessage;
