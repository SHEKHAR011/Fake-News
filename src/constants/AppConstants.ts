// Color constants
export const COLORS = {
  // Message bubbles
  USER_BUBBLE: '#1e90ff',
  AI_BUBBLE: '#fff',
  
  // Status colors
  REAL: '#19c37d',
  FAKE: '#ef4444',
  UNCERTAIN: '#f97316',
  DEFAULT_TEXT: '#343541',
  
  // UI colors
  BACKGROUND: '#f7f7f8',
  BORDER: '#e5e5e5',
  TIMESTAMP: '#9ca3af',
  DISABLED: '#cbd5e1',
  
  // Avatar colors
  AI_AVATAR: '#19c37d',
  USER_AVATAR: '#1e90ff',
};

// Size constants
export const SIZES = {
  AVATAR_SIZE: 36,
  BORDER_RADIUS: 18,
  PADDING: 16,
  MARGIN: 12,
  INPUT_BORDER_RADIUS: 20,
  SEND_BUTTON_SIZE: 44,
};

// Status constants
export const STATUS = {
  REAL: 'real',
  FAKE: 'fake',
  UNCERTAIN: 'uncertain',
} as const;

// Model constants
export const MODELS = {
  GEMINI: 'gemini-2.5-flash',
};