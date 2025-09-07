/**
 * Validates news content input
 * @param {string} text - The news content to validate
 * @returns {{isValid: boolean, message: string}} - Validation result with isValid flag and message
 */
export const validateNewsContent = (text: string): {isValid: boolean, message: string} => {
  // Check if text is provided
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      message: 'Please provide news content to analyze.'
    };
  }

  // Trim whitespace
  const trimmedText = text.trim();

  // Check minimum length
  if (trimmedText.length < 10) {
    return {
      isValid: false,
      message: 'News content is too short. Please provide more details (at least 10 characters).'
    };
  }

  // Check maximum length
  if (trimmedText.length > 1000) {
    return {
      isValid: false,
      message: 'News content is too long. Please limit to 1000 characters.'
    };
  }

  // Check for at least a few words
  const wordCount = trimmedText.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 3) {
    return {
      isValid: false,
      message: 'Please provide more substantial content with at least 3 words.'
    };
  }

  // Content seems valid
  return {
    isValid: true,
    message: ''
  };
};