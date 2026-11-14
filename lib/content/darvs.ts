// Shared source-reviewed architecture copy for the project and its showcase.
export const darvsStages = [
  {
    name: "MTCNN",
    kind: "FACE DETECTION",
    title: "First, locate the input.",
    body: "MTCNN locates faces in frames captured by the local OpenCV camera pipeline. Detection identifies a region to process; it does not establish identity.",
    note: "Source behavior: detection runs on a half-resolution frame.",
  },
  {
    name: "LIVENESS",
    kind: "CHALLENGE RESPONSE",
    title: "Presence requires a response.",
    body: "The prototype selects three challenges using 2D face-center/nose movement geometry or a blink CNN, gating identity matching on completion. These responses are not depth measurements or independently validated proof of physical presence.",
    note: "LEFT, RIGHT, UP, DOWN and BLINK form the pool; blink appears in 60% of possible sequences, not every attempt. The blink runtime treats output > 0.85 as open despite training labels Open = 0, Closed = 1. This polarity issue is unresolved.",
  },
  {
    name: "FACENET",
    kind: "IDENTITY REPRESENTATION",
    title: "Compare representations.",
    body: "FaceNet turns the detected face into an embedding. The recognizer compares it with stored embeddings using cosine similarity. That score describes similarity, not recognition accuracy.",
    note: "Recognition is sampled every seventh camera frame; embeddings are stored in encodings.pkl and SQLite holds enrollment metadata. No browser model runs here.",
  },
  {
    name: "DECISION",
    kind: "STATE & FAILURE",
    title: "Both conditions must hold.",
    body: "Completed challenge state enables recognition. A matching identity can then complete the attempt; failures or timeouts can reset it. This describes the implemented gate, not validated presentation-attack protection.",
    note: "The active runtime does not call a separate AntiSpoofEngine. Experimental anti-spoof code is distinct from the implemented pipeline.",
  },
] as const;
