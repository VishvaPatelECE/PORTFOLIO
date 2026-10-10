/**
 * The validator — six check families over a compiled graph.
 *
 * Mirrors `src/rangraph/validator/`. Two severities and no third state:
 *
 *   error   the graph cannot be correctly interpreted under the schema
 *   warning the graph is interpretable but suspicious; export proceeds
 *
 * The validator constructs nothing and repairs nothing. Every function here
 * takes the graph as given and returns findings; a defect is data, never an
 * exception, because an exception would stop the assessment at the first
 * problem and the whole claim is *how many* defects one report catches.
 *
 * Codes match the Python registry exactly, so a code shown here is greppable in
 * the repository.
 */

import {
  edgeTypeOf,
  nodeTypeOf,
  ruleOf,
  type FeatureSpec,
  type GraphSchema,
} from "./schema";
import {
  edgeLabel,
  keyOf,
  type Category,
  type Diagnostics,
  type FeatureValue,
  type Finding,
  type GraphSequence,
  type RanGraph,
  type Severity,
  type ValidationReport,
} from "./types";

/** The six families, in the order the report groups them. */
export const CHECK_FAMILIES: { id: Category; label: string; asks: string }[] = [
  {
    id: "structural",
    label: "Structural",
    asks: "Are all node and edge types declared? Is anything isolated?",
  },
  {
    id: "edge",
    label: "Edge",
    asks: "Do both endpoints exist? Is the pair legal? Are the caps respected?",
  },
  {
    id: "feature",
    label: "Feature",
    asks: "Required present, dtype, cardinality, declared range.",
  },
  {
    id: "reference",
    label: "Reference",
    asks: "Does the reference resolve, and does an edge record it?",
  },
  {
    id: "association",
    label: "Association",
    asks: "Is the projected feature still the source's value?",
  },
  {
    id: "temporal",
    label: "Temporal",
    asks: "Monotonic time, identity continuity, event validity.",
  },
];

interface Draft {
  category: Category;
  severity: Severity;
  code: string;
  name: string;
  message: string;
  node?: string;
  edge?: string;
  feature?: string;
  event?: string;
}

const finding = (draft: Draft, timestepIndex: number | null): Finding => ({
  category: draft.category,
  severity: draft.severity,
  code: draft.code,
  name: draft.name,
  message: draft.message,
  timestepIndex,
  node: draft.node ?? null,
  edge: draft.edge ?? null,
  feature: draft.feature ?? null,
  event: draft.event ?? null,
});

const SEVERITY_RANK: Record<Severity, number> = { error: 0, warning: 1 };

/** The report's total order, applied once — determinism lives in one place. */
function orderFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const keys: [string | number, string | number][] = [
      [SEVERITY_RANK[a.severity], SEVERITY_RANK[b.severity]],
      [a.timestepIndex ?? -1, b.timestepIndex ?? -1],
      [a.category, b.category],
      [a.code, b.code],
      [a.node ?? "", b.node ?? ""],
      [a.edge ?? "", b.edge ?? ""],
      [a.feature ?? "", b.feature ?? ""],
      [a.event ?? "", b.event ?? ""],
      [a.message, b.message],
    ];
    for (const [left, right] of keys) {
      if (left === right) continue;
      return left < right ? -1 : 1;
    }
    return 0;
  });
}

export function validateSequence(
  sequence: GraphSequence,
  schema: GraphSchema,
): ValidationReport {
  const findings: Finding[] = [];

  sequence.graphs.forEach((graph, index) => {
    findings.push(...collectGraphFindings(graph, schema, index));
  });
  findings.push(...checkTemporal(sequence, schema));

  return {
    findings: orderFindings(findings),
    diagnostics: sequence.graphs.map((graph, index) => diagnose(graph, index)),
    schemaVersion: schema.version,
  };
}

export function collectGraphFindings(
  graph: RanGraph,
  schema: GraphSchema,
  timestepIndex: number | null,
): Finding[] {
  return [
    ...checkStructure(graph, schema),
    ...checkEdges(graph, schema),
    ...checkFeatures(graph, schema),
    ...checkReferences(graph, schema),
    ...checkAssociations(graph, schema),
  ].map((draft) => finding(draft, timestepIndex));
}

