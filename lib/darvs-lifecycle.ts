export interface DarvsState {
  ready: boolean;
  failed: boolean;
  phase: string;
  active: boolean;
}

type DarvsListener = (state: DarvsState) => void;

let currentState: DarvsState = { ready: false, failed: false, phase: "loading", active: false };
let documentVisited = false;
const listeners = new Set<DarvsListener>();

// Clear any stale sessionStorage key on module load so page refreshes always trigger scan
if (typeof window !== "undefined") {
  try {
    window.sessionStorage.removeItem("darvs_visited");
  } catch {}
}

export function isDocumentVisited(): boolean {
  if (typeof window !== "undefined") {
    try {
      // If navigating directly to a section anchor (e.g. #projects, #experience, #skills),
      // the user must reach their destination section, not be trapped in the face scan
      if (window.location.hash && window.location.hash.length > 1 && window.location.hash !== "#home") {
        return true;
      }
    } catch {}
  }
  return documentVisited;
}

export function markDocumentVisited(): void {
  documentVisited = true;
}

export function resetDocumentVisited(): void {
  documentVisited = false;
  currentState = { ready: false, failed: false, phase: "loading", active: false };
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem("darvs_visited");
    } catch {}
  }
}

export function isDarvsActive(): boolean {
  return currentState.active;
}

export function updateDarvsState(update: Partial<DarvsState>): void {
  currentState = { ...currentState, ...update };
  listeners.forEach((fn) => fn(currentState));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("darvs:state-change", { detail: currentState }),
    );
  }
}

export function getDarvsState(): DarvsState {
  return currentState;
}

export function subscribeDarvsState(fn: DarvsListener): () => void {
  listeners.add(fn);
  fn(currentState);
  return () => {
    listeners.delete(fn);
  };
}
