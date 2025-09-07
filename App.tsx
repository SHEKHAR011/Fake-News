import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import HomeScreen from './app/index';

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}