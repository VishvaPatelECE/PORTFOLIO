// Host integration, separate from the unchanged component and its reference bootstrap.
let latestPointer = null;
function dispatchPointer(data) {
  document.body.dispatchEvent(new PointerEvent(data.kind, { clientX: data.x, clientY: data.y, pointerType: data.pointerType || "mouse", bubbles: data.kind === "pointermove" }));
}
window.addEventListener("message", event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== "vishva-tubes-input") return;
  const data = event.data;
  if (!["pointermove", "pointerleave", "click"].includes(data.kind) || !Number.isFinite(data.x) || !Number.isFinite(data.y)) return;
  if (data.kind === "click") document.body.dispatchEvent(new MouseEvent("click", { clientX: data.x, clientY: data.y, bubbles: true }));
  else { latestPointer = data; dispatchPointer(data); }
});
const reference = document.getElementById("reference");
reference.addEventListener("load", () => {
  if (latestPointer) dispatchPointer(latestPointer);
  parent.postMessage({ type: "vishva-tubes-ready" }, location.origin);
});
reference.addEventListener("error", () => parent.postMessage({ type: "vishva-tubes-error" }, location.origin));
