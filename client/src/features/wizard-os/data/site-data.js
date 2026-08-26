// site-data.js — content for the Wizard OS portfolio site.
//
// SOURCE OF TRUTH: ~/personal/career-corpus/corpus.yaml. Every claim below is
// traceable to a bullet in that file. See career-corpus.md in this project for
// the digest, including the caution index.
//
// THREE RULES CARRIED OVER FROM THE CORPUS — do not quietly break them:
//   1. Ferret is "a multi-tenant LLM agent platform with human-in-the-loop
//      approval". It is NOT "LinkedIn automation" — that framing is a liability
//      for an enterprise-selling employer.
//   2. Never link a private repo, and never link the public arb fork (its README
//      is keyword-stuffed and reads as spam). Only verified-live URLs below.
//   3. No claim goes on this page that cannot be defended for ten minutes.
//      Robotics and market-making are NOT in that set — they were placeholders.

export const PROFILE = {
  name: 'ARTUR SHIROKOV',
  role: 'APPLIED AI ENGINEER',
  tagline: 'I build the AI system and own the customer conversation for it.',
  location: 'LISBON → ISRAEL',
  email: 'artur.wiseman@icloud.com',
  links: [
    ['GITHUB', 'https://github.com/ArturShirokov'],
    ['LINKEDIN', 'https://linkedin.com/in/artur-shirokov-9b9454252'],
  ],
  // Self-rated, but weighted to what the evidence actually supports.
  skills: [
    ['TYPESCRIPT', 92], ['MCP', 88], ['LLM AGENTS', 86],
    ['FULL-STACK', 90], ['RUST', 74], ['PYTHON / ML', 70],
  ],
  // Three years of professional work: Henosis 12mo + Canister Cloud 4mo + Origyn 15mo+.
  years: '3',
  blurb: 'Self-taught full-stack engineer. Three years shipping production systems against '
    + 'live third-party APIs, most recently LLM agents and the Model Context Protocol. '
    + 'Authored HTTP transport for MCP servers in Zed, merged upstream by a core maintainer. '
    + 'Co-founded a grant-funded storage startup and shipped its MVP. Relocating to Israel.',
};

