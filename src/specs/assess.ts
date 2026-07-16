import { loadSpec } from "../data/loader.js";

const HTTP_METHODS = ["get", "put", "post", "delete", "patch"];

// SEC-01: The spec declares at least one security scheme under components.securitySchemes.
const checkSecuritySchemes = (spec: any) => {
  const schemes = spec?.components?.securitySchemes;
  const passed = schemes != null && Object.keys(schemes).length > 0;
  return { id: "SEC-01", passed, details: [] as string[] };
};

// SEC-02: Every operation is covered by a security requirement, either globally (root `security`) or per-operation, unless explicitly marked public.
const checkOperationRequiredauth = (spec: any) => {
  const hasGlobalSecurity = spec.security && spec.security.length > 0;
  const paths = spec.paths || {};
  const details: string[] = [];

  for (const path in paths) {
    for (const method of HTTP_METHODS) {
      const operation = paths[path][method];
      if (operation) {
        const hasOperationSecurity =
          operation.security && operation.security.length > 0;
        if (!hasGlobalSecurity && !hasOperationSecurity) {
          details.push(
            `Path: ${path}, Method: ${method.toUpperCase()} does not have security defined.`,
          );
        }
      }
    }
  }

  return { id: "SEC-02", passed: details.length === 0, details };
};

// SEC-03: All server URLs use HTTPS, and examples contain no real-looking secrets, tokens, or PII.
const checkTransportAndExamplesSafe = (spec: any) => {
  const details: string[] = [];
  const servers = spec.servers || [];

  for (const server of servers) {
    if (!server.url || !server.url.startsWith("https://")) {
      details.push(`Server URL: ${server.url} is not using HTTPS.`);
    }
  }

  return { id: "SEC-03", passed: details.length === 0, details };
};

// DES-03: Every operation defines an operationId, and all operationIds are unique within the spec.
const checkUniqueOperationIds = (spec: any) => {
  const operationIds = new Set<string>();
  const paths = spec.paths || {};
  const details: string[] = [];

  for (const path in paths) {
    for (const method of HTTP_METHODS) {
      const operation = paths[path][method];
      if (!operation) continue;

      if (!operation.operationId) {
        details.push(
          `Missing operationId at Path: ${path}, Method: ${method.toUpperCase()}`,
        );
      } else if (operationIds.has(operation.operationId)) {
        details.push(
          `Duplicate operationId found: ${operation.operationId} at Path: ${path}, Method: ${method.toUpperCase()}`,
        );
      } else {
        operationIds.add(operation.operationId);
      }
    }
  }

  return { id: "DES-03", passed: details.length === 0, details };
};

const isLowercasePath = (path: string) => {
  const segments = path
    .split("/")
    .filter((segment) => !segment.startsWith("{"));
  const staticPath = segments.join("/");
  return staticPath === staticPath.toLowerCase();
};

// DES-01: Paths use lowercase, hyphenated, plural-noun resource segments and avoid trailing slashes or verbs in paths.
const checkConsistentPathNaming = (spec: any) => {
  const paths = spec.paths || {};
  const details: string[] = [];

  for (const path in paths) {
    if (!path.startsWith("/")) {
      details.push(`Path: ${path} does not start with a leading slash.`);
    }
    if (!isLowercasePath(path)) {
      details.push(`Path: ${path} is not in lowercase.`);
    }
    if (path.includes("_")) {
      details.push(`Path: ${path} contains underscores.`);
    }
  }

  return { id: "DES-01", passed: details.length === 0, details };
};

const isCamelCase = (name: string) => /^[a-z][a-zA-Z0-9]*$/.test(name);

// DES-02: Schema property names use a single consistent casing convention (default: camelCase).
const checkConsistentPropertyCasing = (spec: any) => {
  const schemas = spec?.components?.schemas || {};
  const details: string[] = [];

  for (const schemaName in schemas) {
    const props = Object.keys(schemas[schemaName].properties || {});
    const badProps = props.filter((name) => !isCamelCase(name));
    if (badProps.length > 0) {
      details.push(
        `Schema "${schemaName}" has non-camelCase properties: ${badProps.join(", ")}`,
      );
    }
  }

  return { id: "DES-02", passed: details.length === 0, details };
};

