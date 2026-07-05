export type MethodPageCopy = {
  title: string;
  intro: string;
  origin: string;
  principles: { name: string; body: string }[];
  effort: {
    title: string;
    body: string;
    split: { label: string; percent: number; note: string }[];
  };
  cta: { title: string; sub: string };
};

export const methodPage: MethodPageCopy = {
  title: "BAZDMEG — an operating system for agentic delivery",
  intro:
    "Most AI adoption stalls at pilots, chatbots, and strategy decks. BAZDMEG is the discipline that gets agentic systems into production and keeps them there. Born from pain, tested in production, named in Hungarian.",
  origin:
    "The method emerged from building a full product platform solo, orchestrating multiple AI agents in parallel. Every principle exists because its absence broke something real.",
  principles: [
    {
      name: "Requirements are the product",
      body: "In agentic delivery, the specification is the durable asset — code is its regenerable output. We invest where it compounds: unambiguous requirements that any agent, or any human, can execute against. When the spec is right, components become disposable: dispose and regenerate.",
    },
    {
      name: "Discipline before automation",
      body: "You cannot automate chaos. Agents amplify whatever process they're dropped into — including a broken one. Before a single agent runs, the pipeline must be deterministic: reproducible builds, gated merges, tests that mean something.",
    },
    {
      name: "Test the lies",
      body: "Agents fail confidently. The defence isn't reading every line — it's a testing stack shaped like an hourglass: broad unit coverage at the bottom, thin trusted integration in the middle, broad agent-driven end-to-end checks at the top. Tests catch what reviews miss.",
    },
    {
      name: "Orchestrate, don't operate",
      body: "The unit of work stops being the keystroke and becomes the delegated task. One engineer coordinating five agents outships five engineers operating one tool each. The skill we transfer to your team is coordination: decomposing work, setting acceptance criteria, reviewing outcomes.",
    },
    {
      name: "Own what you ship",
      body: "Agents write it; you own it. If nobody in the team can explain a system at 3am, it doesn't deploy. Ownership is the human backstop that makes aggressive automation safe.",
    },
  ],
  effort: {
    title: "Where the effort goes",
    body: "Agentic delivery inverts the traditional cost curve. Typing code rounds to zero. The effort moves to the edges:",
    split: [
      { label: "Planning", percent: 30, note: "requirements, decomposition, acceptance criteria" },
      { label: "Testing", percent: 50, note: "unit, integration, agent-driven E2E, evals" },
      { label: "Polish", percent: 20, note: "review, performance, developer experience" },
    ],
  },
  cta: {
    title: "See the method applied to your delivery pipeline",
    sub: "A readiness assessment maps these principles onto your workflows in one to two weeks.",
  },
};
