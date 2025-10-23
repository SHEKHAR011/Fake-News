const fs = require('fs');
const path = require('path');

// Load .env into process.env for build-time injection
require('dotenv').config();

const appJsonPath = path.resolve(process.cwd(), 'app.json');
let appJson = {};
if (fs.existsSync(appJsonPath)) {
  appJson = require(appJsonPath);
}

appJson.expo = appJson.expo || {};
appJson.expo.extra = appJson.expo.extra || {};

// Inject GEMINI_API_KEY from process.env into expo.extra for runtime access
if (process.env.GEMINI_API_KEY) {
  appJson.expo.extra.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
}

// Inject CLERK_PUBLISHABLE_KEY from process.env into expo.extra for runtime access
if (process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  appJson.expo.extra.CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

module.exports = appJson;