// scene: mcp | approval | hebrew | vision | optionsarb
export const PROJECTS = [
  {
    id: 'zed_mcp', title: 'ZED_MCP_HTTP', cat: 'OPEN SOURCE', branch: 'PROTOCOL · RUST',
    scene: 'mcp', status: 'MERGED', basePrice: 0,
    tagline: 'HTTP transport for MCP servers, merged upstream into Zed.',
    desc: 'Zed could only reach MCP servers over stdio, so every server had to run as a local '
      + 'process on the user\'s machine. I wrote a streamable HTTP transport alongside the stdio '
      + 'path and wired it through the context-server store, project settings and the agent '
      + 'configuration UI — so a remote or hosted MCP server needs no local process at all. '
      + 'A core maintainer merged it upstream after a seven-week review. Roughly 91% of the '
      + 'merged transport file is mine.',
    chips: ['Rust', 'MCP', 'Streamable HTTP', 'Upstream OSS', 'Protocol design', 'Code review'],
    metrics: [['88k★', 'STARS, UPSTREAM REPO'], ['259', 'LINE HTTP TRANSPORT'], ['+709/−240', 'ACROSS 14 FILES'], ['7wk', 'REVIEW CYCLE']],
    hud: [['● MERGED', 'l'], ['zed-industries/zed', 'r'], ['stdio ▢local · http ◆remote — one transport abstraction', 'bl'], ['PR #39021', 'br']],
    media: ['▸ transport/http.rs', '▸ review thread'],
    links: [['▸ READ THE PR', 'https://github.com/zed-industries/zed/pull/39021']],
  },
  {
    id: 'ferret', title: 'FERRET', cat: 'AI SYSTEMS', branch: 'MULTI-TENANT LLM',
    scene: 'approval', status: 'LIVE', basePrice: 0,
    tagline: 'LLM outreach agent where a human approves every send.',
    desc: 'A hosted multi-tenant platform where an LLM agent drafts outreach from per-campaign '
      + 'memory. Every outbound write is gated behind a human approval queue — nothing sends '
      + 'autonomously. Shipping it meant production-operations work most side projects never '
      + 'reach: sender-health tracking, undeliverable-enrollment detection, and a rate limiter '
      + 'that counts attempts rather than successes, after I found naive success-counting was '
      + 'silently under-throttling exactly the accounts that were already failing.',
    chips: ['TypeScript', 'React', 'Hono', 'TanStack', 'Stripe', 'Multi-tenant', 'LLM agents'],
    metrics: [['249/250', 'COMMITS AUTHORED'], ['100%', 'SENDS HUMAN-GATED'], ['15+', 'SCOPED PRs'], ['2.2MB', 'TYPESCRIPT']],
    hud: [['● LIVE', 'l'], ['approval queue', 'r'], ['draft ▸ HOLD ▸ human ✓ ▸ send · attempts-not-successes limiter', 'bl'], ['multi-seat', 'br']],
    media: ['▸ approval_queue.png', '▸ sender_health.png'],
    links: [['▸ OPEN APP', 'https://ferret-eosin.vercel.app']],
  },
  {
    id: 'pmbots', title: 'PMBOTS', cat: 'TRADING', branch: 'PREDICTION MARKETS',
    scene: 'optionsarb', status: 'BUILT', basePrice: 64200,
    tagline: 'Rust workspace trading Kalshi/Polymarket divergence.',
    desc: 'Extended an open-source Kalshi/Polymarket arbitrage bot into a ten-crate Rust '
      + 'workspace — 299 commits on a ~15k-line base. Added an oracle-lag strategy for '
      + 'five-minute BTC up/down markets using a Brownian-motion probability model with '
      + 'Quarter-Kelly sizing, and an embedding-based matcher that pairs semantically '
      + 'equivalent contracts across two exchanges with different taxonomies. The LLM '
      + 'adjudication pass is optional: a --no-llm mode decides on embedding cosine alone, '
      + 'because most pairs do not need the model and every call costs money and latency.',
    chips: ['Rust', 'Python', 'Embeddings', 'LLM adjudication', 'Quarter-Kelly', 'CLOB V2'],
    metrics: [['299/300', 'COMMITS AUTHORED'], ['10', 'CRATE WORKSPACE'], ['2', 'LEGS, CONCURRENT'], ['¼', 'KELLY SIZING']],
    hud: [['◉ REAL MONEY', 'l'], ['BTC / USD', 'lr'], ['edge feed', 'r'], ['UP ◆mkt vs ▢model · DOWN ◆mkt vs ▢model', 'bl']],
    media: ['▸ edge_dist.png', '▸ matcher_recall.png'],
    // Private repo. The public fork's README is keyword-stuffed — do not link it.
    links: [],
  },
  {
    id: 'morah', title: 'MORAH · מורה', cat: 'AI SYSTEMS', branch: 'EDGE · STATEFUL',
    scene: 'hebrew', status: 'LIVE', basePrice: 0,
    tagline: 'Hebrew tutor where each user is their own agent.',
    desc: 'A Hebrew tutor for new olim, built because I am one. Each user\'s agent brain is a '
      + 'SQLite-backed Durable Object holding their profile, vocabulary state and curriculum '
      + 'progress — so the tutor remembers across sessions without a shared database. State '
      + 'updates come from structured tags the model emits in its own output ([REMEMBER:], '
      + '[VOCAB_KNOWN:]) rather than a second extraction call. Everything it infers about you '
      + 'is visible and editable, because an agent that remembers things you cannot see is a '
      + 'worse tutor, not a better one.',
    chips: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Workers AI', 'Agent memory'],
    metrics: [['1', 'DURABLE OBJECT / USER'], ['0', 'EXTRA CALLS FOR STATE'], ['3', 'INPUT LANGUAGES'], ['17B', 'LLAMA 4 SCOUT']],
    hud: [['● LIVE', 'l'], ['agent memory', 'r'], ['[REMEMBER:] ▸ cell write · user-editable', 'bl'], ['ru / en / he', 'br']],
    media: ['▸ memory_ui.png', '▸ telegram_bot.png'],
    links: [['▸ SOURCE', 'https://github.com/ArturShirokov/cf_ai_morah']],
  },
  {
    id: 'mushroom', title: 'MUSHROOM_INTELLIGENCE', cat: 'MACHINE LEARNING', branch: 'DETECTION · EVAL',
    scene: 'vision', status: 'BUILT', basePrice: 0,
    tagline: 'Harvest-readiness detection on a commercial farm.',
    desc: 'A computer-vision model for oyster-mushroom harvest readiness. I trained a YOLO '
      + 'detection baseline on a commercial-farm dataset of 555 scenes and 8,286 labelled '
      + 'instances, then built a model-in-the-loop labelling pipeline — VLM detection into '
      + 'SAM 3 masks, reviewed in FiftyOne — to move from boxes to masks, since cap area is '
      + 'the real harvest signal. The part I would defend hardest is the evaluation: a '
      + 'temporal split (train on cycle I, test on cycle II) instead of a shuffled one, plus '
      + 'a separate day versus nighttime-infrared split. Half the frames are IR, and a pooled '
      + 'metric hides exactly where the model fails.',
    chips: ['Python', 'PyTorch', 'YOLO', 'SAM 3', 'FiftyOne', 'Dataset curation', 'Eval design'],
    metrics: [['555', 'SCENES LABELLED'], ['8,286', 'INSTANCES'], ['2', 'EVAL SPLITS'], ['IR', 'HALF THE FRAMES']],
    hud: [['◉ DETECTING', 'l'], ['conf ≥ 0.55', 'r'], ['temporal split · cycle I ▸ train · cycle II ▸ test', 'bl'], ['DAY / IR', 'br']],
    media: ['▸ per_condition_pr.png', '▸ mask_overlay.png'],
    // Private repo, and the README needs rewriting before it is ever linked.
    links: [],
  },
];

