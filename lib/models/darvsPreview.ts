export const previewChallenges = ["TURN LEFT", "LOOK UP", "BLINK"] as const;

export interface DarvsPreviewState {
  region: boolean;
  responses: number;
  match: boolean;
}

export const initialDarvsPreview: DarvsPreviewState = { region: true, responses: 0, match: false };
export type DarvsPreviewAction = { type: "toggle-region" | "respond" | "toggle-match" | "reset-challenges" | "reset" };

export function darvsPreviewReducer(state: DarvsPreviewState, action: DarvsPreviewAction): DarvsPreviewState {
  switch (action.type) {
    case "toggle-region": return { region: !state.region, responses: 0, match: false };
    case "respond":
      if (!state.region || state.responses >= previewChallenges.length) return state;
      return { ...state, responses: state.responses + 1 };
    case "toggle-match":
      if (!state.region || state.responses !== previewChallenges.length) return state;
      return { ...state, match: !state.match };
    case "reset-challenges": return { ...state, responses: 0, match: false };
    case "reset": return { ...initialDarvsPreview };
  }
}

export function darvsPreviewDecision(state: DarvsPreviewState) {
  if (!state.region) return "NO INPUT";
  if (state.responses !== previewChallenges.length) return "CHALLENGE REQUIRED";
  return state.match ? "ACCEPT" : "NO MATCH";
}

// Presentation timing only. This sequence neither captures a camera nor runs ML.
export const previewExampleSteps: readonly { at: number; stage: number; actions: readonly DarvsPreviewAction[] }[] = [
  { at: 0, stage: 0, actions: [{ type: "reset" }] },
  { at: 650, stage: 1, actions: [{ type: "respond" }] },
  { at: 1150, stage: 1, actions: [{ type: "respond" }] },
  { at: 1650, stage: 1, actions: [{ type: "respond" }] },
  { at: 2150, stage: 2, actions: [{ type: "toggle-match" }] },
  { at: 2800, stage: 3, actions: [] },
];

export function runDarvsPreviewExample(onStep: (step: typeof previewExampleSteps[number]) => void, onDone: () => void) {
  let cancelled = false;
  const timers = previewExampleSteps.map((step, index) => setTimeout(() => {
    if (cancelled) return;
    onStep(step);
    if (index === previewExampleSteps.length - 1) onDone();
  }, step.at));
  return () => { cancelled = true; timers.forEach(clearTimeout); };
}
