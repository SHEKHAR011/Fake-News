# Project Structure

## Overview

The project follows a standard React Native + Expo Router structure with authentication and proper component separation.

## Directory Structure

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
│   ├── _layout.tsx         # Root layout with ClerkProvider and ThemeProvider
│   ├── index.tsx           # Entry point (redirects based on auth status)
│   └── onboarding.tsx      # Onboarding flow
├── assets/                 # Static assets (images, fonts)
├── docs/                   # Documentation files
├── services/               # API services (Gemini integration)
├── src/
│   ├── components/         # Reusable UI components (moved from app/components)
│   ├── contexts/           # React context providers (ThemeContext, AuthOnboardingContext)
│   ├── constants/          # Application constants (colors, themes, etc.)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions (token cache, etc.)
├── .env.example            # Example environment variables file
├── app.config.js           # Expo configuration with environment variable injection
├── app.json                # Expo app configuration
├── App.tsx                 # Main application component
├── README.md               # Project documentation
└── package.json            # Project dependencies and scripts
```

## Key Changes Made

### Component Location

All reusable components have been moved from `app/components` to `src/components` to avoid conflicts with Expo Router's file-based routing system. This fixes the warning about missing default exports.

### Authentication

Authentication is handled using Clerk:
- `ClerkProvider` is set up in `app/_layout.tsx`
- Environment variables for Clerk are loaded through `app.config.js`
- Token caching is implemented using `expo-secure-store`

### Environment Variables

The application now properly loads sensitive keys from environment variables:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` for authentication
- `GEMINI_API_KEY` for AI integration