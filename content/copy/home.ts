import type { HomeCopy } from "./types";

export const home: HomeCopy = {
  hero: {
    h1: "Digital transformation for the agentic era",
    sub: "We design, ship, and embed agentic AI systems — so your company orchestrates software instead of operating it.",
    primaryCta: { label: "Talk to our agent" },
    secondaryCta: { label: "Book a call", href: "https://cal.com/spike-land/discovery" },
  },

  shift: {
    title: "The shift",
    narrative:
      "Cloud changed where software runs. Mobile changed where it's used. The agentic era changes who does the work: AI agents that plan, build, and act — coordinated by your team, not typed by it.",
    eras: [
      { name: "Cloud era", description: "Software moved to someone else's machines." },
      { name: "Mobile era", description: "Software moved into everyone's pocket." },
      { name: "Agentic era", description: "Software starts doing the work itself." },
    ],
    diagram: {
      operate: {
        title: "Operating",
        points: ["People drive every tool", "Work queues behind headcount", "AI as a chat window"],
      },
      orchestrate: {
        title: "Orchestrating",
        points: [
          "Agents execute, people direct",
          "Throughput scales with systems",
          "AI embedded in the workflow",
        ],
      },
    },
  },

  services: {
    title: "What we do",
    cards: [
      {
        title: "Agentic Readiness Assessment",
        description:
          "We map your workflows, data, and delivery pipeline against what agents can already do — and where they'd fail.",
        deliverable: "Deliverable: a scored roadmap with the first three systems to build.",
      },
      {
        title: "Agentic Pilot",
        description:
          "One working agentic system shipped into your business in weeks — real workflow, real integration, measured results.",
        deliverable: "Deliverable: a production system your team runs, with evals and guardrails.",
      },
      {
        title: "Workflow & Delivery Transformation",
        description:
          "We re-architect how work moves through your teams so agents carry the load and people make the calls.",
        deliverable:
          "Deliverable: redesigned delivery pipeline with agent-run stages in production.",
      },
      {
        title: "Team Enablement",
        description:
          "Your engineers learn to orchestrate agents instead of operating tools — hands-on, on your codebase.",
        deliverable: "Deliverable: a trained team and an operating playbook they own.",
      },
    ],
  },

  proof: {
    title: "Proof, not decks",
    cards: [
      {
        tag: "Case study",
        title: "spike.land — a platform built solo",
        body: "A full product platform — app store, auth, payments, MCP registry — designed, built, and shipped by one person orchestrating multiple AI agents in parallel. The method is the product.",
      },
      {
        tag: "Track record",
        title: "Two decades of enterprise delivery",
        body: "Virgin Media O2, Investec, TalkTalk, BP, Jaguar Land Rover — customer-facing systems at scale, TDD culture, and agile transformation led from inside the teams.",
      },
      {
        tag: "Live exhibit",
        title: "You're talking to our work",
        body: "The agent on this page is a production agentic system: grounded in a curated knowledge base, injection-hardened, eval-gated in CI. Ask it anything about how it was built.",
      },
    ],
  },

  method: {
    title: "The method: BAZDMEG",
    framing:
      "A coherent operating system for agentic delivery — born in production, not in a workshop.",
    principles: [
      {
        name: "Requirements are the product",
        summary: "The spec is the asset; code is its output.",
      },
      {
        name: "Discipline before automation",
        summary: "You cannot automate chaos.",
      },
      {
        name: "Test the lies",
        summary: "Agents confidently invent — tests catch what reviews miss.",
      },
      {
        name: "Orchestrate, don't operate",
        summary: "Coordinate agents, not keystrokes.",
      },
      {
        name: "Own what you ship",
        summary: "If you can't explain it at 3am, don't deploy it.",
      },
    ],
    effortSplit: [
      { label: "Planning", percent: 30 },
      { label: "Testing", percent: 50 },
      { label: "Polish", percent: 20 },
    ],
    link: { label: "Read the full method", href: "/method" },
  },

  engagement: {
    title: "How we engage",
    stepCta: "Discuss with our agent",
    steps: [
      {
        step: "1",
        title: "Assess",
        description:
          "Fixed-fee readiness assessment, one to two weeks. You get the roadmap whether or not we go further.",
      },
      {
        step: "2",
        title: "Pilot",
        description:
          "Fixed-scope build of the first agentic system on the roadmap. Working software, measured against agreed outcomes.",
      },
      {
        step: "3",
        title: "Transform",
        description:
          "Retained partnership: we re-architect delivery workflow by workflow and upskill your team as we go.",
      },
    ],
  },

  founder: {
    name: "Zoltan Erdos",
    title: "Founder",
    bio: "Twenty years shipping software at enterprise scale — Virgin Media O2, Investec, TalkTalk — then a full product platform built solo by orchestrating AI agents. MSc in Computer Science & Mathematics. Based in Brighton, working with companies across the UK and remote.",
    markers: [
      "Enterprise delivery at Virgin Media O2, Investec, TalkTalk",
      "Built the spike.land platform solo with multi-agent orchestration",
      "MSc Computer Science & Mathematics, ELTE Budapest",
    ],
    image: {
      src: "/zoltan-erdos.webp",
      alt: "Zoltan Erdos, founder of spike.land",
      width: 320,
      height: 320,
    },
    link: { label: "More about Zoltan", href: "/about" },
  },

  finalCta: {
    title: "Ready to orchestrate?",
    sub: "Start with our agent, or go straight to a call. Either way, you'll leave with a clearer picture of what agents can do for your business.",
  },

  footer: {
    email: "zoltan.erdos@me.com",
    linkedin: "https://www.linkedin.com/in/zoltanerdos/",
    github: "https://github.com/zerdos",
    location: "Brighton / London, UK — serving UK & remote",
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
};
