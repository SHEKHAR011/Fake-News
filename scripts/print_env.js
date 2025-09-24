const cfg = require('../app.config.js');

const extra = cfg.expo && cfg.expo.extra ? cfg.expo.extra : {};
const key = extra.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!key) {
  console.log('GEMINI_API_KEY not found in app.config.js or process.env');
  process.exit(1);
}

try {
  const masked = `${key.slice(0,6)}...${key.slice(-4)}`;
  console.log('GEMINI_API_KEY found (masked):', masked);
} catch {
  console.log('GEMINI_API_KEY found');
}
