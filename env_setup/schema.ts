import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  PORT: z.string(),
  NOTIFICATIONS_TELEGRAM_ENABLED: z.string(),
  NOTIFICATIONS_TELEGRAM_BOT_TOKEN: z.string(),
  LOCALE: z.string(),
  TIMEZONE: z.string(),
});
