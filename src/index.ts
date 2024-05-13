import { Hono } from "hono";
import { db } from "../drizzle/drizzle";
import { prisma } from "../prisma/prisma";
import { api } from "./routes/api";

const app = new Hono();
app.route("/", api);

app.get("/", async (c) => {
  // const start1 = performance.now();
  // const drizzleQ = await db.query.projects.findFirst();
  // const end1 = performance.now();
  // const time1 = end1 - start1;

  // const start2 = performance.now();
  // const prismaQ = await prisma.projects.findFirst();
  // const end2 = performance.now();
  // const time2 = end2 - start2;

  return c.text("Hello, World!");
  // return c.json({ time1, drizzleQ });
});

export default app;
