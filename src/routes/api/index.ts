import { apiKeyVerification } from "./middlewares/api-key-verification";
import { Hono } from "hono";
import { v1 } from "./v1";

export const api = new Hono().basePath("/api");
api.use(apiKeyVerification);
api.route("/", v1);
