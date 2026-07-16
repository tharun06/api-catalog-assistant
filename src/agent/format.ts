import { hasSpec } from "../data/loader.js";

export const formatAnswer = (tool: string, args: any, result: any): string => {
  if (tool === "productionPaymentApis") {
    const names = result.map((api: any) => api.name);
    return `${names.length} payment APIs are production-ready: ${names.join(", ")}.`;
  }

  if (tool === "directDependents") {
    const names = result.map((api: any) => api.name);
    if (names.length === 0) return `No APIs directly depend on ${args.target}.`;
    return `${names.length} APIs directly depend on ${args.target}: ${names.join(", ")}.`;
  }

  if (tool === "allDependents") {
    const names = result.map((api: any) => api.name);
    if (names.length === 0) return `No APIs depend on ${args.target}, directly or indirectly.`;
    return `${names.length} APIs depend on ${args.target} in total (direct and indirect): ${names.join(", ")}.`;
  }

  if (tool === "externalApisWithoutGateway") {
    const names = result.map((api: any) => api.name);
    if (names.length === 0) return "No externally-tagged APIs are missing a gateway.";
    return `${names.length} external APIs have no gateway: ${names.join(", ")}.`;
  }

  if (tool === "deprecatedApisWithActiveDependents") {
    const names = result.map((api: any) => api.name);
    if (names.length === 0) return "No deprecated APIs are still depended on by active APIs.";
    return `${names.length} deprecated APIs are still depended on: ${names.join(", ")}.`;
  }

  if (tool === "searchApis") {
    if (result.length === 0) return `No APIs matched the keywords: ${args.keywords.join(", ")}.`;
    const labeled = result.map(
      (api: any) => `${api.name}${hasSpec(api.name) ? "" : " (no spec on file)"}`,
    );
    return `Found ${result.length} APIs related to "${args.keywords.join(", ")}": ${labeled.join(", ")}.`;
  }

  if (tool === "scoreSpec") {
    return `${result.apiName} scored ${result.score}/100 against the rubric.`;
  }

  if (tool === "whatIsWrong") {
    if (result.problems.length === 0) {
      return `${result.apiName} scored ${result.score}/100 with no problems found.`;
    }
    const lines = result.problems.map((p: any) => {
      const detailLines = p.details.map((d: string) => `    - ${d}`).join("\n");
      return `- [${p.id}, ${p.severity}]\n${detailLines}`;
    });
    return `${result.apiName} scored ${result.score}/100. Problems found:\n${lines.join("\n")}`;
  }

  if (tool === "securityIssues") {
    if (result.problems.length === 0) {
      return `${result.apiName} has no security problems.`;
    }
    const lines = result.problems.map((p: any) => {
      const detailLines = p.details.map((d: string) => `    - ${d}`).join("\n");
      return `- [${p.id}]\n${detailLines}`;
    });
    return `${result.apiName} has ${result.problems.length} security issue(s):\n${lines.join("\n")}`;
  }

  if (tool === "rankAllSpecs") {
    const lines = result.map((r: any, i: number) => `${i + 1}. ${r.apiName} (${r.score})`);
    return `Specs ranked best to worst:\n${lines.join("\n")}`;
  }

  return JSON.stringify(result);
};
