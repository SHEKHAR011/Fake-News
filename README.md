# Fake News Detector

A React Native (Expo) app that analyzes news/article text with Google Gemini and returns a credibility assessment in a chat-style UI.

## Key Features

- AI-powered analysis using Google Gemini
- Chat-style conversation UX with persisted history
- Color-coded credibility results (real / fake / uncertain)
- Authentication via Clerk
- Theme support (light/dark)
- Input validation and defensive error handling

## Tech Stack

- **Expo + React Native** (Expo Router for file-based navigation)
- **TypeScript**
- **Clerk** for auth (`@clerk/clerk-expo`)
- **Google Generative AI** SDK (`@google/generative-ai`)
- **AsyncStorage** for local persistence

## Screenshots

<p float="left">
  <img src="assets/Images/IMG_3321-2.png" width="240" style="margin-right: 20px;" />
  <img src="assets/Images/IMG_3320.PNG" width="240" style="margin-right: 20px;" />
  <img src="assets/Images/IMG_3322-2.png" width="240" />
</p>

## Preview Video

[<img src="assets/Images/IMG_3320.PNG" width="240" />](https://drive.google.com/file/d/15BwVCjkFsSeAkPvV4PykfWNYdrGNPfSS/view?usp=sharing)

[Watch the preview video](https://drive.google.com/file/d/15BwVCjkFsSeAkPvV4PykfWNYdrGNPfSS/view?usp=sharing)


## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- One of the following package managers:
  - **Bun** (recommended for this repo’s workflows)
  - npm

### 1) Install dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 2) Configure environment variables

Copy the example file and fill in real keys:

```bash
copy .env.example .env
```

Required variables:

```properties
GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Where to get keys:

- Gemini API key: https://aistudio.google.com/
- Clerk publishable key: https://dashboard.clerk.com/

### 3) Start the app

Using npm:

```bash
npm run start
```

Using Expo directly:

```bash
npx expo start
```

Then open it using:

- Expo Go (quick testing)
- Android emulator / iOS simulator
- Development build (recommended for full native behavior)

## Useful Scripts

- Start dev server: `npm run start`
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`
- Lint: `npm run lint`

## Project Structure

```
.
├── app/                      # Expo Router routes
│   ├── (auth)/               # Auth routes (sign-in/up)
│   ├── (home)/               # Authenticated routes (main app)
│   ├── screens/              # Screen implementations used by routes
│   ├── _layout.tsx           # Root navigator/providers integration
│   ├── index.tsx             # Entry route (redirects based on auth)
│   └── onboarding.tsx        # Onboarding flow
├── src/
│   ├── components/           # Reusable UI components
│   ├── contexts/             # Theme/auth/onboarding contexts
│   ├── constants/            # App constants + theme tokens
│   ├── types/                # Shared TS types
│   └── utils/                # Utility helpers (including Clerk token cache)
├── services/                 # Gemini integration
├── assets/                   # Fonts/images
├── app.config.js             # Expo config and env injection
├── App.tsx                   # App bootstrap (fonts/splash coordination)
└── README.md
```

## Notes

- This project uses Expo Router; navigation is defined by the file structure under `app/`.
- Secrets should never be committed. Keep `.env` local.

