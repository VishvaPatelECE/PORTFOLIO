/**
 * The compiler — five passes, in the order the specification fixes.
 *
 *   1 Contract Verification → 2 Node Instantiation → 3 Feature Attachment
 *     → 4 Relationship Inference → 5 Temporal Linking
 *
 * Mirrors `src/rangraph/compiler/`. Each pass returns a new immutable snapshot,
 * so the visualization can show the *same object* gaining structure rather than
 * five unrelated illustrations. The order is a correctness constraint, not a
 * preference: Pass 4 projects `association.signal_quality` from `UE.sinr`, so
 * the feature must exist before an edge can carry it.
 *
 * What every pass refuses to do is as much of the contract as what it does. No
 * pass normalizes, clamps, coerces, converts a unit, imputes a value, or infers
 * a relationship the schema did not declare — and Pass 4 materializes a
 * genuinely dangling edge from a reference naming an absent node, because that
 * finding belongs to the validator.
 */

import { nodeTypeOf, ruleOf, type GraphSchema } from "./schema";
import {
  keyOf,
  type FeatureValue,
  type GraphEdge,
  type GraphNode,
  type GraphSequence,
  type HandoverEvent,
  type NodeKey,
  type RanGraph,
  type SemanticEntity,
} from "./types";

export interface PassContract {
  index: number;
  id: string;
  label: string;
  input: string;
  output: string;
  /** What the pass produced, in one line the UI can read aloud. */
  summary: string;
  /** The boundaries the pass holds. Research credibility lives here. */
  doesNot: string[];
}

/** One timestep's state after each pass, for stepping through. */
export interface PassSnapshot {
  contract: PassContract;
  nodes: GraphNode[];
  edges: GraphEdge[];
  temporalIndex: Record<string, string> | null;
  events: HandoverEvent[];
}

export interface CompileResult {
  sequence: GraphSequence;
  /** Snapshots for the first timestep — what the stepper walks through. */
  snapshots: PassSnapshot[];
  /** Contract-verification issues, if the entity stream did not conform. */
  contractIssues: string[];
}

const METADATA = {
  schemaVersion: "1.0.0",
  sourceAdapter: "MockE2Adapter",
  sourceAdapterVersion: "0.1.0",
  scenarioId: "golden_scenario",
};

const byKey = (a: NodeKey, b: NodeKey): number =>
  a.nodeType === b.nodeType
    ? a.entityId.localeCompare(b.entityId)
    : a.nodeType.localeCompare(b.nodeType);

const byEdge = (a: GraphEdge, b: GraphEdge): number =>
  a.type !== b.type
    ? a.type.localeCompare(b.type)
    : byKey(a.source, b.source) || byKey(a.target, b.target);

/** Compile canonical entities into a sequence, recording each pass. */
export function compile(
  entities: readonly SemanticEntity[],
  schema: GraphSchema,
): CompileResult {
  const contractIssues = verifyContract(entities, schema);

  const timestamps = Array.from(new Set(entities.map((e) => e.timestamp))).sort(
    (a, b) => a - b,
  );

  const perTimestep = timestamps.map((t) =>
    compileTimestep(
      entities.filter((e) => e.timestamp === t),
      schema,
    ),
  );

  const linked = linkTemporalIdentity(perTimestep.map((s) => s.graph));
  const events = deriveHandoverEvents(linked, schema);

  const snapshots = buildSnapshots(perTimestep[0], linked, events, schema);

  return {
    sequence: { graphs: linked, handoverEvents: events },
    snapshots,
    contractIssues,
  };
}

/* ---------------------------------------------------------------- */
/* Pass 1 — contract verification                                    */
/* ---------------------------------------------------------------- */

/**
 * Confirm the entity stream conforms before any node exists.
 *
 * An undeclared entity type and a duplicate identity are the two failures that
 * leave nothing to build: with no type spec there is no contract to check
 * against, and a duplicate makes the node store ill-defined. Everything else is
 * a question about a *built* graph, and so belongs to the validator.
 */
