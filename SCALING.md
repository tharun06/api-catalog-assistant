# Scaling

The main question is what changes when the system grows from 60 APIs and 10 specs to thousands of APIs and hundreds of specs. The deterministic core would stay mostly the same. The main changes would be in storage, performance, and tool selection.

Right now, the catalog and specs are loaded from JSON into memory. At a larger scale, they should move to a database such as Postgres, with indexed queries instead of array filters. Dependency lookups may also need a graph database or precomputed cached results, especially for large transitive dependency searches.

Spec scoring should move out of the request flow. Each spec can be scored when it is uploaded or changed, and the result can be stored using a hash. This avoids recalculating the same scores every time someone asks to rank the specs.

The current approach of giving all tools to the model in one prompt will not scale. With hundreds of tools or thousands of API names, retrieval should happen first. The system can search API names, tags, and descriptions, then give the model only a small set of relevant choices. This is where RAG becomes useful.

The deterministic engine itself would need very little change. The same 12 rubric rules can handle 10 specs or 10,000 specs. The work may need job queues and caching, but the business logic stays the same. Because the model does not produce the facts, scaling is mainly an infrastructure problem instead of a correctness problem.

At a larger scale, I would also add model and provider fallback, cache repeated routing results, expose the tools through MCP, and return structured data for tables, graphs, and score breakdowns. The existing 10 scenarios should also become part of a regression test suite so prompt or rule changes do not silently break working behavior.

The main idea is to keep correctness in deterministic code and use the model only for understanding the request and selecting the right tool. As the system grows, the main additions are a database, job queue, retrieval layer, provider fallback, and structured responses.
