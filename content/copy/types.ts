export type Cta = {
  label: string;
  href: string;
};

export type HeroCopy = {
  h1: string;
  sub: string;
  primaryCta: { label: string };
  secondaryCta: Cta;
};

export type ShiftCopy = {
  title: string;
  narrative: string;
  eras: { name: string; description: string }[];
  diagram: {
    operate: { title: string; points: string[] };
    orchestrate: { title: string; points: string[] };
  };
};

export type ServiceCard = {
  title: string;
  description: string;
  deliverable: string;
};

export type ProofCard = {
  title: string;
  body: string;
  tag: string;
};

export type MethodPrinciple = {
  name: string;
  summary: string;
};

export type MethodCopy = {
  title: string;
  framing: string;
  principles: MethodPrinciple[];
  effortSplit: { label: string; percent: number }[];
  link: Cta;
};

export type EngagementStep = {
  step: string;
  title: string;
  description: string;
};

export type FounderCopy = {
  name: string;
  title: string;
  bio: string;
  markers: string[];
  image: { src: string; alt: string; width: number; height: number };
  link: Cta;
};

export type FooterCopy = {
  email: string;
  linkedin: string;
  github: string;
  location: string;
  legal: Cta[];
};

export type HomeCopy = {
  hero: HeroCopy;
  shift: ShiftCopy;
  services: { title: string; cards: ServiceCard[] };
  proof: { title: string; cards: ProofCard[] };
  method: MethodCopy;
  engagement: { title: string; steps: EngagementStep[]; stepCta: string };
  founder: FounderCopy;
  finalCta: { title: string; sub: string };
  footer: FooterCopy;
};
