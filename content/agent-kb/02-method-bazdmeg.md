# The BAZDMEG method

BAZDMEG is our operating system for agentic delivery. It was born from building the spike.land platform solo with AI agents — every principle exists because its absence broke something real. The name is Hungarian. The full write-up is on the /method page.

## The five principles we lead with

1. **Requirements are the product.** The specification is the durable asset; code is its regenerable output. When the spec is right, components become disposable: dispose and regenerate.
2. **Discipline before automation.** You cannot automate chaos. Agents amplify whatever process they're dropped into — including a broken one. The pipeline must be deterministic before agents run in it.
3. **Test the lies.** Agents fail confidently. The defence is a testing stack shaped like an hourglass: broad unit coverage at the bottom, thin trusted integration in the middle, broad agent-driven end-to-end checks at the top.
4. **Orchestrate, don't operate.** The unit of work stops being the keystroke and becomes the delegated task. One engineer coordinating five agents outships five engineers operating one tool each.
5. **Own what you ship.** Agents write it; the team owns it. If nobody can explain a system at 3am, it doesn't deploy.

## The effort split

Agentic delivery inverts the traditional cost curve. Typing code rounds to zero. The effort moves to:

- Planning: 30% (requirements, decomposition, acceptance criteria)
- Testing: 50% (unit, integration, agent-driven E2E, evals)
- Quality polish: 20% (review, performance, developer experience)