/* ---------------------------------------------------------------- */
/* Structural                                                        */
/* ---------------------------------------------------------------- */

function checkStructure(graph: RanGraph, schema: GraphSchema): Draft[] {
  const drafts: Draft[] = [];
  const declaredNodes = new Set(schema.nodeTypes.map((t) => t.name));
  const declaredEdges = new Set(schema.edgeTypes.map((t) => t.name));

  for (const node of graph.nodes) {
    if (declaredNodes.has(node.key.nodeType)) continue;
    drafts.push({
      category: "structural",
      severity: "error",
      code: "STRUCT001",
      name: "UNDECLARED_NODE_TYPE",
      message: `node type '${node.key.nodeType}' is not declared by the schema`,
      node: keyOf(node.key),
    });
  }

  for (const edge of graph.edges) {
    if (declaredEdges.has(edge.type)) continue;
    drafts.push({
      category: "structural",
      severity: "error",
      code: "STRUCT002",
      name: "UNDECLARED_EDGE_TYPE",
      message: `edge type '${edge.type}' is not declared by the schema`,
      edge: edgeLabel(edge),
    });
  }

  const incident = new Set<string>();
  for (const edge of graph.edges) {
    incident.add(keyOf(edge.source));
    incident.add(keyOf(edge.target));
  }
  for (const node of graph.nodes) {
    if (incident.has(keyOf(node.key))) continue;
    drafts.push({
      category: "structural",
      severity: "warning",
      code: "STRUCT003",
      name: "ISOLATED_NODE",
      message:
        "node is incident to no edge; a detached or sparse topology is a legitimate network state, so this does not block export",
      node: keyOf(node.key),
    });
  }

  for (const edgeType of schema.edgeTypes) {
    if (graph.edges.some((e) => e.type === edgeType.name)) continue;
    drafts.push({
      category: "structural",
      severity: "warning",
      code: "STRUCT004",
      name: "EMPTY_EDGE_STORE",
      message: `the schema declares edge type '${edgeType.name}' and the graph holds none; its construction rule is '${edgeType.constructionRule}'`,
    });
  }

  return drafts;
}

/* ---------------------------------------------------------------- */
/* Edge                                                              */
/* ---------------------------------------------------------------- */

function checkEdges(graph: RanGraph, schema: GraphSchema): Draft[] {
  const drafts: Draft[] = [];
  const present = new Set(graph.nodes.map((n) => keyOf(n.key)));

  for (const edge of graph.edges) {
    const spec = edgeTypeOf(schema, edge.type);
    if (!spec) continue;

    if (!present.has(keyOf(edge.source))) {
      drafts.push({
        category: "edge",
        severity: "error",
        code: "EDGE001",
        name: "DANGLING_EDGE_SOURCE",
        message: `edge source ${keyOf(edge.source)} is not a node of this graph`,
        node: keyOf(edge.source),
        edge: edgeLabel(edge),
      });
    }
    if (!present.has(keyOf(edge.target))) {
      drafts.push({
        category: "edge",
        severity: "error",
        code: "EDGE002",
        name: "DANGLING_EDGE_TARGET",
        message: `edge target ${keyOf(edge.target)} is not a node of this graph; the edge is dangling and cannot be interpreted or exported`,
        node: keyOf(edge.target),
        edge: edgeLabel(edge),
      });
    }

    const admitted = spec.endpoints.some(
      (p) =>
        p.sourceType === edge.source.nodeType &&
        p.targetType === edge.target.nodeType,
    );
    if (!admitted) {
      drafts.push({
        category: "edge",
        severity: "error",
        code: "EDGE003",
        name: "ILLEGAL_ENDPOINT_PAIR",
        message: `edge type '${edge.type}' does not admit ${edge.source.nodeType} → ${edge.target.nodeType}`,
        edge: edgeLabel(edge),
      });
    }

    if (keyOf(edge.source) === keyOf(edge.target) && !spec.allowSelfLoops) {
      drafts.push({
        category: "edge",
        severity: "error",
        code: "EDGE004",
        name: "ILLEGAL_SELF_LOOP",
        message: `edge type '${edge.type}' declares allow_self_loops: false`,
        node: keyOf(edge.source),
        edge: edgeLabel(edge),
      });
    }
  }

  for (const edgeType of schema.edgeTypes) {
    const cap = edgeType.maxOutEdgesPerSource;
    if (cap === null) continue;
    const counts = new Map<string, number>();
    for (const edge of graph.edges) {
      if (edge.type !== edgeType.name) continue;
      const key = keyOf(edge.source);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const key of Array.from(counts.keys()).sort()) {
      const count = counts.get(key) ?? 0;
      if (count <= cap) continue;
      drafts.push({
        category: "edge",
        severity: "error",
        code: "EDGE005",
        name: "OUT_DEGREE_EXCEEDED",
        message: `${count} '${edgeType.name}' edges leave ${key}, exceeding the declared max_out_edges_per_source of ${cap}`,
        node: key,
      });
    }
  }

  return drafts;
}

