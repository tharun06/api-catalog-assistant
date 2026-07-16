import { readFileSync, existsSync, readdirSync } from "fs";
import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../../data/catalog.json");
const jsonData = JSON.parse(readFileSync(dataPath, "utf8"));
const specsDir = resolve(__dirname, "../../data/specs");
const rubricPath = resolve(__dirname, "../../data/rubric.json");

const ApiSchema = z.object({
  name: z.string(),
  domain: z.string(),
  status: z.string().transform((s) => s.toLowerCase()),
  tags: z.array(z.string()).default([]),
  endpoints: z.number(),
  onboardedDate: z.string(),
  owner: z.string().nullable(),
  dependencies: z.array(z.string()).default([]),
  protocol: z.string(),
  gateway: z.string().nullable(),
});

const catalogSchema = z.object({
  apis: z.array(ApiSchema),
});

export type Api = z.infer<typeof ApiSchema>;

export const loadData = () => catalogSchema.parse(jsonData).apis;

export const loadSpec = (apiName: string) => {
  const specPath = join(specsDir, `${apiName}.yaml`);
  if (!existsSync(specPath)) return null;
  return parseYaml(readFileSync(specPath, "utf8"));
};

export const loadRubric = () => {
  const rubricData = JSON.parse(readFileSync(rubricPath, "utf8"));
  const rules: { id: string; severity: string }[] = [];

  for (const category of rubricData.categories) {
    for (const rule of category.rules) {
      rules.push({ id: rule.id, severity: rule.severity });
    }
  }

  return rules;
};

export const listSpecNames = () => {
  const files = readdirSync(specsDir);
  return files
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => file.replace(".yaml", ""));
};
