# VISHVAPROJECTS V3 — MVP CONTENT BASELINE

**Document Type:** Publication-Ready Content Master Baseline
**Auditor:** Antigravity Advanced Agentic Coding System
**Date:** November 9, 2026
**Workspace:** `vishvaprojects-v3`
**Purpose:** Approved, concise, technically defensible copy for all project pages and the About section, adhering to the standardized 5-part structure.

---

## 1. Standardized Project Page Content Structure

Each project page is designed to communicate its engineering contribution within 60–90 seconds using five structured sections:
1. **Hero:** Name, certified tagline, and one-sentence technical summary.
2. **Problem:** The specific engineering challenge or physical limitation being addressed.
3. **Approach:** What was designed, developed, or implemented, anchored by an architecture visual.
4. **Results:** The strongest verified empirical findings and quantitative evidence with exact baselines.
5. **Scope & Operating Boundaries:** Transparent limitations, operational regime boundaries, and current prototype status.

---

## 2. Project 1: RANGraph (Radio Access Network Telemetry Compiler)

### 2.1 Hero
- **Project Name:** RANGraph
- **Tagline:** Making data mean something.
- **One-Sentence Description:** A domain-specific semantic compiler and incremental DAG engine that transforms heterogeneous, unvalidated cellular Radio Access Network telemetry into verified canonical representations with bit-identical correctness.
- **Route:** `/rangraph`

### 2.2 Problem
Cellular Radio Access Networks generate high-frequency telemetry across fragmented vendor formats, uncoordinated physical cell identifiers, and conflicting coordinate systems. Downstream optimization algorithms (such as O-RAN Near-RT RIC xApps) frequently receive corrupted, misaligned, or out-of-order data. Traditional approaches rely on ad-hoc relational ETL scripts or heavy semantic web ontologies (RDF/SHACL) that either drop proprietary vendor fields, fail on edge-case collisions, or require expensive full-graph recomputations that violate sub-millisecond control deadlines.

### 2.3 Approach
RANGraph treats cellular telemetry ingestion as a programming language compilation problem:
1. **Canonical Intermediate Representation (IR):** Parses raw streaming vendor observations into strongly-typed AST nodes with strict physical identities and dimensional unit safety.
2. **Semantic Contract Enforcement:** Compiles four non-repairing invariant checks directly into the IR:
   - *Physical Identity:* Disambiguates co-channel PCI collisions using global ECGI and frequency context.
   - *Measurement Homogeneity:* Blocks illegal cross-vendor metric arithmetic (e.g., RSSI vs. RSRP subtraction).
   - *Dimensional Homogeneity:* Enforces strict decibel vs. linear power safety.
   - *Information Fate Invariant:* Retains proprietary vendor extensions in lossless sidecars.
3. **Selective Recompilation DAG:** Propagates telemetry updates incrementally through declared semantic scopes, recomputing only affected downstream dependencies while guaranteeing zero-stale cache updates.
- **Architecture Visual:** Interactive/Structured ASCII or SVG pipeline diagram illustrating:
  `Vendor Telemetry Feeds -> AST Parser -> Semantic Invariant Verification -> Selective Recompilation DAG -> Canonical Graph Tensor`.

### 2.4 Results (Strongest Verified Quantitative Findings)
- **100.0% Oracle Agreement:** Validated across **2,772 independent clean-room recomputation trials** ($22\text{ configs} \times 3\text{ seeds} \times 7\text{ reps} \times 6\text{ systems}$), achieving bit-identical numerical agreement ($\Delta < 5 \times 10^{-4}$) and zero stale outputs.
  *(Evidence: `comparative_results.csv`, SHA-256 `91BC27C3...`)*
- **100.0% Adversarial Contract Compliance:** Passed **250 / 250 structured test cases** across five failure families, outperforming Relational ETL ($26.0\%$), RDF/SHACL ($52.0\%$), and 3GPP standards ($48.0\%$).
  *(Evidence: `src/rangraph/research/comparative_study.py:465`)*
- **0.080 ms Median Update Latency at 100k Nodes:** At $N = 100{,}000$ dependency nodes (Chain topology, $k=1$), RANGraph compiles updates in **$0.080\text{ ms}$**, achieving a **$2{,}776.0\times$ speedup** over cold scratch recomputation ($222.91\text{ ms}$) and a **$5.31\times$ speedup** over generic naive incrementality ($0.426\text{ ms}$).
  *(Evidence: `FINAL_TNSM_MANUSCRIPT.tex:Table II`)*
