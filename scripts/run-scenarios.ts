import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { routeQuestion } from "../src/agent/router.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scenariosPath = resolve(__dirname, "../data/scenarios.json");
const outPath = resolve(__dirname, "../results/scenario-results.md");

type Scenario = { id: string; type: string; prompt: string };

const { types, scenarios } = JSON.parse(readFileSync(scenariosPath, "utf8")) as {
  types: Record<string, string>;
  scenarios: Scenario[];
};

const lines: string[] = [
  "# Scenario Results",
  "",
];

for (const s of scenarios) {
  process.stdout.write(`Running ${s.id}... `);
  let tool: string | null = null;
  let answer = "";
  try {
    const routed = await routeQuestion(s.prompt);
    tool = routed.tool;
    answer = routed.answer;
    console.log("ok");
  } catch (err) {
    answer = `ERROR: ${(err as Error).message}`;
    console.log("error");
  }

  lines.push(`## ${s.id} — ${s.type}`);
  lines.push("");
  lines.push(`_${types[s.type] ?? ""}_`);
  lines.push("");
  lines.push(`**Prompt:** ${s.prompt}`);
  lines.push("");
  lines.push(`**Tool chosen:** ${tool ?? "(none — answered directly or declined)"}`);
  lines.push("");
  lines.push("**Answer:**");
  lines.push("");
  lines.push("```");
  lines.push(answer);
  lines.push("```");
  lines.push("");
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`\nWrote ${outPath}`);