function verifyContract(
  entities: readonly SemanticEntity[],
  schema: GraphSchema,
): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();

  for (const entity of entities) {
    if (!nodeTypeOf(schema, entity.type)) {
      issues.push(
        `entity ${entity.id}: type '${entity.type}' is not declared by schema ${schema.version}`,
      );
    }
    const identity = `${entity.type}:${entity.id}@${entity.timestamp}`;
    if (seen.has(identity)) {
      issues.push(`duplicate entity identity ${identity} in one timestep`);
    }
    seen.add(identity);
  }
  return issues;
}

/* ---------------------------------------------------------------- */
/* Passes 2–4, one timestep                                          */
/* ---------------------------------------------------------------- */

interface TimestepStages {
  structural: GraphNode[];
  featured: GraphNode[];
  edges: GraphEdge[];
  graph: RanGraph;
}

function compileTimestep(
  entities: readonly SemanticEntity[],
  schema: GraphSchema,
): TimestepStages {
  const structural = instantiateNodes(entities, schema);
  const featured = attachFeatures(structural, entities, schema);
  const edges = inferRelationships(featured, schema);

  return {
    structural,
    featured,
    edges,
    graph: {
      nodes: featured,
      edges,
      temporalIndex: null,
      metadata: METADATA,
    },
  };
}

/**
 * Pass 2 — one typed node per entity: identity, type, timestamp, references.
 *
 * A reference field is *carried onto* the node, never followed. Resolving it
 * requires knowing every node in the timestep, which is why materialization is
 * Pass 4's job.
 */
function instantiateNodes(
  entities: readonly SemanticEntity[],
  schema: GraphSchema,
): GraphNode[] {
  return entities
    .map((entity) => {
      const spec = nodeTypeOf(schema, entity.type);
      const references: Record<string, string | null> = {};
      for (const reference of spec?.referenceFields ?? []) {
        if (!(reference.name in entity.attributes)) continue;
        const value = entity.attributes[reference.name];
        references[reference.name] =
          value === null || typeof value === "string" ? value : null;
      }
      return {
        key: { nodeType: entity.type, entityId: entity.id },
        timestamp: entity.timestamp,
        features: {},
        references,
      };
    })
    .sort((a, b) => byKey(a.key, b.key));
}

/**
 * Pass 3 — copy verified attributes onto nodes as canonical features.
 *
 * Selection is driven by the schema's declarations, so an undeclared attribute
 * cannot get in and a declared required feature cannot silently go missing: an
 * absent required feature is materialized as an explicit null for the validator
 * to report, and an absent *optional* one is left absent, because "not reported"
 * and "reported as unavailable" are different facts.
 */
function attachFeatures(
  nodes: readonly GraphNode[],
  entities: readonly SemanticEntity[],
  schema: GraphSchema,
): GraphNode[] {
  const attributesBy = new Map(
    entities.map((e) => [`${e.type}:${e.id}`, e.attributes]),
  );

  return nodes.map((node) => {
    const spec = nodeTypeOf(schema, node.key.nodeType);
    const attributes = attributesBy.get(keyOf(node.key)) ?? {};
    const features: Record<string, FeatureValue> = {};

    for (const feature of spec?.features ?? []) {
      if (feature.name in attributes) {
        features[feature.name] = attributes[feature.name];
      } else if (feature.required) {
        features[feature.name] = null;
      }
    }
    return { ...node, features };
  });
}

/**
 * Pass 4 — apply each declared edge type's construction rule.
 *
 * Which reference field materializes which edge type is derived from the schema:
 * for each endpoint pair the edge type admits, the source type's reference
 * fields targeting that pair's target type are the fields that build it.
 *
 * A rule whose required source observation nothing supplies constructs *zero*
 * edges — that is `source_reported_coupling`, and the empty `interference` store
 * every conforming Schema 1.0.0 graph carries. No interference edge is ever
 * synthesized from `sinr`, `position`, `load`, or `tx_power`.
 */