/* ---------------------------------------------------------------- */
/* Feature                                                           */
/* ---------------------------------------------------------------- */

function checkFeatures(graph: RanGraph, schema: GraphSchema): Draft[] {
  const drafts: Draft[] = [];

  for (const node of graph.nodes) {
    const spec = nodeTypeOf(schema, node.key.nodeType);
    if (!spec) continue;
    drafts.push(
      ...checkFeatureMap(
        node.features,
        spec.features,
        `node type '${spec.name}'`,
        {
          node: keyOf(node.key),
        },
      ),
    );
  }

  for (const edge of graph.edges) {
    const spec = edgeTypeOf(schema, edge.type);
    if (!spec) continue;
    drafts.push(
      ...checkFeatureMap(
        edge.features,
        spec.features,
        `edge type '${spec.name}'`,
        {
          edge: edgeLabel(edge),
        },
      ),
    );
  }

  return drafts;
}

function checkFeatureMap(
  features: Record<string, FeatureValue>,
  specs: readonly FeatureSpec[],
  owner: string,
  context: { node?: string; edge?: string },
): Draft[] {
  const drafts: Draft[] = [];
  const declared = new Map(specs.map((s) => [s.name, s]));

  for (const name of Object.keys(features).sort()) {
    if (declared.has(name)) continue;
    drafts.push({
      ...context,
      category: "feature",
      severity: "error",
      code: "FEAT003",
      name: "UNDECLARED_FEATURE",
      message: `${owner} declares no feature '${name}', so its value carries no unit, dtype, or range`,
      feature: name,
    });
  }

  for (const spec of specs) {
    if (!(spec.name in features)) {
      if (spec.required) {
        drafts.push({
          ...context,
          category: "feature",
          severity: "error",
          code: "FEAT001",
          name: "REQUIRED_FEATURE_ABSENT",
          message: `${owner} declares '${spec.name}' as required and the mapping does not carry the key`,
          feature: spec.name,
        });
      }
      continue;
    }

    const value = features[spec.name];
    if (value === null) {
      if (spec.required) {
        drafts.push({
          ...context,
          category: "feature",
          severity: "error",
          code: "FEAT002",
          name: "REQUIRED_FEATURE_NULL",
          message: `${owner} declares '${spec.name}' as required and its value is an explicit null; the value is preserved as reported and is not filled`,
          feature: spec.name,
        });
      }
      continue;
    }

    const components = componentsOf(spec, value);
    if (components === null) {
      drafts.push({
        ...context,
        category: "feature",
        severity: "error",
        code: "FEAT005",
        name: "FEATURE_CARDINALITY_MISMATCH",
        message: `${owner} declares '${spec.name}' with cardinality ${spec.cardinality}, and the value does not supply ${spec.cardinality} component(s)`,
        feature: spec.name,
      });
      continue;
    }

    for (const component of components) {
      if (!matchesDType(spec.dtype, component)) {
        drafts.push({
          ...context,
          category: "feature",
          severity: "error",
          code: "FEAT004",
          name: "FEATURE_DTYPE_MISMATCH",
          message: `${owner} declares '${spec.name}' with dtype ${spec.dtype}, and the value is ${JSON.stringify(component)}`,
          feature: spec.name,
        });
        continue;
      }
      if (spec.validRange === null || typeof component !== "number") continue;
      const [minimum, maximum] = spec.validRange;
      if (component >= minimum && component <= maximum) continue;
      drafts.push({
        ...context,
        category: "feature",
        severity: "error",
        code: "FEAT006",
        name: "FEATURE_OUT_OF_RANGE",
        message: `${owner} declares '${spec.name}' with valid_range [${minimum}, ${maximum}] in ${spec.unit}, and the value is ${component}; it is reported as supplied and is not clamped`,
        feature: spec.name,
      });
    }
  }

  return drafts;
}

