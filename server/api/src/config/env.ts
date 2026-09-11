/**
 * Environment configuration loader.
 * All environment variables are read here — nowhere else in the codebase.
 * This ensures a single, type-safe source of truth for runtime config.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: "${key}". ` +
        `Check your .env file or deployment environment.`
    );
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

// ─── Validate all required vars early (fail-fast) ─────────────────────────
const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

const missingVars = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error('\n❌  Missing required environment variables:');
  missingVars.forEach((key) => console.error(`     - ${key}`));
  console.error('\nCopy .env.example to .env and fill in all required values.\n');
  process.exit(1);
}

// Warn in dev if using a placeholder secret
const jwtSecret = process.env['JWT_SECRET']!;
if (['fallback_secret', 'your_very_long_random_secret_here', 'changeme'].includes(jwtSecret)) {
  console.warn('\n⚠️   JWT_SECRET is a placeholder. Use a strong random secret in production.\n');
}

export const env = {
  PORT:           parseInt(optionalEnv('PORT', '5000'), 10),
  NODE_ENV:       optionalEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  MONGODB_URI:    requireEnv('MONGODB_URI'),
  JWT_SECRET:     jwtSecret,
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '30d'),
  CLIENT_URL:     optionalEnv('CLIENT_URL', 'http://localhost:3000'),
  // Email (optional — only needed if SMTP is configured)
  SMTP_HOST:                process.env['SMTP_HOST'],
  SMTP_PORT:                process.env['SMTP_PORT'],
  SMTP_USER:                process.env['SMTP_USER'],
  SMTP_PASS:                process.env['SMTP_PASS'],
  SMTP_FROM:                process.env['SMTP_FROM'],
  CONTACT_EMAIL_RECIPIENT:  process.env['CONTACT_EMAIL_RECIPIENT'],
} as const;
