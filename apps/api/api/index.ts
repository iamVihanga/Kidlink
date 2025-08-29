// apps/api/api/index.ts
import { handle } from "hono/vercel";
import createApp from "../src/lib/create-app";
import configureOpenAPI from "../src/lib/open-api-config";
import { registerRoutes } from "../src/routes/registry";

const app = registerRoutes(createApp());
configureOpenAPI(app);

export default handle(app);
