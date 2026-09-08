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

export const env = {
  PORT: parseInt(optionalEnv('PORT', '4000'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development') as
    | 'development'
    | 'production'
    | 'test',
  ALLOWED_ORIGINS: optionalEnv(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:3001'
  ).split(','),
  // Database — not used in Phase 0, but reserved
  MONGODB_URI: process.env['MONGODB_URI'],
} as const;

// Validate critical env vars in production
if (env.NODE_ENV === 'production') {
  requireEnv('MONGODB_URI');
}
