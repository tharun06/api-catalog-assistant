# Take-Home: API Catalog Assistant

Build a system that helps developers interact intelligently with an API catalog.

You have a starter Fastify server and a `data/` directory with everything the assistant should reason over. 

## The problem

You are given:

1. **An API catalog** — [`data/catalog.json`](data/catalog.json), 60 synthetic APIs with fields: `name`, `domain`, `status`, `tags`, `endpoints`, `onboardedDate`, `owner`, `dependencies`, `protocol`, `gateway`.
2. **10 OpenAPI specs** — [`data/specs/`](data/specs/), of varying quality. Some are well documented; some are missing descriptions, have inconsistent naming, or lack security schemes. Each file is named after the API it describes (e.g. `payments-api.yaml`), so it cross-references the catalog.
3. **A quality rubric** — [`data/rubric.json`](data/rubric.json), 12 rules across 4 categories, each with a severity weight.
4. **10 user scenarios** — [`data/scenarios.json`](data/scenarios.json), things a developer might ask or want to do with this catalog.


## What the solution should do

1. **Answer natural-language questions** about the catalog — e.g. *"Which payment APIs are production-ready?"*
2. **Assess the quality of a spec** against the rubric and suggest concrete improvements.
3. **Handle ambiguous or underspecified requests** gracefully.


## Deliverables

1. **A working system** — runnable, with instructions.
2. **Results against the 10 scenarios**
3. **A decision log** — what you built, what alternatives you considered, and why you chose this.
4. **A failure analysis** — where your system breaks, why, and what you'd do about it.
5. **A scaling plan** — how do you scale with thousands of APIs and hundreds of specs?


## Submission

- **Time limit:** This take-home must be completed within **1 day** of receipt.
- **How to submit:** Push your solution to a public GitHub repository and share the link.

---

## How to run

You need Node 18 or newer.

1. Install dependencies:

   ```
   npm install
   ```

2. Add your Google Gemini API key. Copy the example file and fill in the key:

   ```
   cp .env.example .env
   ```

   Then open `.env` and set `GOOGLE_API_KEY` to your key.

3. Start the server:

   ```
   npm run start
   ```

   It runs on port 3000. Check it's up:

   ```
   curl http://localhost:3000/health
   ```

### Ask a question

Send a question to the `/ask` endpoint:

```
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Which payment APIs are production-ready?"}'
```

You get back the tool that was chosen and the answer:

```
{
  "tool": "productionPaymentApis",
  "answer": "4 payment APIs are production-ready: payments-api, payouts-api, ledger-api, fx-rates-api."
}
```

### Run the 10 scenarios

To run all 10 sample scenarios at once and write the results to a file:

```
npm run scenarios
```

This writes `results/scenario-results.md` (already included in the repo if you just want to read it).

## Write-ups

- `DECISIONS.md` — what I built and why.
- `FAILURE_ANALYSIS.md` — where it breaks and what I'd do about it.
- `SCALING.md` — how it would grow to thousands of APIs.

