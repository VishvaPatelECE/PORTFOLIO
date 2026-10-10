"use client";
import { useEffect, useMemo, useReducer, useState } from "react";
import { LockKeyhole, Unlock, RotateCcw, Play } from "lucide-react";
import {
  hardwareReducer,
  initialHardware,
  sensorsSafe,
  type HardwareAction,
  type Sensor,
} from "@/lib/models/usmhacs";
import {
  createScenarioScheduler,
  type Scenario,
} from "@/lib/schedulers/scenarios";
import Circuit from "./Circuit";
export default function HardwareInstrument() {
  const [state, dispatch] = useReducer(hardwareReducer, initialHardware);
  const [sensorsOpen, setSensorsOpen] = useState(true);
  const scheduler = useMemo(() => createScenarioScheduler(dispatch), []);
  useEffect(() => () => scheduler.cancel(), [scheduler]);
  useEffect(() => {
    if (state.codeState !== "correct" || state.delayStatus !== "waiting")
      return;
    const token = state.delayToken;
    const timer = setTimeout(() => dispatch({ type: "delay", token }), 5000);
    return () => clearTimeout(timer);
  }, [state.codeState, state.delayStatus, state.delayToken]);
  const send = (a: HardwareAction) => {
    scheduler.cancel();
    dispatch(a);
  };
  const run = (s: Scenario) => scheduler.run(s);
  return (
    <section className="instrument hardware-instrument">
      <div className="instrument-bar mono">
        <span>
          <i className="status-dot" /> BROWSER LOGIC SIMULATOR
        </span>
        <span>NO PHYSICAL HARDWARE CONNECTED</span>
      </div>
      <div className="hardware-status">
        <div>
          <span className="mono muted">ACCESS STATE</span>
          <h2
            className={
              state.isLatched ? "fault" : state.doorOpen ? "signal" : ""
            }
          >
            {state.isLatched
              ? "LOCKOUT"
              : state.doorOpen
                ? "DOOR OPEN"
                : "STANDBY"}
            <span className="state-light" />
          </h2>
        </div>
        <div
          className={`door-visual ${state.doorOpen ? "door-open" : ""}`}
          aria-hidden="true"
        >
          <div />
          <div />
          {state.doorOpen ? <Unlock size={25} /> : <LockKeyhole size={25} />}
        </div>
        <button className="text-button" onClick={() => send({ type: "clear" })}>
          <RotateCcw size={15} /> RESTART SIMULATOR
        </button>
      </div>
      <Circuit state={state} />
      <div className="hardware-controls">
        <div className="input-column">
          <div className="input-title">
            <h3>Operate the inputs</h3>
            <span className="mono muted">CHANGES ARE IMMEDIATE</span>
          </div>
          <div className="sensor-control">
            <button
              className="sensor-heading"
              onClick={() => setSensorsOpen(!sensorsOpen)}
              aria-expanded={sensorsOpen}
            >
              SENSORS{" "}
              <span className={!sensorsSafe(state) ? "fault" : "signal"}>
                {sensorsSafe(state) ? "ALL SAFE" : "BREACH DETECTED"}{" "}
                {sensorsOpen ? "−" : "+"}
              </span>
            </button>
            {sensorsOpen && (
              <div className="sensor-list">
                {(["magnetic", "temp", "pressure", "laser"] as Sensor[]).map(
                  (sensor) => (
                    <button
                      key={sensor}
                      aria-pressed={!state.sensors[sensor]}
                      onClick={() =>
                        send({
                          type: "sensor",
                          sensor,
                          safe: !state.sensors[sensor],
                        })
                      }
                    >
                      <span>
                        {sensor === "temp"
                          ? "Temperature"
                          : sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                      </span>
                      <b className={state.sensors[sensor] ? "signal" : "fault"}>
                        {state.sensors[sensor] ? "SAFE" : "BREACHED"}
                      </b>
                      <span
                        className={`switch ${state.sensors[sensor] ? "on" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
          <button
            className="input-control"
            aria-pressed={state.physicalKey}
            onClick={() => send({ type: "key", value: !state.physicalKey })}
          >
            <span>PHYSICAL KEY</span>
            <b className={state.physicalKey ? "signal" : ""}>
              {state.physicalKey ? "INSERTED" : "ABSENT"}
            </b>
            <span
              className={`switch ${state.physicalKey ? "on" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            className="input-control"
            onClick={() =>
              send({
                type: "code",
                value:
                  state.codeState === "idle"
                    ? "correct"
                    : state.codeState === "correct"
                      ? "wrong"
                      : "idle",
              })
            }
          >
            <span>
              CODE STATE <small>Click to cycle</small>
            </span>
            <b
              className={
                state.codeState === "wrong"
                  ? "fault"
                  : state.codeState === "correct"
                    ? "signal"
                    : ""
              }
            >
              {state.codeState.toUpperCase()}
            </b>
            <span aria-hidden="true">↻</span>
          </button>
          <div className="input-control">
            <span>
              SECURITY DELAY <small>Begins with correct code</small>
            </span>
            <b className={state.delayStatus === "ok" ? "signal" : "gold"}>
              {state.delayStatus === "waiting"
                ? "WAITING · 5 s"
                : state.delayStatus === "ok"
                  ? "COMPLETE"
                  : "IDLE"}
            </b>
          </div>
          <button
            className="input-control"
            aria-pressed={state.tamperDetected}
            onClick={() =>
              send({ type: "tamper", value: !state.tamperDetected })
            }
          >
            <span>CASING TAMPER</span>
            <b className={state.tamperDetected ? "fault" : "signal"}>
              {state.tamperDetected ? "DETECTED" : "CLEAR"}
            </b>
            <span
              className={`switch ${state.tamperDetected ? "danger" : ""}`}
              aria-hidden="true"
            />
          </button>
          <div className="mobile-flow-output">
            <div className="input-control">
              <span>INTERLOCK</span>
              <b className={state.doorOpen ? "signal" : "gold"}>
                {state.doorOpen ? "SATISFIED" : "HOLD"}
              </b>
            </div>
            <div className="input-control">
              <span>DOOR</span>
              <b className={state.doorOpen ? "signal" : ""}>
                {state.doorOpen ? "OPEN" : "CLOSED"}
              </b>
            </div>
          </div>
          <div className="reset-row">
            <button className="button" onClick={() => send({ type: "reset" })}>
              <RotateCcw size={15} /> PROTECTED RESET
            </button>
            <p>Clear unsafe inputs before releasing the latch.</p>
          </div>
        </div>
        <div className="event-column">
          <h3>Run a scenario</h3>
          <div className="scenario-controls">
            <button onClick={() => run("perfect")}>
              <Play size={13} /> Perfect entry
            </button>
            <button onClick={() => run("brute")}>
              <Play size={13} /> Brute force <span>wrong-code lockout</span>
            </button>
            <button onClick={() => run("breach")}>
              <Play size={13} /> Environment breach
            </button>
          </div>
          <div className="event-title mono">
            <span>EVENT LOG</span>
            <span>LAST {state.logs.length} EVENTS</span>
          </div>
          <ol
            className="event-log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {state.logs.length ? (
              state.logs.map((log) => (
                <li key={log.id}>
                  <span className="mono muted">
                    {String(log.id).padStart(3, "0")}
                  </span>
                  <span
                    className={
                      log.kind === "fault"
                        ? "fault"
                        : log.kind === "success"
                          ? "signal"
                          : ""
                    }
                  >
                    {log.message}
                  </span>
                </li>
              ))
            ) : (
              <li>
                <span className="muted">
                  Ready. Change an input or start a scenario.
                </span>
              </li>
            )}
          </ol>
          <div className="interlock-summary">
            <span className="mono muted">DOOR INTERLOCK</span>
            <p>Key present + delay complete + no tamper + latch clear</p>
            <strong className={state.doorOpen ? "signal" : ""}>
              {state.doorOpen ? "SATISFIED → OPEN" : "NOT SATISFIED → CLOSED"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