// ── where the work happened ─────────────────────────────────────
export const EXPERIENCE = [
  {
    id: 'origyn', org: 'ORIGYN FOUNDATION', role: 'Full-Stack Engineer → Technical BD & Solutions',
    period: '2025.06 — NOW', place: 'Remote · Swiss product-authentication',
    bullets: [
      'Largest contributor to Minting Studio, the production certificate platform — 192 commits over six months across the mint lifecycle, template API and certificate flows.',
      'Built a local MCP server exposing the NFT lifecycle as agent-callable tools, with a three-layer spend policy.',
      'Built a working UNTP-compliant Digital Product Passport prototype to argue for a standards-native service instead of retrofitting passport features onto the existing platform.',
      'Ran business development on two product lines: wrote the ICP and channel strategy, and diagnosed why the pipeline stalled — no named segment, no stage tracking, feature-led messaging.',
    ],
    link: ['minting.origyn.com', 'https://minting.origyn.com'],
  },
  {
    id: 'canister', org: 'CANISTER CLOUD', role: 'Co-Founder & Engineer',
    period: '2025.02 — 2025.05', place: 'Lisbon, PT',
    bullets: [
      'Co-founded an encrypted on-chain document storage startup, won an ecosystem grant, and shipped the MVP.',
      'Wrote 178 of 274 post-fork commits, extending DFINITY\'s DocuTrack base with vetKeys key management and multi-document request flows.',
      'Still live — since repositioned by my co-founder as private time capsules.',
    ],
    link: ['canister.co', 'https://www.canister.co'],
  },
  {
    id: 'henosis', org: 'HENOSIS', role: 'Freelance Developer',
    period: '2023.12 — 2024.12', place: 'Lisbon, PT',
    bullets: [
      'Built a crypto trading platform over twelve months, integrating live exchange APIs (ccxt) behind a Postgres data layer.',
    ],
    link: null,
  },
];