function componentsOf(
  spec: FeatureSpec,
  value: FeatureValue,
): unknown[] | null {
  const isSequence = Array.isArray(value);
  if (spec.cardinality === 1) return isSequence ? null : [value];
  if (!isSequence || value.length !== spec.cardinality) return null;
  return [...value];
}

function matchesDType(
  dtype: FeatureSpec["dtype"],
  component: unknown,
): boolean {
  if (dtype === "bool") return typeof component === "boolean";
  if (typeof component === "boolean") return false;
  if (typeof component !== "number") return false;
  if (dtype === "int") return Number.isInteger(component);
  return true;
}

/* ---------------------------------------------------------------- */
/* Reference                                                         */
/* ---------------------------------------------------------------- */

function checkReferences(graph: RanGraph, schema: GraphSchema): Draft[] {
  const drafts: Draft[] = [];
  const present = new Set(graph.nodes.map((n) => keyOf(n.key)));

  for (const node of graph.nodes) {
    const spec = nodeTypeOf(schema, node.key.nodeType);
    if (!spec) continue;

    for (const reference of spec.referenceFields) {
      if (!(reference.name in node.references)) continue;
      const targetId = node.references[reference.name];

      if (targetId === null) {
        if (!reference.nullable) {
          drafts.push({
            category: "reference",
            severity: "error",
            code: "REF002",
            name: "REFERENCE_NULL_NOT_PERMITTED",
            message: `reference field '${reference.name}' declares nullable: false and its value is null`,
            node: keyOf(node.key),
            feature: reference.name,
          });
        }
        continue;
      }

      const target = `${reference.targetNodeType}:${targetId}`;
      const carrying = schema.edgeTypes
        .filter((t) =>
          t.endpoints.some(
            (p) =>
              p.sourceType === node.key.nodeType &&
              p.targetType === reference.targetNodeType,
          ),
        )
        .map((t) => t.name);

      const materialized = graph.edges.some(
        (e) =>
          carrying.includes(e.type) &&
          keyOf(e.source) === keyOf(node.key) &&
          keyOf(e.target) === target,
      );

      if (carrying.length > 0 && !materialized) {
        drafts.push({
          category: "reference",
          severity: "error",
          code: "REF003",
          name: "REFERENCE_NOT_MATERIALIZED",
          message: `reference field '${reference.name}' names ${target} and no edge records that fact`,
          node: keyOf(node.key),
          feature: reference.name,
        });
      }
      if (!present.has(target) && !materialized) {
        drafts.push({
          category: "reference",
          severity: "error",
          code: "REF005",
          name: "REFERENCE_TARGET_ABSENT",
          message: `reference field '${reference.name}' names ${target}, which is not a node of this graph`,
          node: keyOf(node.key),
          feature: reference.name,
        });
      }
    }
  }

  // An edge asserting an attachment the source never reported is fabrication —
  // a more serious defect than under-reporting one.
  for (const edge of graph.edges) {
    const sourceSpec = nodeTypeOf(schema, edge.source.nodeType);
    if (!sourceSpec) continue;
    const candidates = sourceSpec.referenceFields.filter(
      (r) => r.targetNodeType === edge.target.nodeType,
    );
    if (candidates.length === 0) continue;

    const sourceNode = graph.nodes.find(
      (n) => keyOf(n.key) === keyOf(edge.source),
    );
    if (!sourceNode) continue;

    const backed = candidates.some(
      (r) => sourceNode.references[r.name] === edge.target.entityId,
    );
    if (backed) continue;

    drafts.push({
      category: "reference",
      severity: "error",
      code: "REF004",
      name: "EDGE_NOT_BACKED_BY_REFERENCE",
      message: `edge asserts ${keyOf(edge.source)} → ${keyOf(edge.target)} and no reference field of the source names it; the structure claims an attachment the source did not report`,
      node: keyOf(edge.source),
      edge: edgeLabel(edge),
    });
  }

  return drafts;
}

