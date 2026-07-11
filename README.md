# Apollo — Launch Cockpit

An interactive, single-user "launch cockpit" for **Apollo Sports, LLC** — the
indoor racquet-sports facility build in Nassau County, NY. It replaces a static
Excel tracker with a guided tool that, for every task, tracks **status**, holds
**freeform notes**, and tells you **exactly what to do next**.

## What's inside

- **Dashboard** — overall progress, a "Next up" panel that surfaces the single
  most important actionable task (respecting dependencies), plus in-progress,
  blocked, and publication-deadline widgets.
- **Roadmap** — the 8 phases (Foundation → Launch) and 41 tasks as an accordion.
  Each task carries structured guidance: what it is, the next action, ordered
  steps, resources (clickable links + `tel:` numbers), completion criteria, and
  caution flags. Filter by status or phase.
- **Capital Stack** — a live Low / Expected / High cost estimator. Edit any
  driver; total cost, equity injection, and financed amount recompute instantly.
  Everything is labeled an **estimate**.
- **Property Tracker** — log candidate spaces; all-in $/SF and annual rent
  compute automatically; sort by fit score or rent.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand · lucide-react.

## Data & persistence

All state (task status/notes, capital inputs, properties) is saved to
`localStorage` under `apollo-tracker-v1`. Task **guidance** lives in code
([`data/seed.ts`](data/seed.ts)); only your user state is persisted, so app
updates that add new tasks merge in **without** clobbering your status or notes.

Reads/writes go through the [`AppStorage`](lib/storage.ts) interface, so a later
swap to Supabase for cross-device sync is a one-file change — no UI impact.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type-check
npm run lint
```

## Reset

The sidebar (desktop) and Dashboard footer (mobile) have a **Reset to seed
data** button that clears all local state back to the seeded roadmap.
