import { Hono } from "hono";

export const v1 = new Hono().basePath("/v1");
v1.get("/", (c) => c.text("Hello, v1!"));
