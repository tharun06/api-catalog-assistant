import { routeQuestion } from "./src/agent/router.js";

const questions = [
  "Which payment APIs are production-ready?",
  "What depends on the ledger-api?",
  "Which APIs are external but not behind a gateway?",
  "What's wrong with the inventory-api spec?",
  "Rank all the specs from best to worst.",
  "Is the billing API any good?",
];

for (const question of questions) {
  console.log("\n=== Q:", question, "===");
  const result = await routeQuestion(question);
  console.log("tool:", result.tool);
  if (result.tool === null) {
    console.log("text:", result.result);
  } else {
    console.log("args:", JSON.stringify(result.args));
    console.log("result count:", Array.isArray(result.result) ? result.result.length : "n/a");
  }
}
