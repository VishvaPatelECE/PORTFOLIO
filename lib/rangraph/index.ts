/**
 * The demo's source trace and the one function that runs the whole model.
 *
 * The records below are the repository's own golden fixture
 * (`tests/fixtures/mock_e2/golden_scenario.jsonl`), verbatim. Everything the
 * visualization displays is derived from them at runtime by `runPipeline` —
 * nothing downstream is written by hand, which is what makes the intermediate
 * states worth looking at.
 */

import { ingest } from "./ingest";
import { compile } from "./compile";
import { SCHEMA_1_0_0 } from "./schema";
import { isErrorFree, validateSequence } from "./validate";
import type {
  RawRecord,
  SemanticEntity,
  GraphSequence,
  ValidationReport,
} from "./types";
import type { CompileResult } from "./compile";

/** The golden MockE2 trace: two timesteps, three UEs, two gNBs, one handover. */
export const GOLDEN_TRACE: RawRecord[] = [
  {
    entity_id: "gnb-1",
    entity_type: "gNB",
    timestamp_ms: 1000,
    measurements: {
      load: 0.35,
      position: [0.0, 0.0],
      tx_power: 43.0,
      num_connected_ues: 2,
    },
  },
  {
    entity_id: "gnb-2",
    entity_type: "gNB",
    timestamp_ms: 1000,
    measurements: {
      load: 0.1,
      position: [500.0, 0.0],
      tx_power: 43.0,
      num_connected_ues: 0,
    },
  },
  {
    entity_id: "ue-1",
    entity_type: "UE",
    timestamp_ms: 1000,
    measurements: {
      serving_gnb_id: "gnb-1",
      sinr_linear: 100.0,
      cqi: 12,
      rb_allocation: 10,
      mobility_speed: 1.5,
    },
  },
  {
    entity_id: "ue-2",
    entity_type: "UE",
    timestamp_ms: 1000,
    measurements: {
      serving_gnb_id: "gnb-1",
      sinr_linear: 10.0,
      cqi: 9,
      rb_allocation: 8,
      mobility_speed: 0.0,
    },
  },
  {
    entity_id: "ue-3",
    entity_type: "UE",
    timestamp_ms: 1000,
    measurements: {
      serving_gnb_id: null,
      sinr_linear: 0.1,
      cqi: 3,
      rb_allocation: null,
      mobility_speed: 12.5,
    },
  },
  {
    entity_id: "gnb-1",
    entity_type: "gNB",
    timestamp_ms: 2000,
    measurements: {
      load: 0.4,
      position: [0.0, 0.0],
      tx_power: 43.0,
      num_connected_ues: 1,
    },
  },
  {
    entity_id: "gnb-2",
    entity_type: "gNB",
    timestamp_ms: 2000,
    measurements: { load: 0.2, position: [500.0, 0.0], num_connected_ues: 1 },
  },
  {
    entity_id: "ue-1",
    entity_type: "UE",
    timestamp_ms: 2000,
    measurements: {
      serving_gnb_id: "gnb-1",
      sinr_linear: 1000.0,
      cqi: 14,
      rb_allocation: 12,
      mobility_speed: 1.5,
    },
  },
  {
    entity_id: "ue-2",
    entity_type: "UE",
    timestamp_ms: 2000,
    measurements: {
      serving_gnb_id: "gnb-2",
      sinr_linear: 10.0,
      cqi: 9,
      rb_allocation: 8,
      mobility_speed: 0.0,
    },
  },
  {
    entity_id: "ue-3",
    entity_type: "UE",
    timestamp_ms: 2000,
    measurements: {
      serving_gnb_id: null,
      sinr_linear: 0.01,
      cqi: 2,
      rb_allocation: 4,
      mobility_speed: 12.5,
    },
  },
];

export interface PipelineRun {
  raw: RawRecord[];
  entities: SemanticEntity[];
  compiled: CompileResult;
  sequence: GraphSequence;
  report: ValidationReport;
  errorFree: boolean;
}

/**
 * Run the whole model: raw → ingest → compile → validate.
 *
 * Pure and synchronous. Called once per interaction, so the animation reads a
 * settled result rather than racing a computation.
 */
export function runPipeline(
  records: readonly RawRecord[] = GOLDEN_TRACE,
): PipelineRun {
  const entities = ingest(records, SCHEMA_1_0_0);
  const compiled = compile(entities, SCHEMA_1_0_0);
  const report = validateSequence(compiled.sequence, SCHEMA_1_0_0);

  return {
    raw: [...records],
    entities,
    compiled,
    sequence: compiled.sequence,
    report,
    errorFree: isErrorFree(report),
  };
}

/**
 * The same trace with `ue-2`'s serving cell renamed to a gNB that never reports.
 *
 * The defect is injected at the *source*, so the dangling edge is built by the
 * compiler exactly as it would be in Python — the demo does not fabricate a
 * finding, it produces the graph that earns one.
 */
export function withDanglingReference(
  records: readonly RawRecord[] = GOLDEN_TRACE,
): RawRecord[] {
  return records.map((record) =>
    record.entity_type === "UE" && record.entity_id === "ue-2"
      ? {
          ...record,
          measurements: {
            ...record.measurements,
            serving_gnb_id: "gnb-missing",
          },
        }
      : record,
  );
}

export { SCHEMA_1_0_0 } from "./schema";
export * from "./types";
