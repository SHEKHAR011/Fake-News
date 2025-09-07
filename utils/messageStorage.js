import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGE_STORAGE_KEY = 'fake_news_detector_messages';

/**
 * Save messages to AsyncStorage
 * @param {Array} messages - Array of message objects
 */
export const saveMessages = async (messages) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(MESSAGE_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

/**
 * Load messages from AsyncStorage
 * @returns {Array} - Array of message objects
 */
export const loadMessages = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGE_STORAGE_KEY);
    if (jsonValue != null) {
      const parsedMessages = JSON.parse(jsonValue);
      // Convert timestamp strings back to Date objects
      return parsedMessages.map(message => ({
        ...message,
        timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};

/**
 * Clear all messages from AsyncStorage
 */
export const clearMessages = async () => {
  try {
    await AsyncStorage.removeItem(MESSAGE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};