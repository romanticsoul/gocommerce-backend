import { createMiddleware } from "hono/factory";

export const apiKeyVerification = createMiddleware(async (c, next) => {
  const apiKey = c.req.header("x-api-key");
  const projectId = c.req.header("x-project-id");
  console.log(projectId, apiKey);
  // TODO: Реализовать проверку API ключа в БД (табл. "api_keys")
  await next();
});