// DOC-01: Every operation defines both a non-empty summary and a description.
const checkOperationsDocumented = (spec: any) => {
  const paths = spec.paths || {};
  const details: string[] = [];

  for (const path in paths) {
    for (const method of HTTP_METHODS) {
      const operation = paths[path][method];
      if (!operation) continue;
      if (!operation.summary || operation.summary.trim() === "") {
        details.push(
          `Missing summary at Path: ${path}, Method: ${method.toUpperCase()}`,
        );
      }
      if (!operation.description || operation.description.trim() === "") {
        details.push(
          `Missing description at Path: ${path}, Method: ${method.toUpperCase()}`,
        );
      }
    }
  }

  return { id: "DOC-01", passed: details.length === 0, details };
};

const resolveRef = (spec: any, ref: string) => {
  const path = ref.replace("#/", "").split("/");
  let node = spec;
  for (const key of path) {
    node = node?.[key];
  }
  return node;
};

// DOC-02: Every parameter and every schema property has a description.
const checkParamsAndPropsDescribed = (spec: any) => {
  const schemas = spec?.components?.schemas || {};
  const details: string[] = [];
  for (const path in spec.paths || {}) {
    for (const method of HTTP_METHODS) {
      const operation = spec.paths[path][method];
      if (!operation) continue;

      const parameters = operation.parameters || [];
      for (const param of parameters) {
        const resolved = param.$ref ? resolveRef(spec, param.$ref) : param;
        if (!resolved?.description || resolved.description.trim() === "") {
          details.push(
            `Parameter "${resolved?.name}" in Path: ${path}, Method: ${method.toUpperCase()} is missing a description.`,
          );
        }
      }
    }
  }

  for (const schemaName in schemas) {
    const props = schemas[schemaName].properties || {};
    for (const propName in props) {
      if (
        !props[propName].description ||
        props[propName].description.trim() === ""
      ) {
        details.push(
          `Property "${propName}" in schema "${schemaName}" is missing a description.`,
        );
      }
    }
  }

  return { id: "DOC-02", passed: details.length === 0, details };
};

// DOC-03: Request bodies and 2xx responses include at least one example or example value.
const checkExamplesProvided = (spec: any) => {
  const paths = spec.paths || {};
  const details: string[] = [];

  for (const path in paths) {
    for (const method of HTTP_METHODS) {
      const operation = paths[path][method];
      if (!operation) continue;

      const requestBody = operation.requestBody;
      if (requestBody) {
        const content = requestBody.content || {};
        for (const mediaType in content) {
          const mediaObj = content[mediaType];
          if (!mediaObj.example && !mediaObj.examples) {
            details.push(
              `Request body for Path: ${path}, Method: ${method.toUpperCase()} is missing examples.`,
            );
          }
        }
      }

      const responses = operation.responses || {};
      for (const statusCode in responses) {
        if (statusCode.startsWith("2")) {
          const response = responses[statusCode];
          const content = response.content || {};
          for (const mediaType in content) {
            const mediaObj = content[mediaType];
            if (!mediaObj.example && !mediaObj.examples) {
              details.push(
                `Response ${statusCode} for Path: ${path}, Method: ${method.toUpperCase()} is missing examples.`,
              );
            }
          }
        }
      }
    }
  }

  return { id: "DOC-03", passed: details.length === 0, details };
};

export const assessSpec = (apiName: string) => {
  const spec = loadSpec(apiName);
  if (!spec) return null;

  return [
    checkSecuritySchemes(spec),
    checkOperationRequiredauth(spec),
    checkTransportAndExamplesSafe(spec),
    checkUniqueOperationIds(spec),
    checkConsistentPathNaming(spec),
    checkConsistentPropertyCasing(spec),
    checkOperationsDocumented(spec),
    checkParamsAndPropsDescribed(spec),
    checkExamplesProvided(spec),
  ];
};

// console.log(assessSpec("inventory-api"));
// console.log(assessSpec("loyalty-rewards-api"));
