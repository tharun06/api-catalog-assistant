import { readFileSync, existsSync } from "fs";
import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import  { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, "../../data/catalog.json");
const jsonData = JSON.parse(readFileSync(dataPath, "utf8"));
const specsDir = resolve(__dirname, "../../data/specs");

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