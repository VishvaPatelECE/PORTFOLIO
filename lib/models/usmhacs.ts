export type Sensor = "magnetic" | "temp" | "pressure" | "laser";
export type CodeState = "idle" | "correct" | "wrong";
export interface HardwareState {
  sensors: Record<Sensor, boolean>;
  physicalKey: boolean;
  codeState: CodeState;
  delayStatus: "idle" | "waiting" | "ok";
  tamperDetected: boolean;
  isLatched: boolean;
  doorOpen: boolean;
  delayToken: number;
  eventId: number;
  logs: { id: number; message: string; kind: "info" | "fault" | "success" }[];
}
export type HardwareAction =
  | { type: "sensor"; sensor: Sensor; safe: boolean }
  | { type: "key"; value: boolean }
  | { type: "code"; value: CodeState }
  | { type: "tamper"; value: boolean }
  | { type: "delay"; token: number }
  | { type: "reset" }
  | { type: "clear" }
  | { type: "log"; message: string };
export const initialHardware: HardwareState = {
  sensors: { magnetic: true, temp: true, pressure: true, laser: true },
  physicalKey: false,
  codeState: "idle",
  delayStatus: "idle",
  tamperDetected: false,
  isLatched: false,
  doorOpen: false,
  delayToken: 0,
  eventId: 0,
  logs: [],
};
function log(
  state: HardwareState,
  message: string,
  kind: "info" | "fault" | "success" = "info",
): HardwareState {
  const id = state.eventId + 1;
  return {
    ...state,
    eventId: id,
    logs: [{ id, message, kind }, ...state.logs].slice(0, 8),
  };
}
export const sensorsSafe = (s: HardwareState) =>
  Object.values(s.sensors).every(Boolean);
export function hardwareReducer(
  state: HardwareState,
  action: HardwareAction,
): HardwareState {
  let next = { ...state };
  let message = "";
  switch (action.type) {
    case "sensor":
      next.sensors = { ...state.sensors, [action.sensor]: action.safe };
      message = `${action.sensor.toUpperCase()} sensor ${action.safe ? "safe" : "breached"}.`;
      break;
    case "key":
      next.physicalKey = action.value;
      message = `Physical key ${action.value ? "inserted" : "removed"}.`;
      break;
    case "code":
      next.codeState = action.value;
      next.delayStatus = action.value === "correct" ? "waiting" : "idle";
      next.delayToken++;
      message =
        action.value === "correct"
          ? "Correct code. Five-second delay started."
          : `Code state: ${action.value}.`;
      break;
    case "tamper":
      next.tamperDetected = action.value;
      message = `Tamper ${action.value ? "detected" : "cleared"}.`;
      break;
    case "delay":
      if (
        action.token !== state.delayToken ||
        state.codeState !== "correct" ||
        state.delayStatus !== "waiting"
      )
        return state;
      next.delayStatus = "ok";
      message = "Security delay complete.";
      break;
    case "reset":
      if (
        !sensorsSafe(state) ||
        state.codeState === "wrong" ||
        state.tamperDetected
      )
        return log(
          state,
          "Reset refused: clear unsafe sensors, wrong code and tamper first.",
          "fault",
        );
      next.isLatched = false;
      message = "Protected reset accepted. Latch cleared.";
      break;
    case "clear":
      return log(
        {
          ...initialHardware,
          sensors: { ...initialHardware.sensors },
          delayToken: state.delayToken + 1,
          eventId: state.eventId,
          logs: state.logs,
        },
        "Simulator restored to safe initial inputs.",
      );
    case "log":
      return log(state, action.message);
  }
  next = log(next, message);
  if (
    !next.isLatched &&
    (!sensorsSafe(next) || next.codeState === "wrong" || next.tamperDetected)
  ) {
    next.isLatched = true;
    next = log(next, "Fault captured. Lockout latch SET.", "fault");
  }
  next.doorOpen =
    next.physicalKey &&
    next.delayStatus === "ok" &&
    !next.tamperDetected &&
    !next.isLatched;
  if (next.doorOpen !== state.doorOpen)
    next = log(
      next,
      next.doorOpen
        ? "Interlock satisfied. Door OPEN."
        : "Authorization lost. Door CLOSED.",
      next.doorOpen ? "success" : "info",
    );
  return next;
}