function inferRelationships(
  nodes: readonly GraphNode[],
  schema: GraphSchema,
): GraphEdge[] {
  const edges: GraphEdge[] = [];

  for (const edgeType of schema.edgeTypes) {
    const rule = ruleOf(schema, edgeType.constructionRule);
    if (!rule || !rule.constructs) continue;

    for (const endpoint of edgeType.endpoints) {
      const applicable =
        rule.appliesTo.length === 0 ||
        rule.appliesTo.some(
          (pair) =>
            pair.sourceType === endpoint.sourceType &&
            pair.targetType === endpoint.targetType,
        );
      if (!applicable) continue;

      const sourceSpec = nodeTypeOf(schema, endpoint.sourceType);
      const fields = (sourceSpec?.referenceFields ?? []).filter(
        (r) => r.targetNodeType === endpoint.targetType,
      );
      if (fields.length === 0) continue;

      for (const node of nodes) {
        if (node.key.nodeType !== endpoint.sourceType) continue;
        for (const field of fields) {
          const targetId = node.references[field.name];
          // A null reference reports "no serving cell". It materializes nothing,
          // and that is a legitimate network state rather than an error.
          if (targetId === null || targetId === undefined) continue;

          const target: NodeKey = {
            nodeType: endpoint.targetType,
            entityId: targetId,
          };
          const features: Record<string, FeatureValue> = {};
          for (const [edgeFeature, nodeFeature] of Object.entries(
            rule.projections,
          )) {
            // A projection is a copy: null in, null out (never zero-filled).
            features[edgeFeature] = node.features[nodeFeature] ?? null;
          }

          // Built even when the target is absent. The dangling edge is the
          // validator's finding, and suppressing it here would leave the defect
          // with no representation to report.
          edges.push({
            type: edgeType.name,
            source: node.key,
            target,
            features,
          });
        }
      }
    }
  }

  return edges.sort(byEdge);
}

/* ---------------------------------------------------------------- */
/* Pass 5 — temporal linking                                         */
/* ---------------------------------------------------------------- */

/**
 * Record identity continuity from each graph into the next.
 *
 * The index is an *identity map* — a claim of sameness, not a renaming — because
 * the specification makes the same identifier at two timesteps denote the same
 * physical entity. The final graph's index is empty: there is no next timestep,
 * which is a real answer rather than a missing one.
 */
function linkTemporalIdentity(graphs: readonly RanGraph[]): RanGraph[] {
  return graphs.map((graph, i) => {
    const successor = graphs[i + 1];
    if (!successor) return { ...graph, temporalIndex: {} };

    const present = new Set(successor.nodes.map((n) => keyOf(n.key)));
    const index: Record<string, string> = {};
    for (const node of graph.nodes) {
      const key = keyOf(node.key);
      if (present.has(key)) index[key] = key;
    }
    return { ...graph, temporalIndex: index };
  });
}

/**
 * Derive handover events by diffing the association edge set across boundaries.
 *
 * Continuity and change are separate statements, and conflating them is the
 * modelling error the specification calls the most consequential one available
 * here: a UE that stays attached to one cell has a continuity link and *no*
 * event. An event needs two non-null endpoints that differ.
 */
function deriveHandoverEvents(
  graphs: readonly RanGraph[],
  schema: GraphSchema,
): HandoverEvent[] {
  const associationType = schema.edgeTypes.find(
    (t) => ruleOf(schema, t.constructionRule)?.projections.signal_quality,
  )?.name;
  if (!associationType) return [];

  const servingCells = (graph: RanGraph): Map<string, string> =>
    new Map(
      graph.edges
        .filter((e) => e.type === associationType)
        .map((e) => [e.source.entityId, e.target.entityId]),
    );

  const events: HandoverEvent[] = [];
  for (let i = 0; i < graphs.length - 1; i++) {
    const before = servingCells(graphs[i]);
    const after = servingCells(graphs[i + 1]);
    const fromTimestamp = graphs[i].nodes[0]?.timestamp;
    const toTimestamp = graphs[i + 1].nodes[0]?.timestamp;
    if (fromTimestamp === undefined || toTimestamp === undefined) continue;

    for (const ueId of Array.from(before.keys()).sort()) {
      const sourceGnbId = before.get(ueId);
      const targetGnbId = after.get(ueId);
      if (!sourceGnbId || !targetGnbId) continue;
      if (sourceGnbId === targetGnbId) continue;
      events.push({
        ueId,
        sourceGnbId,
        targetGnbId,
        fromTimestamp,
        toTimestamp,
      });
    }
  }
  return events;
}

