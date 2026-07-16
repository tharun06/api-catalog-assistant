import {
  productionPaymentApis,
  directDependents,
  allDependents,
  externalApisWithoutGateway,
  deprecatedApisWithActiveDependents,
  searchApis,
} from "../catalog/queries.js";
import { scoreSpec, rankSpecs } from "../specs/score.js";
import { whatIsWrong, securityIssues } from "../specs/report.js";
import { listSpecNames } from "../data/loader.js";

const rankAllSpecs = () => rankSpecs(listSpecNames());

export const TOOL_FUNCTIONS = {
  productionPaymentApis: () => productionPaymentApis(),
  directDependents: ({ target }: { target: string }) =>
    directDependents(target),
  allDependents: ({ target }: { target: string }) => allDependents(target),
  externalApisWithoutGateway: () => externalApisWithoutGateway(),
  deprecatedApisWithActiveDependents: () =>
    deprecatedApisWithActiveDependents(),
  searchApis: ({ keywords }: { keywords: string[] }) => searchApis(keywords),
  scoreSpec: ({ apiName }: { apiName: string }) => scoreSpec(apiName),
  whatIsWrong: ({ apiName }: { apiName: string }) => whatIsWrong(apiName),
  securityIssues: ({ apiName }: { apiName: string }) => securityIssues(apiName),
  rankAllSpecs: () => rankAllSpecs(),
};

export const TOOL_DECLARATIONS = [
  {
    name: "productionPaymentApis",
    description: "List payment-domain APIs that are production-ready.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "directDependents",
    description: "List APIs that directly depend on the given API name.",
    parametersJsonSchema: {
      type: "object",
      properties: { target: { type: "string" } },
      required: ["target"],
    },
  },
  {
    name: "allDependents",
    description:
      "List every API that depends on the given API, directly or indirectly (the full blast radius if it were removed).",
    parametersJsonSchema: {
      type: "object",
      properties: { target: { type: "string" } },
      required: ["target"],
    },
  },
  {
    name: "externalApisWithoutGateway",
    description: "List APIs tagged external that have no gateway.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "deprecatedApisWithActiveDependents",
    description:
      "List deprecated APIs that are still depended on by active (non-deprecated) APIs.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "searchApis",
    description:
      "Find APIs whose name, domain, or tags match any of the given keywords. Use this to find APIs relevant to a described feature.",
    parametersJsonSchema: {
      type: "object",
      properties: { keywords: { type: "array", items: { type: "string" } } },
      required: ["keywords"],
    },
  },
  {
    name: "scoreSpec",
    description:
      "Get the 0-100 rubric quality score and full rule-by-rule results for one API's spec.",
    parametersJsonSchema: {
      type: "object",
      properties: { apiName: { type: "string" } },
      required: ["apiName"],
    },
  },
  {
    name: "whatIsWrong",
    description:
      "Get a list of concrete problems and fixes for one API's spec, based on failed rubric rules.",
    parametersJsonSchema: {
      type: "object",
      properties: { apiName: { type: "string" } },
      required: ["apiName"],
    },
  },
  {
    name: "securityIssues",
    description:
      "Get only the security-related rubric problems for one API's spec.",
    parametersJsonSchema: {
      type: "object",
      properties: { apiName: { type: "string" } },
      required: ["apiName"],
    },
  },
  {
    name: "rankAllSpecs",
    description: "Rank every API spec from best to worst quality score.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
];
