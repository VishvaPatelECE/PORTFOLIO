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
    body: "The implementation chooses three movement or blink challenges. The visitor must complete the sequence before identity matching begins. A timed-out challenge can fail the attempt.",
    note: "Source behavior: LEFT, RIGHT, UP, DOWN and BLINK form the challenge pool. Blink is not mandatory in every attempt.",
  },
  {
    name: "FACENET",
    kind: "IDENTITY REPRESENTATION",
    title: "Compare representations.",
    body: "FaceNet turns the detected face into an embedding. The recognizer compares it with stored embeddings using cosine similarity. That score describes similarity, not recognition accuracy.",
    note: "Source behavior: recognition is sampled every seventh camera frame. No browser model runs here.",
  },
  {
    name: "DECISION",
    kind: "STATE & FAILURE",
    title: "Both conditions must hold.",
    body: "Completed liveness enables recognition. A matching identity can then complete the attempt; challenge failures and recognition timeouts return a failure or reset state.",
    note: "The active runtime does not call a separate AntiSpoofEngine. Experimental anti-spoof code is distinct from the implemented pipeline.",
  },
] as const;
