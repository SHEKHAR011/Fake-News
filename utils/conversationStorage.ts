import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../src/types/Message';

const CONVERSATIONS_STORAGE_KEY = 'fake_news_detector_conversations';

/**
 * Conversation type definition
 */
export type Conversation = {
  id: number;
  title: string;
  timestamp: Date;
};

/**
 * Save conversations to AsyncStorage
 * @param {Array} conversations - Array of conversation objects
 */
export const saveConversations = async (conversations: Conversation[]) => {
  try {
    const jsonValue = JSON.stringify(conversations);
    await AsyncStorage.setItem(CONVERSATIONS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

/**
 * Load conversations from AsyncStorage
 * @returns {Array} - Array of conversation objects
 */
export const loadConversations = async (): Promise<Conversation[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (jsonValue != null) {
      const parsedConversations = JSON.parse(jsonValue);
      // Convert timestamp strings back to Date objects
      return parsedConversations.map((conversation: any) => ({
        ...conversation,
        timestamp: conversation.timestamp ? new Date(conversation.timestamp) : new Date(),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

/**
 * Create a new conversation
 * @param {string} title - Title of the conversation
 * @returns {Object} - New conversation object
 */
export const createConversation = (title = "New Analysis"): Conversation => {
  return {
    id: Date.now(), // Use timestamp as ID for uniqueness
    title,
    timestamp: new Date(),
  };
};

/**
 * Save messages for a specific conversation
 * @param {number} conversationId - ID of the conversation
 * @param {Array} messages - Array of message objects
 */
export const saveConversationMessages = async (conversationId: number, messages: Message[]) => {
  try {
    const key = `conversation_${conversationId}_messages`;
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving conversation messages:', error);
  }
};

/**
 * Load messages for a specific conversation
 * @param {number} conversationId - ID of the conversation
 * @returns {Array} - Array of message objects
 */
export const loadConversationMessages = async (conversationId: number): Promise<Message[]> => {
  try {
    const key = `conversation_${conversationId}_messages`;
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      const parsedMessages = JSON.parse(jsonValue);
      // Convert timestamp strings back to Date objects
      return parsedMessages.map((message: any) => ({
        ...message,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading conversation messages:', error);
    return [];
  }
};

/**
 * Delete a conversation and its messages
 * @param {number} conversationId - ID of the conversation to delete
 */
export const deleteConversation = async (conversationId: number) => {
  try {
    // Remove conversation from conversations list
    const conversations = await loadConversations();
    const updatedConversations = conversations.filter((conv: Conversation) => conv.id !== conversationId);
    await saveConversations(updatedConversations);
    
    // Remove conversation messages
    const key = `conversation_${conversationId}_messages`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};