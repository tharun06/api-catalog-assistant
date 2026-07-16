# Failure Analysis

Most of the issues happened around the LLM call. The deterministic engine stayed reliable, while the model layer caused most of the unexpected behavior.

Some model aliases returned 404, 429, or 503 errors. I pinned a stable model, but depending on one hardcoded model is still risky. A better approach would be to keep a fallback list and switch models when one fails. Since all provider logic is already kept in one file, this would be easy to add.

The model does not generate facts, but it still selects the tool and arguments, so routing can vary between runs. For the SMS-on-shipment question, it returned "search service" in one run and "search" in another. I fixed the matching issue by splitting keywords by whitespace, but the routing layer is still not fully deterministic.

The model may also route requests for APIs that do not exist. Questions about a billing API or search service were still sent to real tools. The findApi and hasSpec checks prevent incorrect answers by confirming that the API exists and has a spec before running the tool. The system prompt alone is not enough.

Two rubric checks are limited by the available sample data. SEC-03 only checks whether server URLs use HTTPS because the samples do not contain hardcoded secrets. CMP-01 only checks documented 4xx responses because none of the samples include 5xx responses. These are not bugs, but they show the current coverage limits.

For scenarios S09 and S10, the system uses keyword search and returns possible matches instead of asking a follow-up question. A better version would detect low-confidence routing and ask, "Did you mean one of these?" That would be the first improvement I would add.

The assessment engine itself remains reliable. It returns the same score for the same spec, has no model or network dependency, and every result can be traced back to the exact rule and YAML line. That is why most of the important logic stays in deterministic code.
