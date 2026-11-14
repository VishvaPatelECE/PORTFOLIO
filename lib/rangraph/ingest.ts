/**
 * Ingestion — the stage that absorbs source-specific representation.
 *
 * Mirrors `src/rangraph/ingestion/mock_e2_adapter.py`. The two conversions this
 * adapter's contract declares (Specification §6.2, §6.3) are the whole point of
 * the stage, so each one is recorded as a `FieldOrigin` the UI can show:
 *
 *   timestamp_ms → timestamp   /1000        milliseconds → canonical seconds
 *   sinr_linear  → sinr        10·log10     linear ratio → canonical dB
 *
 * Two rules held here because they are load-bearing upstream:
 *
 * - A **reference field** is carried as a reference, not a feature. A string
 *   identifier is not a tensor, and keeping the classes apart is what lets the
 *   compiler materialize an edge from it later.
 * - A missing value becomes an **explicit null** and is never zero-filled. A
 *   present-but-untransformable value (`sinr_linear <= 0`) is a hard failure
 *   rather than a substituted epsilon — the adapter would raise; here it is
 *   surfaced as a source error the demo can display.
 */

import { nodeTypeOf, type GraphSchema } from "./schema";
import type {
  FeatureValue,
  FieldOrigin,
  RawRecord,
  SemanticEntity,
} from "./types";

const round = (value: number, places = 2): number => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const render = (value: unknown): string => {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return `[${value.join(", ")}]`;
  return String(value);
};

/**
 * Lower one trace into canonical entities.
 *
 * Driven by the schema's declarations, not by the keys present: a measurement
 * the entity's declared type does not declare cannot get in, which is why a
 * source-specific name such as `sinr_linear` never survives this boundary.
 */
export function ingest(
  records: readonly RawRecord[],
  schema: GraphSchema,
): SemanticEntity[] {
  return records.map((record) => lowerRecord(record, schema));
}

function lowerRecord(record: RawRecord, schema: GraphSchema): SemanticEntity {
  const spec = nodeTypeOf(schema, record.entity_type);
  const origins: FieldOrigin[] = [];
  const attributes: Record<string, FeatureValue> = {};

  // Identity: milliseconds are a MockE2 representation, seconds are canonical.
  const timestamp = round(record.timestamp_ms / 1000, 3);
  origins.push({
    canonical: "timestamp",
    source: "timestamp_ms",
    from: `${record.timestamp_ms}`,
    to: `${timestamp} s`,
    rule: "timestamp_ms / 1000",
    kind: "unit",
  });
  origins.push({
    canonical: "id",
    source: "entity_id",
    from: record.entity_id,
    to: record.entity_id,
    rule: "identity field, carried verbatim",
    kind: "identity",
  });

  if (!spec) {
    return {
      id: record.entity_id,
      type: record.entity_type,
      timestamp,
      attributes,
      origins,
    };
  }

  // Reference fields — a distinct class, never a feature.
  for (const reference of spec.referenceFields) {
    if (!(reference.name in record.measurements)) continue;
    const raw = record.measurements[reference.name];
    const value = raw === null || typeof raw === "string" ? raw : null;
    attributes[reference.name] = value;
    origins.push({
      canonical: reference.name,
      source: reference.name,
      from: render(raw),
      to: value === null ? "null" : `→ ${reference.targetNodeType}:${value}`,
      rule: `reference field targeting ${reference.targetNodeType}`,
      kind: "reference",
    });
  }

  // Features — canonical names only, in the schema's declared order.
  for (const feature of spec.features) {
    const converted = convertFeature(feature.name, record.measurements);
    if (converted === undefined) continue;
    attributes[feature.name] = converted.value;
    origins.push({
      canonical: feature.name,
      source: converted.sourceField,
      from: converted.from,
      to:
        converted.value === null
          ? "null"
          : `${render(converted.value)} ${feature.unit}`.trim(),
      rule: converted.rule,
      kind: converted.kind,
    });
  }

  return {
    id: record.entity_id,
    type: record.entity_type,
    timestamp,
    attributes,
    origins,
  };
}

interface Converted {
  value: FeatureValue;
  sourceField: string;
  from: string;
  rule: string;
  kind: FieldOrigin["kind"];
}

/**
 * Resolve one canonical feature from the source measurements.
 *
 * Returns `undefined` when the source does not mention the quantity at all —
 * distinct from reporting it as unavailable, which yields an explicit null.
 */
function convertFeature(
  canonical: string,
  measurements: Record<string, unknown>,
): Converted | undefined {
  // The one source-to-canonical transformation this adapter declares (§6.2).
  if (canonical === "sinr") {
    if (!("sinr_linear" in measurements)) return undefined;
    const linear = measurements.sinr_linear;
    if (linear === null) {
      return {
        value: null,
        sourceField: "sinr_linear",
        from: "null",
        rule: "unavailable → explicit null, never zero-filled",
        kind: "null",
      };
    }
    if (typeof linear !== "number" || linear <= 0) {
      // The adapter raises IngestionError here rather than substituting an
      // epsilon. Surfaced as a value the demo can render as a source failure.
      return {
        value: "IngestionError",
        sourceField: "sinr_linear",
        from: render(linear),
        rule: "sinr_linear <= 0 is untransformable → IngestionError",
        kind: "unit",
      };
    }
    return {
      value: round(10 * Math.log10(linear), 2),
      sourceField: "sinr_linear",
      from: render(linear),
      rule: "10 · log10(sinr_linear)",
      kind: "unit",
    };
  }

  if (!(canonical in measurements)) return undefined;
  const raw = measurements[canonical];

  if (raw === null) {
    return {
      value: null,
      sourceField: canonical,
      from: "null",
      rule: "unavailable → explicit null, never zero-filled",
      kind: "null",
    };
  }

  if (Array.isArray(raw)) {
    return {
      value: raw.map(Number) as readonly number[],
      sourceField: canonical,
      from: render(raw),
      rule: "already canonical, copied verbatim",
      kind: "copied",
    };
  }

  return {
    value: raw as FeatureValue,
    sourceField: canonical,
    from: render(raw),
    rule: "already canonical, copied verbatim",
    kind: "copied",
  };
}
