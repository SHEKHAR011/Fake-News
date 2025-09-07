export const LIGHT_THEME = {
  // Message bubbles with enhanced modern design
  USER_BUBBLE: '#0ea5e9', // Vibrant sky blue for user messages
  AI_BUBBLE: '#ffffff',   // Clean white for AI messages
  
  // Status colors - Modern, vibrant palette
  REAL: '#10b981',        // Emerald green (keeping for positive)
  FAKE: '#f43f5e',        // Modern rose for warnings
  UNCERTAIN: '#f59e0b',   // Amber for uncertainties
  DEFAULT_TEXT: '#1e293b', // Modern slate for better readability
  
  // UI colors - Modern, clean palette
  BACKGROUND: '#f1f5f9',     // Light slate background
  SURFACE: '#ffffff',        // Clean white surfaces
  BORDER: '#e2e8f0',         // Subtle borders
  TIMESTAMP: '#94a3b8',      // Muted slate for timestamps
  DISABLED: '#cbd5e1',       // Light slate for disabled states
  HOVER: '#e0f2fe',          // Light blue hover state
  ACCENT: '#38bdf8',         // Accent color for highlights
  
  // Avatar colors
  AI_AVATAR: '#0ea5e9',      // Matching user bubble color
  USER_AVATAR: '#0ea5e9',    // Matching user bubble color
  
  // Header colors
  HEADER_BACKGROUND: '#ffffff',
  HEADER_BORDER: '#e2e8f0',
  
  // Sidebar colors
  SIDEBAR_BACKGROUND: '#ffffff',
  SIDEBAR_BORDER: '#e2e8f0',
  
  // Input area
  INPUT_BORDER: '#cbd5e1',
  INPUT_BACKGROUND: '#ffffff',
  INPUT_PLACEHOLDER: '#94a3b8',
  
  // Gradients for visual interest
  GRADIENT_START: '#0ea5e9',
  GRADIENT_END: '#38bdf8',
};

export const DARK_THEME = {
  // Message bubbles with enhanced modern design
  USER_BUBBLE: '#0ea5e9', // Vibrant sky blue for user messages
  AI_BUBBLE: '#1e293b',   // Dark slate for AI messages
  
  // Status colors - Modern, vibrant palette for dark mode
  REAL: '#34d399',        // Softer green for dark mode
  FAKE: '#fb7185',        // Softer rose for dark mode
  UNCERTAIN: '#fbbf24',   // Softer amber for dark mode
  DEFAULT_TEXT: '#f1f5f9', // Light slate for better readability in dark mode
  
  // UI colors - Modern dark palette
  BACKGROUND: '#0f172a',     // Dark slate background
  SURFACE: '#1e293b',        // Darker surface
  BORDER: '#334155',         // Subtle borders for dark mode
  TIMESTAMP: '#94a3b8',      // Muted slate for timestamps in dark mode
  DISABLED: '#475569',       // Darker slate for disabled states
  HOVER: '#1e293b',          // Hover states for dark mode
  ACCENT: '#38bdf8',         // Accent color for highlights
  
  // Avatar colors
  AI_AVATAR: '#0ea5e9',      // Matching user bubble color
  USER_AVATAR: '#0ea5e9',    // Matching user bubble color
  
  // Header colors
  HEADER_BACKGROUND: '#1e293b',
  HEADER_BORDER: '#334155',
  
  // Sidebar colors
  SIDEBAR_BACKGROUND: '#1e293b',
  SIDEBAR_BORDER: '#334155',
  
  // Input area
  INPUT_BORDER: '#334155',
  INPUT_BACKGROUND: '#1e293b',
  INPUT_PLACEHOLDER: '#94a3b8',
  
  // Gradients for visual interest
  GRADIENT_START: '#0ea5e9',
  GRADIENT_END: '#38bdf8',
};

export type Theme = typeof LIGHT_THEME;