/* ---------------------------------------------------------------- */
/* Association — projection consistency                              */
/* ---------------------------------------------------------------- */

function checkAssociations(graph: RanGraph, schema: GraphSchema): Draft[] {
  const drafts: Draft[] = [];

  for (const edge of graph.edges) {
    const spec = edgeTypeOf(schema, edge.type);
    if (!spec) continue;
    const rule = ruleOf(schema, spec.constructionRule);
    if (!rule || Object.keys(rule.projections).length === 0) continue;

    const sourceNode = graph.nodes.find(
      (n) => keyOf(n.key) === keyOf(edge.source),
    );
    if (!sourceNode) continue;

    for (const edgeFeature of Object.keys(rule.projections).sort()) {
      if (!(edgeFeature in edge.features)) continue;
      const from = rule.projections[edgeFeature];
      const expected = sourceNode.features[from] ?? null;
      const actual = edge.features[edgeFeature];
      if (actual === expected) continue;

      const nullMismatch = (actual === null) !== (expected === null);
      drafts.push({
        category: "association",
        severity: "error",
        code: nullMismatch ? "ASSOC002" : "ASSOC001",
        name: nullMismatch
          ? "PROJECTED_NULL_MISMATCH"
          : "PROJECTED_FEATURE_MISMATCH",
        message: `edge feature '${edgeFeature}' is declared a projection of ${edge.source.nodeType}.${from}; the edge carries ${JSON.stringify(actual)} and the source node carries ${JSON.stringify(expected)}`,
        node: keyOf(edge.source),
        edge: edgeLabel(edge),
        feature: edgeFeature,
      });
    }
  }

  return drafts;
}

/* ---------------------------------------------------------------- */
/* Temporal                                                          */
/* ---------------------------------------------------------------- */