- **Drive-Test Trace Acceleration:** Delivers a **$22.7\times$ speedup** on the 3.89-million-row Vienna 5G trace ($0.274\text{ ms}$ vs. $6.23\text{ ms}$) and an **$18.2\times$ speedup** on the UCCMISL 5G trace ($0.188\text{ ms}$ vs. $3.42\text{ ms}$).
  *(Evidence: `comparative_results.csv`)*

### 2.5 Scope & Operating Boundaries
- **Workload Boundary:** RANGraph's AST-level selective recompilation is optimized for sparse-to-moderate update rates ($k \le 10$). Under continuous dense batch mutations ($k = 500$), Differential Dataflow outperforms RANGraph ($3.89\text{ ms}$ vs. $5.95\text{ ms}$) due to relational delta consolidation.
- **Evaluation Substrate:** Benchmarked on synthetic graph generators and recorded drive-test traces (Vienna and UCCMISL), not on live streaming telecommunications hardware.
- **Interactive Browser Demonstration Disclosure:** The interactive explorer in this portfolio is a client-side TypeScript simulation running against a verified golden Mock E2 fixture (two timesteps, three UEs, two gNBs, one handover), designed to illustrate AST validation and DAG invalidation in the browser.

---

## 3. Project 2: CMEL (Contextual Marginal Externality Logic)

### 3.1 Hero
- **Project Name:** CMEL
- **Tagline:** Schedule smarter. Deliver better.
- **One-Sentence Description:** A single-pass, urgency-ordered scheduling algorithm that balances packet urgency, instantaneous rate benefit, and co-channel interference externalities for deadline-critical vehicular communications.
- **Route:** `/graphmarl` *(Replaces obsolete deep RL claims with canonical wireless scheduling research)*

### 3.2 Problem
In high-density vehicular wireless networks (C-V2X), decentralized transmitters compete for limited Physical Resource Blocks (PRBs) under strict latency deadlines ($100\text{ ms}$) and non-linear signal-to-interference-plus-noise ratio (SINR) decoding thresholds ($\gamma_{\text{req}} = 2.0\text{ dB}$). Classical schedulers either prioritize packet urgency while ignoring multi-user co-channel interference (leading to interference collisions) or execute complex multi-round game-theoretic iterations that exceed sub-millisecond vehicular scheduling budgets.

### 3.3 Approach
CMEL formulates decentralized PRB allocation as a single-pass marginal externality problem:
1. **Urgency-Ordered Candidate Queuing:** Transmitters sort head-of-line packets by Earliest Deadline First (EDF) and channel decodability likelihood.
2. **Marginal Externality Pricing:** For each candidate PRB, CMEL computes the transmitter's immediate rate benefit minus the marginal degradation imposed on concurrent active transmitters, using closed-form Huang-Berry-Honig (HBH) pricing.
3. **Single-Pass Determinism:** Evaluates and assigns resources in a single $O(M)$ pass, bypassing iterative negotiation rounds entirely while matching iterated game equilibrium quality.
- **Architecture Visual:** Block diagram showing:
  `Urgency Sorter -> Channel Gain Estimator -> HBH Externality Evaluator -> Single-Pass Subchannel Allocation`.

