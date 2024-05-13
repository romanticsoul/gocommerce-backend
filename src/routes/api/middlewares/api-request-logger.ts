import { createMiddleware } from "hono/factory";

export const apiRequestLogger = createMiddleware(async (c, next) => {
  await next();
  // TODO: Реализовать сохранение запросов в БД (табл. "api_requests")
});