// ── skill tree (branches: language, ai/agents, product) ─────────
export const SKILL_NODES = {
  ts:       { x: 110, y: 64,  label: 'TypeScript',  state: 'mastered',   branch: 'WEB / PRODUCT',  desc: 'Primary language. Ferret, Morah, the DPP prototype, this site.', pre: [], unlocks: ['React / TanStack', 'Hono'] },
  react:    { x: 60,  y: 150, label: 'React / TanStack', state: 'mastered', branch: 'WEB / PRODUCT', desc: 'Router, Query, and the component work across every product I ship.', pre: ['TypeScript'], unlocks: ['Multi-tenant SaaS'] },
  hono:     { x: 165, y: 150, label: 'Hono',        state: 'proficient', branch: 'WEB / PRODUCT',  desc: 'Edge-first API layer — Ferret, the DPP platform, this backend.', pre: ['TypeScript'], unlocks: ['Multi-tenant SaaS'] },
  saas:     { x: 110, y: 236, label: 'Multi-tenant SaaS', state: 'proficient', branch: 'WEB / PRODUCT', desc: 'Workspace isolation, roles and seats, Stripe entitlement.', pre: ['React / TanStack', 'Hono'], unlocks: [] },
  rust:     { x: 300, y: 64,  label: 'Rust',        state: 'proficient', branch: 'SYSTEMS / AI',  desc: 'Merged upstream into Zed; ten-crate trading workspace.', pre: [], unlocks: ['MCP'] },

  mcp:      { x: 300, y: 150, label: 'MCP',         state: 'mastered',   branch: 'SYSTEMS / AI', desc: 'Servers across six domains, plus the HTTP transport in Zed\'s client.', pre: ['Rust'], unlocks: ['LLM agents'] },
  agents:   { x: 300, y: 236, label: 'LLM agents',  state: 'proficient', branch: 'SYSTEMS / AI', desc: 'Drafting, memory, tool use — always with a human gate on writes.', pre: ['MCP'], unlocks: ['Agent memory', 'Evals'] },
  memory:   { x: 250, y: 322, label: 'Agent memory', state: 'proficient', branch: 'SYSTEMS / AI', desc: 'Per-user Durable Objects; state parsed from the model\'s own tags.', pre: ['LLM agents'], unlocks: [] },
  evals:    { x: 355, y: 322, label: 'Evals',       state: 'learning',   branch: 'SYSTEMS / AI', desc: 'Generator ≠ verifier. Kill criteria agreed before there is a favourite.', pre: ['LLM agents'], unlocks: [] },

  python:   { x: 470, y: 64,  label: 'Python',      state: 'proficient', branch: 'ML / DELIVERY', desc: 'The ML side: training, dataset tooling, labelling pipelines.', pre: [], unlocks: ['Computer vision'] },
  cv:       { x: 470, y: 150, label: 'Computer vision', state: 'learning', branch: 'ML / DELIVERY', desc: 'YOLO detection, VLM→SAM labelling, per-condition evaluation.', pre: ['Python'], unlocks: ['Eval design'] },
  evaldes:  { x: 470, y: 236, label: 'Eval design', state: 'proficient', branch: 'ML / DELIVERY', desc: 'Temporal and per-condition splits — a pooled metric hides the failure.', pre: ['Computer vision'], unlocks: ['Customer discovery'] },
  bd:       { x: 470, y: 322, label: 'Customer discovery', state: 'proficient', branch: 'ML / DELIVERY', desc: 'ICP definition, channel strategy, and why a pipeline is actually stalled.', pre: ['Eval design'], unlocks: [] },
};
export const SKILL_EDGES = [
  ['ts', 'react'], ['ts', 'hono'], ['react', 'saas'], ['hono', 'saas'], ['rust', 'mcp'],
  ['mcp', 'agents'], ['agents', 'memory'], ['agents', 'evals'],
  ['python', 'cv'], ['cv', 'evaldes'], ['evaldes', 'bd'],
];
export const SKILL_LIT = new Set([
  'ts-react', 'ts-hono', 'react-saas', 'hono-saas', 'rust-mcp', 'mcp-agents', 'agents-memory', 'python-cv',
]);