/* ---------------------------------------------------------------- */
/* Snapshots for the stepper                                         */
/* ---------------------------------------------------------------- */

const CONTRACTS: PassContract[] = [
  {
    index: 1,
    id: "contract_verification",
    label: "Contract Verification",
    input: "SemanticEntity stream + Schema",
    output: "Verified entities (or a contract violation)",
    summary: "",
    doesNot: [
      "build any node or edge",
      "assess a graph — a dangling reference is not its business",
      "repair or drop a nonconforming entity",
    ],
  },
  {
    index: 2,
    id: "node_instantiation",
    label: "Node Instantiation",
    input: "Verified entities",
    output: "Typed nodes: identity, timestamp, reference fields",
    summary: "",
    doesNot: [
      "attach any feature — that is Pass 3",
      "follow a reference field into an edge",
      "invent a node the source did not report",
    ],
  },
  {
    index: 3,
    id: "feature_attachment",
    label: "Feature Attachment",
    input: "Typed nodes + entity attributes",
    output: "Nodes carrying canonical features",
    summary: "",
    doesNot: [
      "normalize, z-score, or min-max scale anything",
      "convert a unit — ingestion already did, once",
      "clamp an out-of-range value or fill a null",
    ],
  },
  {
    index: 4,
    id: "relationship_inference",
    label: "Relationship Inference",
    input: "Featured nodes + construction rules",
    output: "Typed edges with projected features",
    summary: "",
    doesNot: [
      "choose a serving cell — the source reported it",
      "synthesize interference from SINR, distance, or load",
      "suppress an edge whose target is absent",
    ],
  },
  {
    index: 5,
    id: "temporal_linking",
    label: "Temporal Linking",
    input: "The graphs of every timestep",
    output: "temporal_index + derived handover events",
    summary: "",
    doesNot: [
      "make handover an edge inside any single graph",
      "record a handover_type it cannot derive",
      "emit an event where the serving cell did not change",
    ],
  },
];

function buildSnapshots(
  first: TimestepStages,
  linked: readonly RanGraph[],
  events: readonly HandoverEvent[],
  schema: GraphSchema,
): PassSnapshot[] {
  const emptyStores = schema.edgeTypes
    .filter((t) => !ruleOf(schema, t.constructionRule)?.constructs)
    .map((t) => t.name);

  const featureCount = first.featured.reduce(
    (total, node) => total + Object.keys(node.features).length,
    0,
  );
  const linkCount = Object.keys(linked[0]?.temporalIndex ?? {}).length;

  const summaries = [
    `${first.structural.length} entities conform to Schema ${schema.version}`,
    `${first.structural.length} typed nodes: ${countByType(first.structural)}`,
    `${featureCount} canonical feature values attached`,
    `${first.edges.length} association edges · ${emptyStores.join(", ")} store empty by declaration`,
    `${linkCount} continuity links · ${events.length} handover event${events.length === 1 ? "" : "s"}`,
  ];

  return CONTRACTS.map((contract, i) => ({
    contract: { ...contract, summary: summaries[i] },
    nodes: i === 0 ? [] : i === 1 ? first.structural : first.featured,
    edges: i >= 3 ? first.edges : [],
    temporalIndex: i >= 4 ? (linked[0]?.temporalIndex ?? null) : null,
    events: i >= 4 ? [...events] : [],
  }));
}

function countByType(nodes: readonly GraphNode[]): string {
  const counts = new Map<string, number>();
  for (const node of nodes) {
    counts.set(node.key.nodeType, (counts.get(node.key.nodeType) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, n]) => `${n} ${type}`)
    .join(", ");
}
