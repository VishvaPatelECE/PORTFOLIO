import { systems } from "@/lib/content/site";
import { runPipeline } from "@/lib/rangraph";

const coordinates: Record<string, [number, number]> = {
  "gnb-1": [105, 42],
  "gnb-2": [280, 42],
  "ue-1": [45, 155],
  "ue-2": [185, 155],
  "ue-3": [325, 155],
};
export default function ArchitectureOverview({ system }: { system: number }) {
  const model = systems[system];
  const graph = system === 2 ? runPipeline().sequence.graphs[0] : undefined;
  return (
    <figure
      className="architecture-overview"
      aria-label={`${model.name} static architecture overview`}
    >
      <strong>{model.name}</strong>
      {graph ? (
        <svg
          viewBox="0 0 370 205"
          role="img"
          aria-label="First timestep: ue-1 and ue-2 are associated with gnb-1; other entities have no association edge."
        >
          {graph.edges.map((e, i) => (
            <line
              key={i}
              x1={coordinates[e.source.entityId][0]}
              y1={coordinates[e.source.entityId][1]}
              x2={coordinates[e.target.entityId][0]}
              y2={coordinates[e.target.entityId][1]}
            />
          ))}
          {graph.nodes.map((n) => (
            <g key={n.key.entityId}>
              <circle
                cx={coordinates[n.key.entityId][0]}
                cy={coordinates[n.key.entityId][1]}
                r={n.key.nodeType === "gNB" ? 12 : 7}
              />
              <text
                x={coordinates[n.key.entityId][0]}
                y={coordinates[n.key.entityId][1] + 30}
                textAnchor="middle"
              >
                {n.key.entityId}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <ol>
          {model.stages.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
      <figcaption>Static architecture overview</figcaption>
    </figure>
  );
}
