# Decisions

The main decisions I made while building the solution.

## Reading the problem

- The requirement had three parts: answer questions about the catalog, check spec quality against the rubric, and handle unclear requests safely.
- Spec assessment is fully rule-based. The rubric is 12 checks with fixed weights, so a TypeScript function can read the YAML, run the checks, and return a score. No model needed.
- The LLM is only used to understand the question and decide which tool to call with what arguments.
- So I split the system into a deterministic engine for data, checks, and calculations, and a small LLM layer for routing.

## The LLM only picks the tool

- The model has 10 tools: dependency checks, production APIs, spec scoring, security issues, keyword search, and so on.
- It reads the question and selects the tool. It does not create facts or read the catalog data directly.
- This avoids the model missing, changing, or inventing API names, counts, dependencies, or scores.
- The model routes the request; the TypeScript code produces the exact result.

## No second model call

- The common setup uses one call to pick the tool and another to turn the result into text. I dropped the second call.
- After the tool returns, my code builds the response with simple per-tool formatting.
- This reduces cost, improves response time, and stops the model from changing the result.
- The wording is more fixed, but that's fine for an internal catalog tool.

## Guardrails

- The model may still route a request for an API that doesn't exist, so I added two layers.
- The **system prompt** tells it not to invent APIs or force unrelated tool calls. This reduces mistakes but isn't a guarantee.
- Before running any name-based tool, the router checks that the API exists and that a spec file is available. If either fails, the code returns a clear message and doesn't run the tool.
- This is why search results show "(no spec on file)". The API may exist, but there may be nothing to assess.

## What I did not use

- No LangChain, MCP, vector database, or RAG.
- With ~60 APIs and 10 specs, the tool list fits in one prompt, the data fits in memory, and keyword search over names and tags is enough.
- Adding those now would add complexity without much value. RAG and MCP may make sense as the system grows, which is covered in SCALING.md.

## Provider setup

- I used Google Gemini through the @google/genai SDK, with all provider-specific code kept in one client file.
- The rest of the app doesn't depend on Gemini directly, so changing providers is mainly a one-file change.
- This matters because the provider was the least stable part of the build. More in FAILURE_ANALYSIS.md.

## Dependency direction

- The agent uses the engine; the engine never depends on the agent or the LLM.
- The engine doesn't know an LLM exists, which makes the core logic easier to test, verify, and trust.
