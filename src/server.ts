import Fastify from "fastify";
import { routeQuestion } from "./agent/router.js";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

app.post("/ask", async (request, reply) => {
  const body = request.body as { question?: unknown } | undefined;
  const question = body?.question;

  if (typeof question !== "string" || question.trim() === "") {
    reply.code(400);
    return { error: "Body must include a non-empty 'question' string." };
  }

  try {
    const { tool, answer } = await routeQuestion(question);
    return { tool, answer };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { error: "Failed to answer the question. The model call may have failed — try again." };
  }
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
