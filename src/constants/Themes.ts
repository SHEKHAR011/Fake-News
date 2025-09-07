export const LIGHT_THEME = {
  // Message bubbles
  USER_BUBBLE: '#10a37f', // More subtle green for user messages
  AI_BUBBLE: '#ffffff',   // Clean white for AI messages
  
  // Status colors - Softer, more professional tones
  REAL: '#10b981',        // Emerald green
  FAKE: '#ef4444',        // Red (keeping the same for clear indication)
  UNCERTAIN: '#f59e0b',   // Amber for warnings
  DEFAULT_TEXT: '#374151', // Darker gray for better readability
  
  // UI colors - Softer, more harmonious palette
  BACKGROUND: '#f9fafb',     // Softer background
  SURFACE: '#ffffff',        // Clean white surfaces
  BORDER: '#e5e7eb',         // Subtle borders
  TIMESTAMP: '#9ca3af',      // Muted gray for timestamps
  DISABLED: '#d1d5db',       // Light gray for disabled states
  HOVER: '#f3f4f6',          // Hover states
  
  // Avatar colors
  AI_AVATAR: '#10b981',      // Matching the real status color
  USER_AVATAR: '#10a37f',    // Matching user bubble color
  
  // Header colors
  HEADER_BACKGROUND: '#ffffff',
  HEADER_BORDER: '#e5e7eb',
  
  // Sidebar colors
  SIDEBAR_BACKGROUND: '#ffffff',
  SIDEBAR_BORDER: '#e5e7eb',
  
  // Input area
  INPUT_BORDER: '#e5e7eb',
  INPUT_BACKGROUND: '#ffffff',
  INPUT_PLACEHOLDER: '#9ca3af',
};

export const DARK_THEME = {
  // Message bubbles
  USER_BUBBLE: '#10a37f', // Keeping the same for brand consistency
  AI_BUBBLE: '#2d3748',   // Dark gray for AI messages
  
  // Status colors
  REAL: '#34d399',        // Softer green for dark mode
  FAKE: '#f87171',        // Softer red for dark mode
  UNCERTAIN: '#fbbf24',   // Softer amber for dark mode
  DEFAULT_TEXT: '#e2e8f0', // Light gray for better readability in dark mode
  
  // UI colors
  BACKGROUND: '#1a202c',     // Dark background
  SURFACE: '#2d3748',        // Darker surface
  BORDER: '#4a5568',         // Subtle borders for dark mode
  TIMESTAMP: '#a0aec0',      // Muted gray for timestamps in dark mode
  DISABLED: '#718096',       // Darker gray for disabled states
  HOVER: '#4a5568',          // Hover states for dark mode
  
  // Avatar colors
  AI_AVATAR: '#34d399',      // Matching the real status color
  USER_AVATAR: '#10a37f',    // Matching user bubble color
  
  // Header colors
  HEADER_BACKGROUND: '#2d3748',
  HEADER_BORDER: '#4a5568',
  
  // Sidebar colors
  SIDEBAR_BACKGROUND: '#2d3748',
  SIDEBAR_BORDER: '#4a5568',
  
  // Input area
  INPUT_BORDER: '#4a5568',
  INPUT_BACKGROUND: '#2d3748',
  INPUT_PLACEHOLDER: '#a0aec0',
};

export type Theme = typeof LIGHT_THEME;