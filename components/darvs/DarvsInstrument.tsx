"use client";
import { useReducer, useState } from "react";
import { darvsPreviewReducer, initialDarvsPreview, previewChallenges } from "@/lib/models/darvsPreview";
import { darvsStages } from "@/lib/content/darvs";
import {
  ArrowRight,
  Check,
  ScanLine,
  ScanFace,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
const stages = darvsStages;
const stageIcons = { MTCNN: ScanFace, LIVENESS: ScanLine, FACENET: Fingerprint, DECISION: ShieldCheck } as const;
export default function DarvsInstrument() {
  const [stage, setStage] = useState(0);
  const [state, dispatch] = useReducer(darvsPreviewReducer, initialDarvsPreview);
  const present = state.region;
  const challenge = state.responses;
  const live = present && challenge === previewChallenges.length;
  const match = state.match;
  const current = stages[stage];
  const Icon = stageIcons[current.name];
  const challenges = previewChallenges;
  return (
    <section className="instrument darvs-instrument">
      <div className="instrument-bar mono">
        <span>
          <i className="status-dot" /> ARCHITECTURE DEMO
        </span>
        <span>NO CAMERA / MODEL INFERENCE</span>
      </div>
      <div className="stage-rail" aria-label="Select a DARVS stage">
        <span className="stage-source">CAMERA →</span>
        {stages.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setStage(i)}
            aria-pressed={stage === i}
          >
            <small>0{i + 1}</small>
            {s.name}
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
      <div className="darvs-body">
        <div className="darvs-viewport">
          <div className="viewport-label mono">
            {current.kind}
            <span>ILLUSTRATIVE STATE</span>
          </div>
          {stage === 0 && (
            <div className="detection-demo">
              <div className={`detection-region ${present ? "detected" : ""}`}>
                <div className="target-corner tl" />
                <div className="target-corner tr" />
                <div className="target-corner bl" />
                <div className="target-corner br" />
                <ScanFace size={94} strokeWidth={0.6} />
                <span className="mono">
                  {present ? "FACE REGION LOCATED" : "NO FACE REGION"}
                </span>
              </div>
              <button className="button" onClick={() => dispatch({ type: "toggle-region" })}>
                {present ? "SHOW EMPTY FRAME" : "SHOW DETECTION EXAMPLE"}
              </button>
            </div>
          )}
          {stage === 1 && (
            <div className="challenge-demo">
              <span className="mono muted">EXAMPLE CHALLENGE SEQUENCE</span>
              <div className="challenge-symbol">
                {challenge < 3 ? (
                  ["←", "↑", "—"][challenge]
                ) : (
                  <Check size={72} />
                )}
              </div>
              <strong>
                {challenge < 3 ? challenges[challenge] : "SEQUENCE COMPLETE"}
              </strong>
              <div className="challenge-progress">
                {challenges.map((c, i) => (
                  <span key={c} className={i < challenge ? "complete" : ""}>
                    {i < challenge ? "✓" : `0${i + 1}`} {c}
                  </span>
                ))}
              </div>
              <button
                className="button"
                disabled={!present}
                onClick={() => dispatch({ type: challenge < challenges.length ? "respond" : "reset-challenges" })}
              >
                {challenge < 3 ? "MARK EXAMPLE RESPONSE" : "RESET EXAMPLE"}{" "}
                <ArrowRight size={15} />
              </button>
            </div>
          )}
          {stage === 2 && (
            <div className="embedding-demo">
              <div className="embedding-flow">
                <div className="embedding-samples" aria-hidden="true">
                  {Array.from({ length: 16 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <ArrowRight />
                <div className="vector-bracket">
                  [ <span>f</span> ]
                </div>
                <ArrowRight />
                <Fingerprint size={65} strokeWidth={0.8} />
              </div>
              <h3>
                One representation.
                <br />A comparison space.
              </h3>
              <p>Detected face → embedding → cosine similarity</p>
              <span className="mono muted">
                STRUCTURE ONLY · NO GENERATED EMBEDDING
              </span>
            </div>
          )}
          {stage === 3 && (
            <div className="decision-demo">
              <div
                className={`decision-mark ${live && match ? "pass" : "reject"}`}
              >
                <ShieldCheck size={54} />
                <strong>{live && match ? "ACCEPT" : "REJECT"}</strong>
                <span className="mono">IN THIS EXAMPLE</span>
              </div>
              <div className="decision-inputs">
                <button aria-pressed={live} disabled={!live} onClick={() => dispatch({ type: "reset-challenges" })}>
                  LIVENESS <b>{live ? "COMPLETE" : "INCOMPLETE"}</b>
                </button>
                <button aria-pressed={match} disabled={!live} onClick={() => dispatch({ type: "toggle-match" })}>
                  IDENTITY <b>{match ? "MATCH" : "NO MATCH"}</b>
                </button>
              </div>
              <p>
                {!live
                  ? "Identity recognition remains gated until the challenge completes."
                  : !match
                    ? "Liveness alone does not establish identity."
                    : "The illustrative liveness and identity conditions are satisfied."}
              </p>
            </div>
          )}
        </div>
        <div className="stage-explanation" aria-live="polite">
          <Icon size={28} strokeWidth={1} />
          <span className="mono signal">
            {current.name} / STAGE 0{stage + 1}
          </span>
          <h2>{current.title}</h2>
          <p>{current.body}</p>
          <div className="source-note">
            <span className="mono gold">IMPLEMENTATION NOTE</span>
            <p>{current.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
