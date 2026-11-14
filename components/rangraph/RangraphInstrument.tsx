"use client";
import { useMemo, useState } from "react";
import { ArrowRight, Download, TriangleAlert, Check } from "lucide-react";
import {
  runPipeline,
  withDanglingReference,
  SCHEMA_1_0_0,
} from "@/lib/rangraph";
import type { GraphNode } from "@/lib/rangraph";
const stages = [
  "Source",
  "Contract",
  "Nodes",
  "Features",
  "Relationships",
  "Temporal",
  "Canonical IR",
  "Graph",
];
const positions: Record<string, [number, number]> = {
  "gnb-1": [29, 27],
  "gnb-2": [73, 27],
  "ue-1": [17, 73],
  "ue-2": [50, 73],
  "ue-3": [84, 73],
  "gnb-missing": [52, 27],
};
export default function RangraphInstrument() {
  const [stage, setStage] = useState(0);
  const [time, setTime] = useState(0);
  const [selected, setSelected] = useState("ue-1");
  const [fault, setFault] = useState(false);
  const [tab, setTab] = useState<"record" | "mapping" | "ir" | "schema">(
    "record",
  );
  const run = useMemo(
    () => (fault ? runPipeline(withDanglingReference()) : runPipeline()),
    [fault],
  );
  const effectiveTime = stage < 5 ? 0 : time;
  const graph = run.sequence.graphs[effectiveTime];
  const snapshot =
    stage > 0 && stage < 6
      ? run.compiled.snapshots[Math.min(stage - 1, 4)]
      : undefined;
  const nodes: GraphNode[] =
    stage < 2 ? [] : stage < 5 ? snapshot?.nodes || [] : graph.nodes;
  const edges =
    stage < 4 ? [] : stage === 4 ? snapshot?.edges || [] : graph.edges;
  const raw = run.raw.find(
    (r) =>
      r.entity_id === selected && r.timestamp_ms === (effectiveTime + 1) * 1000,
  )!;
  const entity = run.entities.find(
    (r) => r.id === selected && r.timestamp === effectiveTime + 1,
  );
  const node = graph.nodes.find((n) => n.key.entityId === selected);
  const findings = run.report.findings.filter((f) => f.severity === "error");
  function download() {
    if (!run.errorFree) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            representation:
              "RANGraph browser fixture model; not Python execution",
            sequence: run.sequence,
            validation: run.report,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rangraph-fixture-ir.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="instrument rangraph-instrument">
      <div className="instrument-bar mono">
        <span>
          <i className="status-dot" /> COMPUTED BROWSER FIXTURE
        </span>
        <span>SCHEMA 1.0.0 / MOCK E2</span>
      </div>
      <div className="pipeline-rail" aria-label="Select transformation stage">
        {stages.map((name, i) => (
          <button
            key={name}
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
          >
            <small>{String(i).padStart(2, "0")}</small>
            {name}
            {i < 7 && <ArrowRight size={12} />}
          </button>
        ))}
      </div>
      <div className="graph-toolbar">
        <div className="segmented" aria-label="Fixture timestep">
          {[0, 1].map((t) => (
            <button
              key={t}
              disabled={stage < 5 && t === 1}
              onClick={() => setTime(t)}
              aria-pressed={effectiveTime === t}
            >
              t = {t + 1} s
            </button>
          ))}
        </div>
        <label className="fault-toggle">
          <input
            type="checkbox"
            checked={fault}
            onChange={(e) => {
              setFault(e.target.checked);
              setSelected("ue-2");
            }}
          />{" "}
          Inject dangling reference
        </label>
        <button
          className="text-button"
          onClick={download}
          disabled={!run.errorFree}
        >
          <Download size={15} /> EXPORT IR
        </button>
      </div>
      <div className="graph-workspace">
        <div className="graph-region">
          <div className="viewport-label mono">
            {stages[stage].toUpperCase()}
            <span>SCHEMATIC LAYOUT</span>
          </div>
          {stage < 2 ? (
            <div className="source-stage">
              <div className="source-token">{stage === 0 ? "{ }" : "✓"}</div>
              <h2>
                {stage === 0
                  ? "Observations, before assumptions."
                  : "An explicit contract."}
              </h2>
              <p>
                {stage === 0
                  ? "Select a record to inspect its original fields."
                  : "Source entities are checked against declared node types and required identity fields."}
              </p>
              <div className="record-strip">
                {run.raw
                  .filter((r) => r.timestamp_ms === 1000)
                  .map((r) => (
                    <button
                      key={r.entity_id}
                      aria-pressed={selected === r.entity_id}
                      onClick={() => setSelected(r.entity_id)}
                    >
                      {r.entity_id}
                    </button>
                  ))}
              </div>
              <button
                className="text-button signal"
                onClick={() => setStage(stage + 1)}
              >
                NEXT TRANSFORMATION <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="graph-canvas">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {edges.map((edge, i) => {
                  const a = positions[edge.source.entityId],
                    b = positions[edge.target.entityId];
                  return (
                    <line
                      key={i}
                      x1={a?.[0]}
                      y1={a?.[1]}
                      x2={b?.[0]}
                      y2={b?.[1]}
                      stroke={
                        edge.target.entityId === "gnb-missing"
                          ? "var(--fault)"
                          : "var(--signal)"
                      }
                      strokeWidth=".22"
                    />
                  );
                })}
              </svg>
              {nodes.map((n) => {
                const [x, y] = positions[n.key.entityId] || [50, 50];
                return (
                  <button
                    style={{ left: `${x}%`, top: `${y}%` }}
                    key={n.key.entityId}
                    onClick={() => {
                      setSelected(n.key.entityId);
                      setTab(stage >= 3 ? "ir" : "record");
                    }}
                    aria-pressed={selected === n.key.entityId}
                    className={`graph-node ${n.key.nodeType === "gNB" ? "base-station" : ""}`}
                  >
                    <span className="graph-node-symbol">
                      {n.key.nodeType === "gNB" ? "⌁" : "·"}
                    </span>
                    <strong>{n.key.entityId}</strong>
                    <small>{n.key.nodeType}</small>
                  </button>
                );
              })}
              {edges.some((e) => e.target.entityId === "gnb-missing") && (
                <div
                  className="missing-node"
                  style={{ left: "52%", top: "27%" }}
                >
                  <TriangleAlert size={24} />
                  <span>gnb-missing</span>
                  <small>UNRESOLVED REFERENCE</small>
                </div>
              )}
            </div>
          )}
          <div className="graph-caption">
            <span className="mono">
              {stage < 2
                ? "SOURCE ENTITIES"
                : `${nodes.length} NODES / ${edges.length} ASSOCIATIONS`}
            </span>
            <p>
              {stage === 0
                ? "The original golden trace contains two timesteps."
                : stage === 1
                  ? "Verification reports issues; it does not silently repair inputs."
                  : stage === 2
                    ? "Typed identities are instantiated before features are attached."
                    : stage === 3
                      ? "Feature values follow the declared ingestion conversions."
                      : stage === 4
                        ? "Association follows the source serving_gnb_id reference."
                        : stage === 5
                          ? "Identity continues across timesteps; ue-2 changes serving cell."
                          : "Relationships and values shown here come from the computed fixture."}
            </p>
          </div>
        </div>
        <aside className="record-inspector">
          <div className="inspector-heading">
            <span className="mono gold">INSPECT ENTITY</span>
            <select
              aria-label="Select entity"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {graph.nodes.map((n) => (
                <option key={n.key.entityId}>{n.key.entityId}</option>
              ))}
            </select>
          </div>
          <div className="inspector-tabs">
            {(["record", "mapping", "ir", "schema"] as const).map((t) => (
              <button
                key={t}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          {tab === "mapping" ? (
            <div className="mapping-list">
              {entity?.origins.map((o, i) => (
                <div key={i}>
                  <span className="mono signal">
                    {o.source} → {o.canonical}
                  </span>
                  <strong>
                    {o.from} → {o.to}
                  </strong>
                  <p>{o.rule}</p>
                </div>
              ))}
            </div>
          ) : (
            <pre tabIndex={0} aria-label={`${tab} data for ${selected}`}>
              {JSON.stringify(
                tab === "record" ? raw : tab === "schema" ? SCHEMA_1_0_0 : node,
                null,
                2,
              )}
            </pre>
          )}
        </aside>
      </div>
      <div
        className={`validation-result ${run.errorFree ? "valid" : "invalid"}`}
        role="status"
      >
        <div>
          {run.errorFree ? <Check size={19} /> : <TriangleAlert size={19} />}
          <strong>
            {run.errorFree ? "VALIDATION PASSED" : "VALIDATION ERRORS"}
          </strong>
          <span className="mono">FULL FIXTURE · BOTH TIMESTEPS</span>
        </div>
        {run.errorFree ? (
          <p>
            The fixture passes the browser model’s validation. JSON export is
            available.
          </p>
        ) : (
          <ul>
            {findings.map((f, i) => (
              <li key={i}>
                <b>{f.code}</b> {f.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {stage >= 5 && (
        <div className="handover-note">
          <span className="mono gold">DERIVED TEMPORAL EVENT</span>
          {run.sequence.handoverEvents.length ? (
            run.sequence.handoverEvents.map((e, i) => (
              <p key={i}>
                {e.ueId}: {e.sourceGnbId} → {e.targetGnbId}{" "}
                <span className="muted">
                  between {e.fromTimestamp} s and {e.toTimestamp} s
                </span>
              </p>
            ))
          ) : (
            <p>No handover event is derived from this modified fixture.</p>
          )}
        </div>
      )}
    </section>
  );
}
