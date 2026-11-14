/**
 * Types for the in-browser pipeline model.
 *
 * These mirror the Python contracts in `src/rangraph/` closely enough that the
 * demo derives every intermediate state rather than displaying a prepared
 * answer — but they are a *frontend model*, not a port. Nothing here executes
 * Python.
 */

/** The value domain of one feature. Mirrors `ir.FeatureValue`. */
export type FeatureValue = number | string | boolean | null | readonly number[];

/* ---------------------------------------------------------------- */
/* Source layer                                                      */
/* ---------------------------------------------------------------- */

/** One line of a MockE2 JSONL trace, exactly as the source writes it. */
export interface RawRecord {
  entity_id: string;
  entity_type: string;
  timestamp_ms: number;
  measurements: Record<string, unknown>;
}

/* ---------------------------------------------------------------- */
/* Ingestion layer                                                   */
/* ---------------------------------------------------------------- */

/** How one canonical field was obtained from the source record. */
export interface FieldOrigin {
  /** Canonical field name the schema declares. */
  canonical: string;
  /** Source field the adapter read. */
  source: string;
  /** Source value, rendered. */
  from: string;
  /** Canonical value, rendered. */
  to: string;
  /** The conversion the adapter's contract declares. */
  rule: string;
  /** Which kind of source difference this absorbed. */
  kind: "identity" | "unit" | "reference" | "copied" | "null";
}

/** Mirrors `ingestion.entities.SemanticEntity`, plus per-field provenance. */
export interface SemanticEntity {
  id: string;
  type: string;
  /** Canonical seconds. */
  timestamp: number;
  attributes: Record<string, FeatureValue>;
  origins: FieldOrigin[];
}

/* ---------------------------------------------------------------- */
/* IR layer                                                         */
/* ---------------------------------------------------------------- */

export interface NodeKey {
  nodeType: string;
  entityId: string;
}

export interface GraphNode {
  key: NodeKey;
  timestamp: number;
  features: Record<string, FeatureValue>;
  references: Record<string, string | null>;
}

export interface GraphEdge {
  type: string;
  source: NodeKey;
  target: NodeKey;
  features: Record<string, FeatureValue>;
}

export interface RanGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Identity continuity into the next timestep, or `null` when standalone. */
  temporalIndex: Record<string, string> | null;
  metadata: {
    schemaVersion: string;
    sourceAdapter: string;
    sourceAdapterVersion: string;
    scenarioId: string;
  };
}

export interface HandoverEvent {
  ueId: string;
  sourceGnbId: string;
  targetGnbId: string;
  fromTimestamp: number;
  toTimestamp: number;
}

export interface GraphSequence {
  graphs: RanGraph[];
  handoverEvents: HandoverEvent[];
}

/* ---------------------------------------------------------------- */
/* Validation layer                                                  */
/* ---------------------------------------------------------------- */

export type Severity = "error" | "warning";

export type Category =
  "structural" | "feature" | "reference" | "edge" | "temporal" | "association";

export interface Finding {
  category: Category;
  severity: Severity;
  /** Stable code from the closed registry, e.g. `EDGE002`. */
  code: string;
  /** The registry name, e.g. `DANGLING_EDGE_TARGET`. */
  name: string;
  message: string;
  timestepIndex: number | null;
  node: string | null;
  edge: string | null;
  feature: string | null;
  event: string | null;
}

export interface Diagnostics {
  timestepIndex: number;
  timestamp: number | null;
  nodeCount: number;
  edgeCount: number;
  density: number;
  minDegree: number;
  maxDegree: number;
  meanDegree: number;
}

export interface ValidationReport {
  findings: Finding[];
  diagnostics: Diagnostics[];
  schemaVersion: string;
}

export function keyOf(key: NodeKey): string {
  return `${key.nodeType}:${key.entityId}`;
}

export function edgeLabel(edge: GraphEdge): string {
  return `${edge.type}: ${keyOf(edge.source)} -> ${keyOf(edge.target)}`;
}
