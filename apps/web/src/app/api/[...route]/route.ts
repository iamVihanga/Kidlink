// apps/web/app/api/[...route]/route.ts
import { handle } from "hono/vercel";

// Import your existing Hono app
import createApp from "../../../../../api/src/lib/create-app";
import configureOpenAPI from "../../../../../api/src/lib/open-api-config";
import { registerRoutes } from "../../../../../api/src/routes/registry";

const app = registerRoutes(createApp());
configureOpenAPI(app);

const handler = handle(app);

// Export for all HTTP methods
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const PUT = handler;
export const OPTIONS = handler;