### 3.4 Results (Strongest Verified Quantitative Findings)
- **+4.19 Percentage-Point Timely PDR Gain (Sparse/Moderate):** Across 180 paired simulation scenarios ($N \le 48$, four traffic loads, 15 seeds), CMEL achieves a **$67.84\%$ timely packet delivery ratio vs. $63.65\%$ for TimelyGreedy**, winning **180 out of 180 pairwise trials** ($95\%\text{ CI}: [+3.89, +4.49]\text{ pp}$, Cohen's $d_z = +2.04$, $p < 10^{-5}$).
  *(Evidence: `results/final/final_raw_results.json`, SHA-256 `282AA939...`)*
- **+2.89 Percentage-Point Gain Over MaxWeight Matching:** Outperformed global deterministic MaxWeight bipartite matching across all **360 paired simulation cells** ($59.42\%$ vs. $56.53\%$, **358 wins, 1 loss, 1 tie**, $95\%\text{ CI}: [+2.70, +3.08]\text{ pp}$, $p = 2.6 \times 10^{-60}$).
  *(Evidence: `final_raw_results.json:Table 1`)*
- **One-Pass Iteration Parity:** Matched the delivery ratio of 25-round iterated HBH pricing ($59.42\%$ vs. $59.44\%$, statistical tie: **172 wins, 183 losses, 5 ties**) while executing in a single deterministic pass.
  *(Evidence: `paper/cmel_manuscript.tex`)*
- **Dominance Over Classical Telecom Schedulers:** Outperformed Proportional Fair by **+11.44 percentage points** ($360/0$ wins, $p < 10^{-60}$) and Kadota Delay-Drift Minimization by **+7.34 percentage points** ($351/9$ wins, $p < 10^{-50}$).
  *(Evidence: `final_raw_results.json`)*

### 3.5 Scope & Operating Boundaries
- **Dense Congestion Reversal:** Under heavy vehicular congestion ($N \ge 72$, High & VHigh load, 90 stress cells), CMEL experiences a **$-1.63\text{ percentage point}$ timely PDR deficit against TimelyGreedy** (3 wins, 87 losses, $95\%\text{ CI}: [-1.80, -1.47]\text{ pp}$).
  *Root Cause:* Continuous logarithmic rate utilities ($R = B \log_2(1 + \text{SINR})$) approximate marginal pricing well in sparse traffic, but misalign with discontinuous thresholded packet decoding ($\text{SINR} \ge 2\text{ dB}$) when aggregate co-channel interference saturates.
- **Operating Assumptions:** Transmit power is fixed at $23.0\text{ dBm}$ ($200\text{ mW}$); PRB bandwidth is $180\text{ kHz}$ across 4 subchannels in the $5.9\text{ GHz}$ ITS band; evaluated under 3GPP TR 37.885 UMi channel propagation in SUMO micro-mobility.

---

## 4. Project 3: DARVS (Deepfake Authentication & Reality Verification System)

### 4.1 Hero
- **Project Name:** DARVS
- **Tagline:** Prove reality before identity.
- **One-Sentence Description:** An interactive biometric authentication pipeline that integrates MTCNN face tracking, FaceNet embeddings, and a custom CNN eye-blink detector to verify physical human presence before authorizing identity.
- **Route:** `/darvs`

### 4.2 Problem
Traditional facial recognition systems match stored image templates but remain vulnerable to presentation attacks: static 2D printed photographs, digital screen replays, and animated deepfake avatars. Passive liveness detectors often rely on heavy 3D optical sensors or cloud-dependent vision models that introduce high latency and struggle to distinguish high-resolution phone playback from genuine human presence on standard consumer webcams.

### 4.3 Approach
DARVS couples identity verification with active physical challenge-response protocols:
1. **Real-Time Video Pipeline:** Downsamples webcam video ($640\times 480 \to 320\times 240$) for sub-100 ms MTCNN facial bounding box and landmark localization.
2. **512-D FaceNet Embeddings:** Extracts L2-normalized feature vectors, evaluated against enrolled identities via cosine similarity and smoothed by a 3-frame rolling average buffer (threshold $\ge 78$).
3. **Interactive Challenge-Response State Machine:** Issues 3 randomized real-time movement prompts from `["LEFT", "RIGHT", "UP", "DOWN", "BLINK"]`. Requires active geometric displacements ($\ge 7\%$ horizontal shift, $\ge 5\%$ vertical tilt) within a 6-second timeout.
4. **Custom 2-Layer CNN Blink Detector:** Crops $24\times 24$ grayscale eye patches, verifying biological eye state persistence ($\ge 2$ closed frames followed by $\ge 2$ open frames) to prevent still-photo spoofing.
- **Architecture Visual:** Flow diagram illustrating:
  `Camera Capture (320x240) -> MTCNN Face/Landmark -> FaceNet Embedding (Cosine Sim) -> Randomized 3-Step Challenge -> CNN Eye Blink Verification -> Authorization`.

### 4.4 Results (Strongest Verified Quantitative Findings)
- **Custom Eye-State CNN Accuracy:** The custom 2-layer CNN ($84{,}481$ parameters) achieved **$87.90\%$ binary accuracy** ($545 / 620$) and **$95.21\%$ closed-eye recall** ($278 / 292$ closed eye patches, F1: $0.8811$) on a localized 620-image dataset.
  *(Evidence: `DARVS_EVIDENCE_AUDIT.md:25`, `train_eye_model.py`)*
- **Operational Event Log Audit:** Across 41 genuine operational authentication attempts on laptop hardware, the system logged **16 successful genuine authorizations** (mean similarity score: $82.35\%$), **18 liveness challenge timeouts/failures** (rejecting static presentations), and **7 identity match rejections**.
  *(Evidence: `security_log.csv`)*
- **Observed Presentation-Attack Detection:** "During functional testing, DARVS rejected printed photographs and facial images displayed on mobile phone screens through its challenge-response liveness verification."
  *(Evidence: Author functional prototype testing on laptop webcam; `movement_liveness.py:9-45`, `camera.py:165-210`, `security_log.csv`)*
- **Inference Latency Profile:** Frame-level MTCNN and embedding inference executes in **$< 100\text{ ms}$** per frame on $320\times 240$ video. End-to-end user authentication completes in **$2.0\text{ to }6.0\text{ seconds}$**, determined by human challenge completion speed.
  *(Evidence: `camera.py:31,64`, `movement_liveness.py:9`)*

### 4.5 Scope & Operating Boundaries
- **Observed Functional Testing vs. Academic Benchmarking:** The rejection of printed photographs and mobile phone screen displays was observed during functional prototype testing of the implemented challenge-response state machine. This represents functional prototype verification, not a formally benchmarked anti-spoofing evaluation on independent academic benchmark datasets (such as SiW or OULU-NPU).
- **Threat Model & Defense Boundaries:** DARVS does not claim protection against all presentation attacks or sophisticated spoofing methods. Explicitly retains limitations regarding 3D physical silicone masks, advanced interactive replay attacks (such as live neural video puppetry or real-time deepfake face swaps), and OS-level virtual-camera driver injection unless independently tested.
- **Dataset Context:** The 620-image eye model evaluation was conducted on a localized single-subject dataset captured during development, not on an external public benchmark (such as LFW, CelebA, or SiW).
- **Current Status:** Implemented as a functional Python/Flask prototype with an interactive desktop interface and SQLite audit logging.

---

## 5. Project 4: USMHACS (Ultra-Secure Multi-Layer Hardware Access Control System)

### 5.1 Baseline Preservation Notice
Per user instruction (*"SORRY I MEANT TO SAY DONT CHANGE USMHACS PAGE"*), the live portfolio routes (`/usmhacs` and `/usmhacs/full`) and components remain **strictly untouched**. The verified technical baseline is recorded here for architectural consistency.

### 5.2 Summary Baseline
- **Tagline:** Deterministic logic. Zero firmware.
- **Architecture:** Discrete TTL/CMOS hardware-only access controller:
  - Dual cascaded 74LS138 decoders evaluating a 4-bit parallel DIP key (`1001`).
  - CD4043B quad NOR SR latch maintaining immutable fail-secure lockout upon tamper detection.
  - CD4068 8-input AND gate combinational decision unit.
  - NE555 monostable timer generating an exact **$5.17\text{ s}$ unlock pulse** ($R=10\text{ k}\Omega, C=470\,\mu\text{F}$, observed $5.1\text{--}5.3\text{ s}$).
  - 74HC14 hex Schmitt trigger with RC networks for mechanical contact debouncing.
- **Validation:** 8 test scenarios verified in Proteus 8.9 and breadboard hardware.
- **Scope:** Physical breadboard prototype is currently non-operational. Verilog RTL implementation remains planned future work.

---

## 6. About Section: Professional Profile & Academic Records

### 6.1 Headline & Professional Biography
**Vishva Patel**
*Electronics & Communication Engineering Undergraduate | Dharmsinh Desai University*
*Specializing in Wireless Systems, Domain-Specific Compilers, and Discrete Hardware Design*

> I am an Electronics & Communication Engineering undergraduate at Dharmsinh Desai University (CGPA 8.99, GATE EC 2026 AIR 6931) and former AI Research Intern at SVNIT Surat.
>
> My engineering work focuses on systems where algorithmic correctness, latency bounds, and physical layer constraints meet. Rather than treating machine learning as a blanket solution, my research emphasizes rigorous empirical testing—proving where neural policies succeed, where classical algorithms dominate, and how domain-specific compilers eliminate ambiguity in telecommunications data.

### 6.2 Verified Academic Credentials
- **Bachelor of Technology (B.Tech), Electronics & Communication Engineering**
  *Dharmsinh Desai University (DDU), Nadiad, Gujarat* | Expected May 2027
  **Cumulative GPA: 8.99 / 10.0**
- **GATE 2026 (Electronics & Communication Engineering)**
  *Graduate Aptitude Test in Engineering*
  **All India Rank: 6,931** | **GATE Score: 451** | Marks: 34.67 / 100.0
- **AI Research Intern**
  *Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat* | May 2026 – July 2026
  *Research Focus:* 3GPP channel modeling, C-V2X sidelink resource allocation, and multi-agent reinforcement learning.

### 6.3 Core Engineering Capabilities
- **Wireless Telecommunications:** 3GPP TR 38.901 & 37.885 propagation, C-V2X Mode 4 sidelink, SINR decodability modeling, Huang-Berry-Honig interference pricing, SUMO TraCI mobility.
- **Compilers & Systems:** Domain-specific AST compilation, canonical intermediate representations (IR), incremental DAG engines, selective invalidation caching, Python, Rust.
- **Computer Vision & Biometrics:** MTCNN face localization, FaceNet feature embeddings, CNN eye-blink classification, interactive challenge-response liveness.
- **Digital Hardware Design:** Discrete combinational/sequential logic (74-series, CD4000), monostable timing circuits, Schmitt trigger debouncing, Proteus simulation.

