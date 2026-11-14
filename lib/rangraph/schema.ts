/**
 * Schema 1.0.0, transcribed from `configs/schema_v1_0_0.yaml`.
 *
 * The demo's compiler and validator read *this object* — they never name a node
 * type, feature, unit, or bound directly. That is the same discipline the Python
 * implementation holds, and it is what makes the visualization honest: if this
 * declaration changed, the demo's output would change with it.
 */

export type DType = "float" | "int" | "bool";

export interface FeatureSpec {
  name: string;
  dtype: DType;
  unit: string;
  cardinality: number;
  /** Inclusive `[min, max]`, or `null` where the schema declares none. */
  validRange: readonly [number, number] | null;
  required: boolean;
  description: string;
}

export interface ReferenceFieldSpec {
  name: string;
  targetNodeType: string;
  nullable: boolean;
}

export interface NodeTypeSpec {
  name: string;
  identityFields: { name: string; dtype: string }[];
  features: FeatureSpec[];
  referenceFields: ReferenceFieldSpec[];
}

export interface EdgeTypeSpec {
  name: string;
  endpoints: { sourceType: string; targetType: string }[];
  constructionRule: string;
  maxOutEdgesPerSource: number | null;
  maxInEdgesPerTarget: number | null;
  allowSelfLoops: boolean;
  features: FeatureSpec[];
}

export interface ConstructionRuleSpec {
  identity: string;
  epistemicClass: "causal_source_reported" | "proxy_correlational";
  linkDirection: "downlink" | "uplink" | "not_applicable";
  symmetry: "symmetric_identical_features" | "asymmetric";
  appliesTo: { sourceType: string; targetType: string }[];
  requiredSourceObservations: string[];
  /** Edge feature ← source node feature. Empty means nothing is projected. */
  projections: Record<string, string>;
  constructs: boolean;
  deferralNote: string;
}

export interface GraphSchema {
  version: string;
  nodeTypes: NodeTypeSpec[];
  edgeTypes: EdgeTypeSpec[];
  constructionRules: ConstructionRuleSpec[];
}

const f = (
  name: string,
  dtype: DType,
  unit: string,
  required: boolean,
  validRange: readonly [number, number] | null = null,
  cardinality = 1,
  description = "",
): FeatureSpec => ({
  name,
  dtype,
  unit,
  cardinality,
  validRange,
  required,
  description,
});

const IDENTITY = [
  { name: "id", dtype: "str" },
  { name: "timestamp", dtype: "float" },
];

export const SCHEMA_1_0_0: GraphSchema = {
  version: "1.0.0",
  nodeTypes: [
    {
      name: "UE",
      identityFields: IDENTITY,
      features: [
        f(
          "sinr",
          "float",
          "dB",
          true,
          null,
          1,
          "Downlink SINR at the receiver",
        ),
        f(
          "cqi",
          "int",
          "index",
          true,
          [0, 15],
          1,
          "3GPP channel quality index",
        ),
        f(
          "rb_allocation",
          "int",
          "resource blocks",
          false,
          null,
          1,
          "Allocated PRBs",
        ),
        f(
          "mobility_speed",
          "float",
          "m/s",
          false,
          null,
          1,
          "Kinematic velocity",
        ),
      ],
      referenceFields: [
        { name: "serving_gnb_id", targetNodeType: "gNB", nullable: true },
      ],
    },
    {
      name: "gNB",
      identityFields: IDENTITY,
      features: [
        f("load", "float", "ratio", true, [0, 1], 1, "PRB utilization ratio"),
        f("position", "float", "meters", true, null, 2, "Planar [x, y]"),
        f("tx_power", "float", "dBm", false, null, 1, "Max transmit power"),
        f(
          "num_connected_ues",
          "int",
          "count",
          false,
          null,
          1,
          "Attached UE count",
        ),
      ],
      referenceFields: [],
    },
  ],
  edgeTypes: [
    {
      name: "association",
      endpoints: [{ sourceType: "UE", targetType: "gNB" }],
      constructionRule: "serving_cell_attachment",
      maxOutEdgesPerSource: 1,
      maxInEdgesPerTarget: null,
      allowSelfLoops: false,
      features: [
        f(
          "signal_quality",
          "float",
          "dB",
          true,
          null,
          1,
          "Projected serving SINR",
        ),
      ],
    },
    {
      name: "interference",
      endpoints: [
        { sourceType: "UE", targetType: "UE" },
        { sourceType: "gNB", targetType: "gNB" },
      ],
      constructionRule: "source_reported_coupling",
      maxOutEdgesPerSource: null,
      maxInEdgesPerTarget: null,
      allowSelfLoops: false,
      features: [
        f(
          "interference_strength",
          "float",
          "dBm",
          true,
          null,
          1,
          "Received interfering power",
        ),
      ],
    },
  ],
  constructionRules: [
    {
      identity: "serving_cell_attachment",
      epistemicClass: "causal_source_reported",
      linkDirection: "downlink",
      symmetry: "asymmetric",
      appliesTo: [{ sourceType: "UE", targetType: "gNB" }],
      requiredSourceObservations: [],
      projections: { signal_quality: "sinr" },
      constructs: true,
      deferralNote: "",
    },
    {
      identity: "source_reported_coupling",
      epistemicClass: "causal_source_reported",
      linkDirection: "downlink",
      symmetry: "asymmetric",
      appliesTo: [],
      requiredSourceObservations: ["pairwise_coupling_power"],
      projections: {},
      constructs: false,
      deferralNote:
        "Requires a source-reported pairwise coupling observation. No Schema 1.0.0 adapter supplies one, so the edge store stays empty rather than being filled from a local proxy.",
    },
  ],
};

export function nodeTypeOf(
  schema: GraphSchema,
  name: string,
): NodeTypeSpec | undefined {
  return schema.nodeTypes.find((t) => t.name === name);
}

export function edgeTypeOf(
  schema: GraphSchema,
  name: string,
): EdgeTypeSpec | undefined {
  return schema.edgeTypes.find((t) => t.name === name);
}

export function ruleOf(
  schema: GraphSchema,
  identity: string,
): ConstructionRuleSpec | undefined {
  return schema.constructionRules.find((r) => r.identity === identity);
}
