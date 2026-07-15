import { loadData, type Api } from "../data/loader.js";

const apis = loadData();

// S01: Which payment APIs are production-ready?
export const productionPaymentApis = (): Api[] => {
  return apis.filter((api) => api.domain === "Payments" && api.status === "production");
};

// S02: What depends on the ledger-api? I want to know what breaks if I take it down.
export const directDependents = (target: string): Api[] => {
  return apis.filter((api) => api.dependencies.includes(target));
};

export const allDependents = (target: string): Api[] => {
  const result: Api[] = [];
  const seen = new Set<string>();
  const toCheck: string[] = [target];

  while (toCheck.length > 0) {
    const current = toCheck.shift()!;
    const dependents = directDependents(current);

    for (const api of dependents) {
      if (!seen.has(api.name)) {
        seen.add(api.name);
        result.push(api);
        toCheck.push(api.name);
      }
    }
  }

  return result;
};

// S03: Which APIs are exposed externally but not behind a gateway?
export const externalApisWithoutGateway = (): Api[] => {
  return apis.filter((api) => api.tags.includes("external") && api.gateway === null);
}

// S04: Which deprecated APIs are still being depended on by active APIs?
export const deprecatedApisWithActiveDependents = (): Api[] => {
  const deprecatedApis = apis.filter((api) => api.status === "deprecated");
  return deprecatedApis.filter((deprecatedApi) => {
    const dependents = directDependents(deprecatedApi.name);
    return dependents.some((dependent) => dependent.status !== "deprecated");
  });
}

// S05: find APIs related to a feature described in plain words
export const searchApis = (keywords: string[]): Api[] => {
  return apis.filter((api) => {
    const text = [api.name, api.domain, ...api.tags].join(" ").toLowerCase();
    return keywords.some((word) => text.includes(word.toLowerCase()));
  });
};

// console.log(productionPaymentApis().map((a) => a.name));
// console.log(allDependents("ledger-api").map((a) => a.name));
// console.log(externalApisWithoutGateway().map((a) => a.name));
// console.log(deprecatedApisWithActiveDependents().map((a) => a.name));
// console.log(searchApis(["sms", "order", "ship", "customer"]).map((a) => a.name));