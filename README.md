# Fake News Detector App

This is a React Native application that uses AI to detect fake news. Simply paste a news article and get an instant analysis of its credibility.

## Features

- Real-time fake news detection using Gemini AI
- Color-coded results (green for real, red for fake, orange for uncertain)
- Chat-style interface for easy interaction
- History of previous analyses
- Secure API key management
- Input validation and error handling

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up your API keys

   Create a `.env` file at the project root (copy `.env.example`) and add your API keys:

   ```properties
   GEMINI_API_KEY=your_actual_api_key_here
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

   You can get your:
   - Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Clerk Publishable Key from your [Clerk Dashboard](https://dashboard.clerk.com/)

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

```
.
├── app/                    # Expo Router application screens
│   ├── (auth)/             # Authentication-related screens
│   │   ├── _layout.tsx     # Auth section layout
│   │   ├── sign-in.tsx     # Sign-in screen
│   │   └── sign-up.tsx     # Sign-up screen
│   ├── (home)/             # Home/main application screens
│   │   ├── _layout.tsx     # Main app layout (requires authentication)
│   │   └── index.tsx       # Main home screen
│   ├── components/         # Screen-specific components (moved to src/components)
│   ├── _layout.tsx         # Root layout with ClerkProvider and ThemeProvider
│   ├── index.tsx           # Entry point (redirects based on auth status)
│   └── onboarding.tsx      # Onboarding flow
├── assets/                 # Static assets (images, fonts)
├── docs/                   # Documentation files
├── services/               # API services (Gemini integration)
├── src/
│   ├── components/         # Reusable UI components (moved from app/components)
│   ├── contexts/           # React context providers
│   ├── constants/          # Application constants
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .env.example            # Example environment variables file
├── app.config.js           # Expo configuration with environment variable injection
├── app.json                # Expo app configuration
├── App.tsx                 # Main application component
└── README.md               # Project documentation
```

## Technical Improvements

This project includes several technical improvements:

1. **Security**: 
   - API keys are now loaded from environment variables instead of being stored in app.json
   - Clerk authentication system for secure user management
2. **Error Handling**: Comprehensive error handling for API calls and user input
3. **Performance**: 
   - React.memo for optimized component rendering
   - AsyncStorage for message persistence
4. **Code Quality**: 
   - TypeScript types for better code reliability
   - Constants for consistent styling and values
   - Input validation for user-submitted content
5. **User Experience**:
   - Persistent chat history
   - Clear error messages
   - Responsive design
   - Secure authentication flow

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
