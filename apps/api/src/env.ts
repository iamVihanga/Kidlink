import type { ZodError } from "zod";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DATABASE_URL: z.string(),

  CLIENT_APP_URL: z.string().default("http://localhost:3000"),
  BETTER_AUTH_URL: z.string().default("http://localhost:8000"),

  // Email Configuration (Brevo)
  BREVO_API_KEY: z.string(),
  EMAIL_FROM_NAME: z.string().default("Kidlink"),
  EMAIL_FROM_ADDRESS: z.string().default("noreply@kidlink.com"),
  EMAIL_SANDBOX_MODE: z
    .string()
    .optional()
    .transform((val) => val === "true")
});

export type EnvSchema = z.infer<typeof envSchema>;

let env: EnvSchema;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid Env.");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