function checkTemporal(
  sequence: GraphSequence,
  schema: GraphSchema,
): Finding[] {
  const drafts: Finding[] = [];
  const { graphs, handoverEvents } = sequence;

  let previous: { index: number; timestamp: number } | null = null;
  graphs.forEach((graph, index) => {
    const timestamp = graph.nodes[0]?.timestamp;
    if (timestamp === undefined) return;
    if (previous && timestamp <= previous.timestamp) {
      drafts.push(
        finding(
          {
            category: "temporal",
            severity: "error",
            code: "TEMP001",
            name: "TIMESTAMPS_NOT_INCREASING",
            message: `graph ${index} has timestamp ${timestamp}, which does not strictly exceed ${previous.timestamp} of graph ${previous.index}`,
          },
          index,
        ),
      );
    }
    previous = { index, timestamp };
  });

  graphs.forEach((graph, index) => {
    const successor = graphs[index + 1];
    if (!successor) return;

    if (graph.temporalIndex === null) {
      drafts.push(
        finding(
          {
            category: "temporal",
            severity: "error",
            code: "TEMP002",
            name: "TEMPORAL_INDEX_ABSENT",
            message:
              "graph carries no temporal_index and a subsequent timestep exists, so it asserts no identity continuity",
          },
          index,
        ),
      );
      return;
    }

    const successorKeys = new Set(successor.nodes.map((n) => keyOf(n.key)));
    for (const source of Object.keys(graph.temporalIndex).sort()) {
      const target = graph.temporalIndex[source];
      if (source !== target) {
        drafts.push(
          finding(
            {
              category: "temporal",
              severity: "error",
              code: "TEMP005",
              name: "TEMPORAL_IDENTITY_MISMATCH",
              message: `temporal_index links ${source} to ${target}; the index is an identity map, so a link between differing identities asserts a renaming the schema does not permit`,
              node: source,
            },
            index,
          ),
        );
      }
      if (!successorKeys.has(target)) {
        drafts.push(
          finding(
            {
              category: "temporal",
              severity: "error",
              code: "TEMP004",
              name: "TEMPORAL_INDEX_UNKNOWN_TARGET",
              message: `temporal_index links ${source} to ${target}, which is not a node of the next graph`,
              node: source,
            },
            index,
          ),
        );
      }
    }

    for (const node of graph.nodes) {
      const key = keyOf(node.key);
      if (!successorKeys.has(key)) continue;
      if (key in graph.temporalIndex) continue;
      drafts.push(
        finding(
          {
            category: "temporal",
            severity: "error",
            code: "TEMP007",
            name: "PERSISTING_ENTITY_NOT_LINKED",
            message: `${key} is present at this timestep and the next, and the temporal_index claims no continuity for it`,
            node: key,
          },
          index,
        ),
      );
    }
  });

  // Events are assessed against the association edges, never re-derived.
  const associationType = schema.edgeTypes.find(
    (t) => ruleOf(schema, t.constructionRule)?.projections.signal_quality,
  )?.name;

  if (associationType) {
    for (const event of handoverEvents) {
      const boundary = graphs.findIndex(
        (g, i) =>
          g.nodes[0]?.timestamp === event.fromTimestamp &&
          graphs[i + 1]?.nodes[0]?.timestamp === event.toTimestamp,
      );
      const label = `${event.ueId}: ${event.sourceGnbId} → ${event.targetGnbId} @ ${event.fromTimestamp}→${event.toTimestamp}`;

      if (boundary < 0) {
        drafts.push(
          finding(
            {
              category: "temporal",
              severity: "error",
              code: "TEMP008",
              name: "HANDOVER_BOUNDARY_UNKNOWN",
              message: `event spans ${event.fromTimestamp} → ${event.toTimestamp}, which is not a boundary between two adjacent graphs`,
              event: label,
            },
            null,
          ),
        );
        continue;
      }

      const serving = (graph: RanGraph): string | undefined =>
        graph.edges.find(
          (e) => e.type === associationType && e.source.entityId === event.ueId,
        )?.target.entityId;

      const before = serving(graphs[boundary]);
      const after = serving(graphs[boundary + 1]);
      if (before === event.sourceGnbId && after === event.targetGnbId) continue;

      drafts.push(
        finding(
          {
            category: "temporal",
            severity: "error",
            code: "TEMP010",
            name: "HANDOVER_CONTRADICTS_ASSOCIATION",
            message: `event records ${event.sourceGnbId} → ${event.targetGnbId} and the association edges record ${before} → ${after}`,
            event: label,
          },
          boundary,
        ),
      );
    }
  }

  return drafts;
}

/* ---------------------------------------------------------------- */
/* Diagnostics — descriptive, never thresholds                        */
/* ---------------------------------------------------------------- */

function diagnose(graph: RanGraph, timestepIndex: number): Diagnostics {
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;
  const possible = nodeCount * (nodeCount - 1);

  const degrees = new Map<string, number>(
    graph.nodes.map((n) => [keyOf(n.key), 0]),
  );
  for (const edge of graph.edges) {
    for (const endpoint of [edge.source, edge.target]) {
      const key = keyOf(endpoint);
      if (degrees.has(key)) degrees.set(key, (degrees.get(key) ?? 0) + 1);
    }
  }
  const values = Array.from(degrees.values());

  return {
    timestepIndex,
    timestamp: graph.nodes[0]?.timestamp ?? null,
    nodeCount,
    edgeCount,
    density: possible ? edgeCount / possible : 0,
    minDegree: values.length ? Math.min(...values) : 0,
    maxDegree: values.length ? Math.max(...values) : 0,
    meanDegree: values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0,
  };
}

export const isErrorFree = (report: ValidationReport): boolean =>
  !report.findings.some((f) => f.severity === "error");

export const errorsOf = (report: ValidationReport): Finding[] =>
  report.findings.filter((f) => f.severity === "error");

export const warningsOf = (report: ValidationReport): Finding[] =>
  report.findings.filter((f) => f.severity === "warning");
