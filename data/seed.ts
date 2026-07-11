import type { CapitalState, Phase, TaskSeed } from "@/lib/types";

/** Entity facts used throughout the app. */
export const ENTITY = {
  name: "Apollo Sports, LLC",
  dosId: "7959872",
  formedOn: "2026-07-06",
  address: "4 Robbins Lane, Great Neck, NY 11020",
  county: "Nassau County, NY",
  publicationDeadline: "2026-11-03", // within 120 days of formation
} as const;

export const PHASES: Phase[] = [
  { id: "p0", order: 0, title: "Foundation", subtitle: "Entity, paperwork, and your pro team" },
  { id: "p1", order: 1, title: "Capital", subtitle: "Line up equity and financing" },
  { id: "p2", order: 2, title: "Find & vet the space", subtitle: "Source, screen, and pressure-test properties" },
  { id: "p3", order: 3, title: "Lease", subtitle: "Negotiate terms and sign" },
  { id: "p4", order: 4, title: "Design & permits", subtitle: "The long pole — stamped drawings and approvals" },
  { id: "p5", order: 5, title: "Buildout", subtitle: "Convert the shell into courts" },
  { id: "p6", order: 6, title: "Operations setup", subtitle: "Everything to run day one (parallel to buildout)" },
  { id: "p7", order: 7, title: "Launch", subtitle: "Open the doors" },
];

export const TASK_SEED: TaskSeed[] = [
  // ───────────────────────── PHASE 0 — Foundation ─────────────────────────
  {
    id: "llc-file",
    phaseId: "p0",
    title: "File the LLC",
    initialStatus: "done",
    guidance: {
      what: "The legal entity that signs the lease and loan.",
      nextAction: "Confirmed formed. Move on to the operating agreement and publication.",
      steps: [
        "Articles of Organization filed 7/6/2026 (done)",
        "Keep the DOS filing receipt handy — you'll need it for the bank, publication, and lenders",
      ],
      done: "You have the stamped filing receipt showing DOS ID 7959872.",
      flags: ["Already complete — kept here as the anchor record."],
    },
  },
  {
    id: "operating-agreement",
    phaseId: "p0",
    title: "Adopt the Operating Agreement",
    dependsOn: ["llc-file"],
    guidance: {
      what: "NY §417 requires a written operating agreement within 90 days of formation. Not filed with the state — kept with your records.",
      nextAction: "Fill out a NY single-member operating agreement template, sign and date it, and store it.",
      steps: [
        "Get a NY single-member LLC operating agreement template",
        "Fill in: entity name, sole member, member-managed, capital contribution, profit/loss + dissolution",
        "Sign, date, and store with business records",
        "Bring a copy when opening the business bank account",
      ],
      resources: ["Templates: LLC University, Northwest, Rocket Lawyer"],
      done: "A signed operating agreement is saved with your records.",
      flags: [
        "If partners/investors or a Kotofit franchise come in, replace the template with an attorney-drafted agreement — ownership splits and exit terms then matter.",
      ],
    },
  },
  {
    id: "ein",
    phaseId: "p0",
    title: "Get an EIN",
    dependsOn: ["llc-file"],
    guidance: {
      what: "Federal tax ID for the LLC.",
      nextAction: "Apply free on IRS.gov.",
      steps: [
        "Apply online at IRS.gov (free, ~10 min)",
        "Save the EIN confirmation letter (CP 575)",
      ],
      resources: [
        "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      ],
      done: "You have the EIN confirmation letter.",
      flags: ["Some sites charge for this — it's free directly from the IRS."],
    },
  },
  {
    id: "publication",
    phaseId: "p0",
    title: "Complete the newspaper publication requirement",
    dependsOn: ["llc-file"],
    guidance: {
      what: "NY §206 requires publishing a Notice of Formation in TWO county-clerk-designated papers (one daily, one weekly) for 6 consecutive weeks, then filing a Certificate of Publication. Due within 120 days of formation.",
      nextAction: "Call the Nassau County Clerk to confirm current designated papers for a Great Neck office, then get quotes from the designated weekly + daily.",
      steps: [
        "Call Nassau County Clerk (516) 571-2660 — confirm current designated daily + weekly for a Great Neck address, and whether the town weekly is required or a countywide weekly is OK",
        "WEEKLY (your town): Great Neck News Record — 132 E. Second St, Mineola — (516) 747-8282. Or a countywide designated weekly.",
        "DAILY: choose from Newsday, NY Law Journal (Nassau Rates), or NY Post. NY Law Journal is usually cheapest for legals.",
        "Give both papers the Notice of Formation text (in Resources). Get the 6-week total from each.",
        "Run once weekly for 6 consecutive weeks in both; do them in the same week so the runs finish together.",
        "Collect both notarized Affidavits of Publication.",
        "File Certificate of Publication (Form DOS-1708-f) + both affidavits + $50 fee with NY DOS.",
      ],
      resources: [
        "Nassau County Clerk: (516) 571-2660",
        "Nassau designated papers page: https://www.nassaucountyny.gov/461/Designated-Newspapers",
        "Great Neck News Record: (516) 747-8282",
        "Notice text: 'NOTICE OF FORMATION OF APOLLO SPORTS, LLC. Articles of Organization filed with the Secretary of State of NY (SSNY) on 7/6/2026. Office Location: Nassau County. SSNY has been designated as agent upon whom process against it may be served. The Post Office address to which the SSNY shall mail a copy of any process is: 4 Robbins Lane, Great Neck, NY 11020. Principal business address: 4 Robbins Lane, Great Neck, NY 11020. Purpose: any lawful act or activity.'",
      ],
      done: "Certificate of Publication accepted by NY DOS (you receive the second filing receipt).",
      flags: [
        "DO NOT use the Jewish Herald — it is NOT on Nassau's official designated list (different paper from the designated Jewish Week / Jewish Press / Jewish Voice). Publishing there risks a rejected filing.",
        "Designations are 'subject to change' — verify by phone before paying anyone.",
        "DIY newspaper cost estimate: ~$750–$1,350. Full-service estimate: ~$595–$625. If using a service, confirm the exact designated papers before paying, and pay by credit card (not Zelle).",
        "If you'd rather not publish your home address, use a registered agent whose address is published instead — decide before publication since the notice must match what's on file.",
      ],
    },
  },
  {
    id: "beneficial-ownership",
    phaseId: "p0",
    title: "Confirm beneficial ownership filing status",
    guidance: {
      what: "Beneficial ownership reporting (federal CTA + NY LLC Transparency Act).",
      nextAction: "Confirm — as a US-formed (NY) LLC you are currently exempt from both. No filing needed. Re-verify at your attorney's confirmation.",
      steps: [
        "As of early 2026: federal CTA applies only to foreign reporting companies; US-formed LLCs exempt.",
        "NY LLC Transparency Act applies only to non-US LLCs; NY-formed LLCs exempt.",
        "Action: none required now.",
      ],
      done: "Attorney confirms no beneficial ownership filing is due for a domestic NY LLC.",
      flags: [
        "VERIFY: this area has flip-flopped repeatedly. Confirm status is unchanged on the day you would otherwise file.",
      ],
    },
  },
  {
    id: "cre-attorney",
    phaseId: "p0",
    title: "Hire a commercial real estate attorney",
    guidance: {
      what: "Reviews the LOI and lease, advises on entity structure and contingencies.",
      nextAction: "Get 2–3 referrals for CRE attorneys who do commercial leasing on Long Island.",
      steps: [
        "Ask other local business owners / your broker for referrals",
        "Confirm they handle commercial leasing + change-of-use",
        "Engage before you sign any LOI",
      ],
      done: "Attorney engaged and available to review your LOI.",
    },
  },
  {
    id: "cpa",
    phaseId: "p0",
    title: "Hire a CPA",
    guidance: {
      what: "Sets up books, advises on entity tax treatment, pressure-tests projections for lenders.",
      nextAction: "Get a referral for a CPA who works with small businesses / startups.",
      steps: [
        "Get referrals",
        "Confirm experience with SBA loan documentation",
        "Engage for bookkeeping setup + projection review",
      ],
      done: "CPA engaged.",
    },
  },
  {
    id: "tenant-rep-broker",
    phaseId: "p0",
    title: "Engage a tenant-rep broker",
    guidance: {
      what: "A broker who represents YOU (not the landlord), typically paid from the landlord's commission split — usually free to you.",
      nextAction: "Find and interview a tenant-rep broker active in Nassau industrial/flex space.",
      steps: [
        "Search 'tenant representation broker Nassau County / Long Island'",
        "Confirm: they represent tenants, paid by landlord split, experience with industrial/flex or recreation use",
        "Compare with your existing broker contacts (Joe 917-861-3124; James)",
      ],
      done: "A tenant-rep broker is working your search.",
      flags: ["LoopNet listing brokers represent the LANDLORD — you want your own rep."],
    },
  },

  // ───────────────────────── PHASE 1 — Capital ─────────────────────────
  {
    id: "personal-equity",
    phaseId: "p1",
    title: "Confirm personal equity available",
    guidance: {
      what: "Your own cash for the equity injection (SBA typically wants 10–20% down).",
      nextAction: "Decide how much personal capital you can inject; that sets your borrowing need.",
      steps: [
        "Total project need is in the Capital Stack tab",
        "Confirm liquid cash available for the equity injection",
        "Gap = SBA/lender amount",
      ],
      done: "You have a firm equity number.",
    },
  },
  {
    id: "sba-prequal",
    phaseId: "p1",
    title: "Get SBA 7(a) pre-qualification",
    dependsOn: ["personal-equity"],
    guidance: {
      what: "A soft read on borrowing capacity before you have a specific deal.",
      nextAction: "Use SBA LenderMatch and/or approach 2–3 SBA-preferred lenders for pre-qual.",
      steps: [
        "Prepare: credit, personal financial statement, resume, use-of-funds narrative",
        "Run SBA LenderMatch",
        "Talk to 2–3 SBA-preferred lenders",
        "Get a pre-qual range",
      ],
      resources: ["SBA LenderMatch: https://www.sba.gov/funding-programs/loans/lender-match"],
      done: "You have a pre-qual range and a lender relationship.",
      flags: [
        "Startup-from-scratch with no operating history is a harder SBA profile — strong documentation matters.",
        "Lenders underwrite the SPECIFIC deal — final approval comes once you have an LOI/lease + buildout budget.",
      ],
    },
  },
  {
    id: "business-plan",
    phaseId: "p1",
    title: "Prepare business plan + financial projections",
    dependsOn: ["personal-equity"],
    guidance: {
      what: "The narrative + numbers lenders and any investors will read.",
      nextAction: "Draft the plan; pull revenue/expense model from CourtFit and the Capital Stack.",
      steps: [
        "Executive summary, market, concept (badminton-led + pickleball)",
        "3-year P&L with DSCR",
        "Use-of-funds narrative",
        "Have the CPA review projections",
      ],
      done: "A lender-ready plan + projections exist.",
    },
  },
  {
    id: "equipment-financing",
    phaseId: "p1",
    title: "Explore equipment financing",
    dependsOn: ["sba-prequal"],
    guidance: {
      what: "Flooring, lighting, nets can sometimes be financed separately as equipment.",
      nextAction: "Ask lenders whether splitting equipment financing improves terms.",
      steps: [
        "Identify equipment line items",
        "Ask lenders about equipment financing vs. rolling into 7(a)",
      ],
      done: "You know whether equipment financing helps.",
    },
  },
  {
    id: "partners-investors",
    phaseId: "p1",
    title: "Identify partners / investors (if any)",
    guidance: {
      what: "Anyone taking equity — including a potential Kotofit franchise arrangement.",
      nextAction: "Decide solo vs. partners; if partners, attorney drafts the operating agreement accordingly.",
      steps: [
        "Decide franchise-vs-independent path",
        "If partners: define splits, roles, buy-sell",
        "Attorney-drafted operating agreement",
      ],
      done: "Ownership structure decided.",
      flags: [
        "The franchise-vs-independent decision affects branding and whether you operate under a DBA.",
      ],
    },
  },

  // ──────────────────── PHASE 2 — Find & vet the space ────────────────────
  {
    id: "space-criteria",
    phaseId: "p2",
    title: "Define space criteria",
    guidance: {
      what: "The physical filters that kill bad properties fast.",
      nextAction: "Lock your must-haves: SF (10–15k+), clear height 24ft+, parking, column spacing.",
      steps: [
        "Clear height 24ft+ (26–30ft better) to lowest obstruction",
        "~75% of SF usable for court hall (plan)",
        "Enough parking (critical in Nassau)",
        "Reasonable rent burden (<28–34% of stabilized revenue)",
      ],
      done: "A written criteria checklist you screen against.",
      flags: ["Column placement is often more decisive than raw square footage."],
    },
  },
  {
    id: "source-properties",
    phaseId: "p2",
    title: "Source properties",
    dependsOn: ["space-criteria"],
    guidance: {
      what: "Build a pipeline of candidate spaces.",
      nextAction: "Pull listings from LoopNet/Crexi + your broker's off-market inventory into the Property Tracker.",
      steps: [
        "Search LoopNet / Crexi",
        "Get off-market options from your tenant-rep broker",
        "Log each candidate in the Property Tracker tab",
      ],
      done: "A working list of candidate properties.",
    },
  },
  {
    id: "screen-candidates",
    phaseId: "p2",
    title: "Screen candidates",
    dependsOn: ["source-properties"],
    guidance: {
      what: "First-pass scoring before touring.",
      nextAction: "Run each candidate through CourtFit + the Property Tracker; rank by fit.",
      steps: [
        "Enter SF, rate, gross/NNN, clear height, parking",
        "Let all-in $/SF + annual rent compute",
        "Score fit 1–5, sort",
        "Send broker inquiry for missing specs",
      ],
      done: "A ranked shortlist.",
    },
  },
  {
    id: "tour-finalists",
    phaseId: "p2",
    title: "Tour finalists",
    dependsOn: ["screen-candidates"],
    guidance: {
      what: "See the top spaces in person.",
      nextAction: "Schedule walkthroughs for the top 2–3.",
      steps: [
        "Confirm clear height, columns, power, HVAC, restrooms on site",
        "Photograph everything",
        "Note condition for buildout scope",
      ],
      done: "Toured your shortlist.",
    },
  },
  {
    id: "feasibility-check",
    phaseId: "p2",
    title: "Pay for a feasibility check before committing",
    dependsOn: ["tour-finalists"],
    guidance: {
      what: "An architect/zoning consultant confirms the use is legal and buildable BEFORE you commit.",
      nextAction: "For your favorite, hire a few hours of architect/zoning-consultant time.",
      steps: [
        "Confirm use permitted (zoning) — verify on NYC ZoLa or the town/village",
        "Confirm CO can be changed to assembly/recreation",
        "Check egress, occupancy, parking, floor load",
      ],
      done: "A professional confirms the space is feasible.",
      flags: [
        "This is where most facility deals quietly die — do NOT skip it.",
        "Health & Fitness / court sports are as-of-right in NYC M1/M2/M3; Nassau zoning is local by town/village — verify locally.",
      ],
    },
  },

  // ───────────────────────── PHASE 3 — Lease ─────────────────────────
  {
    id: "loi",
    phaseId: "p3",
    title: "Negotiate the LOI",
    dependsOn: ["feasibility-check", "cre-attorney"],
    guidance: {
      what: "The Letter of Intent that sets the deal's key business terms before lawyers draft the lease.",
      nextAction: "Draft a Letter of Intent with your broker setting base rate, NNN load, term, TI allowance, free-rent, renewal, use clause.",
      steps: [
        "Work with your broker to draft the LOI",
        "Set base rate, NNN load, term, TI allowance, free-rent, renewal, and use clause",
      ],
      done: "Signed non-binding LOI.",
      flags: [
        "Negotiate hard here — moving terms is far cheaper in the LOI than after lawyers draft the lease.",
      ],
    },
  },
  {
    id: "use-zoning-contingencies",
    phaseId: "p3",
    title: "Secure use/zoning + permit/CO contingencies",
    dependsOn: ["loi"],
    guidance: {
      what: "Written escape hatches if the use isn't allowed or permits are denied.",
      nextAction: "Get contingencies in writing so you can walk if the use isn't allowed or permits are denied.",
      steps: [
        "Add use/zoning contingency to the LOI/lease",
        "Add permit + CO (certificate of occupancy) contingency",
      ],
      done: "Contingencies in the LOI/lease.",
      flags: ["Non-negotiable for a change-of-use conversion."],
    },
  },
  {
    id: "ti-free-rent",
    phaseId: "p3",
    title: "Negotiate TI allowance + free rent",
    dependsOn: ["loi"],
    guidance: {
      what: "Landlord contributions that directly cut your out-of-pocket cost.",
      nextAction: "Push for landlord TI $/SF and free rent through permitting + buildout.",
      steps: [
        "Negotiate a TI (tenant improvement) allowance in $/SF",
        "Negotiate free rent spanning permitting + buildout",
      ],
      done: "TI + free-rent terms locked.",
      flags: ["TI allowance directly reduces the buildout line in your Capital Stack."],
    },
  },
  {
    id: "lease-sign",
    phaseId: "p3",
    title: "Attorney reviews + sign lease",
    dependsOn: ["use-zoning-contingencies", "ti-free-rent"],
    guidance: {
      what: "Turning the LOI into a signed, financed lease.",
      nextAction: "Attorney drafts/reviews; finalize financing against this deal; sign.",
      steps: [
        "Attorney drafts/reviews the lease",
        "Finalize financing against this specific deal",
        "Sign the lease",
      ],
      done: "Lease executed.",
    },
  },

  // ────────────────── PHASE 4 — Design & permits (long pole) ──────────────────
  {
    id: "architect-mep",
    phaseId: "p4",
    title: "Hire architect + MEP engineer",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "The design team that produces stamped drawings for an assembly occupancy.",
      nextAction: "Engage a NY-licensed architect (assembly occupancy needs stamped drawings) + MEP engineer.",
      steps: [
        "Engage a NY-licensed architect",
        "Engage an MEP (mechanical/electrical/plumbing) engineer",
      ],
      done: "Design team engaged.",
    },
  },
  {
    id: "construction-docs",
    phaseId: "p4",
    title: "Produce construction documents",
    dependsOn: ["architect-mep"],
    guidance: {
      what: "The stamped construction documents (CDs) permits and GCs bid from.",
      nextAction: "Architect produces stamped CDs.",
      steps: ["Architect produces stamped construction documents"],
      done: "CDs complete.",
    },
  },
  {
    id: "submit-permits",
    phaseId: "p4",
    title: "Submit permits",
    dependsOn: ["construction-docs"],
    guidance: {
      what: "Filing for every approval the conversion needs.",
      nextAction: "File building permit + change-of-use/CO amendment + place-of-assembly (if triggered) + electrical/plumbing/mechanical.",
      steps: [
        "File building permit",
        "File change-of-use / CO amendment",
        "File place-of-assembly permit (if triggered)",
        "File electrical / plumbing / mechanical permits",
      ],
      done: "Permits issued.",
      flags: [
        "Least predictable step — weeks to months. This is why you fought for free rent.",
      ],
    },
  },

  // ───────────────────────── PHASE 5 — Buildout ─────────────────────────
  {
    id: "bid-gc",
    phaseId: "p5",
    title: "Bid + select GC",
    dependsOn: ["construction-docs"],
    guidance: {
      what: "Choosing the general contractor who runs the conversion.",
      nextAction: "Bid to 2–3 GCs with commercial/assembly experience; check references; select.",
      steps: [
        "Bid to 2–3 GCs with commercial/assembly experience",
        "Check references",
        "Select and contract",
      ],
      done: "GC contracted.",
      flags: ["GMP contract structure recommended for change-of-use conversion."],
    },
  },
  {
    id: "sport-flooring",
    phaseId: "p5",
    title: "Sport flooring",
    dependsOn: ["bid-gc", "submit-permits"],
    guidance: {
      what: "The court surfaces — badminton mats and pickleball surfacing.",
      nextAction: "Order badminton mat systems + pickleball surfacing.",
      steps: ["Order badminton mat systems", "Order pickleball surfacing", "Install"],
      done: "Floors installed.",
    },
  },
  {
    id: "sports-lighting",
    phaseId: "p5",
    title: "Sports lighting",
    dependsOn: ["bid-gc", "submit-permits"],
    guidance: {
      what: "Anti-glare LED lighting suitable for racquet sports.",
      nextAction: "Install anti-glare LED sports lighting.",
      steps: ["Spec and install anti-glare LED sports lighting"],
      done: "Lighting installed.",
    },
  },
  {
    id: "hvac-upgrade",
    phaseId: "p5",
    title: "HVAC upgrade",
    dependsOn: ["bid-gc", "submit-permits"],
    guidance: {
      what: "Draft-controlled climate — badminton is highly draft-sensitive.",
      nextAction: "Install draft-controlled HVAC (critical for badminton).",
      steps: ["Design draft-controlled HVAC", "Install and commission"],
      done: "HVAC commissioned.",
      flags: ["Often the single largest buildout line — badminton is draft-sensitive."],
    },
  },
  {
    id: "restrooms-foh",
    phaseId: "p5",
    title: "Restrooms / front-of-house",
    dependsOn: ["bid-gc", "submit-permits"],
    guidance: {
      what: "ADA restrooms/locker rooms plus the customer-facing spaces.",
      nextAction: "Build restrooms/locker rooms (ADA), front desk, pro shop, office.",
      steps: [
        "Build ADA restrooms / locker rooms",
        "Build front desk, pro shop, and office",
      ],
      done: "FOH complete.",
    },
  },
  {
    id: "inspections-co",
    phaseId: "p5",
    title: "Inspections → Certificate of Occupancy",
    dependsOn: ["sport-flooring", "sports-lighting", "hvac-upgrade", "restrooms-foh"],
    guidance: {
      what: "Passing inspections to earn the legal right to open.",
      nextAction: "Pass inspections; obtain the CO.",
      steps: ["Schedule and pass all inspections", "Obtain the Certificate of Occupancy"],
      done: "CO issued.",
      flags: ["The CO is the legal gate to opening — nothing opens without it."],
    },
  },

  // ────────────── PHASE 6 — Operations setup (parallel to Phase 5) ──────────────
  {
    id: "booking-software",
    phaseId: "p6",
    title: "Court booking software + payments",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "The system members use to book courts and pay.",
      nextAction: "Select booking/management software (e.g. CourtReserve, Playtomic) + payment processing.",
      steps: [
        "Evaluate CourtReserve, Playtomic, etc.",
        "Set up payment processing",
        "Configure courts, pricing, memberships",
      ],
      done: "Booking system live.",
    },
  },
  {
    id: "insurance",
    phaseId: "p6",
    title: "Insurance",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "The coverage the lease and lenders require.",
      nextAction: "Bind general liability, property, umbrella.",
      steps: ["Bind general liability", "Bind property", "Bind umbrella"],
      done: "Policies active.",
    },
  },
  {
    id: "licenses",
    phaseId: "p6",
    title: "Licenses",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "Local business license + NY sales tax registration.",
      nextAction: "Business license + NY sales tax certificate.",
      steps: ["Obtain local business license", "Register for a NY sales tax certificate"],
      done: "Licenses obtained.",
    },
  },
  {
    id: "hire-train-staff",
    phaseId: "p6",
    title: "Hire + train staff",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "Your opening-day team.",
      nextAction: "Hire front desk + coaches; train.",
      steps: ["Hire front desk staff", "Hire coaches", "Train the opening team"],
      done: "Opening staff ready.",
    },
  },
  {
    id: "equipment-proshop",
    phaseId: "p6",
    title: "Equipment + pro shop",
    dependsOn: ["lease-sign"],
    guidance: {
      what: "Nets, posts, furniture, and pro-shop inventory.",
      nextAction: "Order nets, posts, furniture, pro-shop inventory.",
      steps: ["Order nets and posts", "Order furniture", "Stock pro-shop inventory"],
      done: "Equipment on site.",
    },
  },
  {
    id: "branding-website",
    phaseId: "p6",
    title: "Branding + website + memberships",
    guidance: {
      what: "The public face: brand/DBA, website, and membership tiers.",
      nextAction: "Finalize brand/DBA, website, membership tiers + pricing.",
      steps: [
        "Finalize brand / DBA",
        "Build the website",
        "Define membership tiers + pricing",
      ],
      done: "Brand + site live.",
    },
  },
  {
    id: "presell-memberships",
    phaseId: "p6",
    title: "Pre-sell founding memberships",
    dependsOn: ["branding-website"],
    guidance: {
      what: "Opening with revenue instead of after it.",
      nextAction: "Open founding memberships + waitlist DURING buildout.",
      steps: ["Open founding-member sign-ups", "Run a waitlist during buildout"],
      done: "Pre-sales running.",
      flags: ["This protects cash flow at opening — launch with revenue, not after."],
    },
  },

  // ───────────────────────── PHASE 7 — Launch ─────────────────────────
  {
    id: "soft-open",
    phaseId: "p7",
    title: "Soft open",
    dependsOn: ["inspections-co"],
    guidance: {
      what: "A friends-&-family run to shake out problems.",
      nextAction: "Friends & family soft open to work out kinks.",
      steps: ["Invite friends & family", "Run operations end-to-end", "Fix what breaks"],
      done: "Soft open held.",
    },
  },
  {
    id: "grand-opening",
    phaseId: "p7",
    title: "Grand opening",
    dependsOn: ["soft-open"],
    guidance: {
      what: "The public launch.",
      nextAction: "Public grand opening.",
      steps: ["Plan and promote the grand opening", "Open to the public"],
      done: "Open to the public.",
    },
  },
  {
    id: "ongoing-programming",
    phaseId: "p7",
    title: "Ongoing programming",
    dependsOn: ["grand-opening"],
    guidance: {
      what: "The recurring programs that drive retention and revenue.",
      nextAction: "Run open play, leagues, clinics, coaching; focus on retention.",
      steps: [
        "Run open play and leagues",
        "Run clinics and coaching",
        "Focus on member retention",
      ],
      done: "Ongoing (never “done”).",
    },
  },
];

/** Capital Stack seed defaults (build spec §10). All figures are ESTIMATES. */
export const DEFAULT_CAPITAL: CapitalState = {
  low: {
    sqft: 10000,
    buildoutPerSf: 45,
    softCostPct: 0.16,
    contingencyPct: 0.11,
    equityPct: 0.15,
    leaseUpfront: 45000,
    ffe: 30000,
    preOpening: 120000,
  },
  expected: {
    sqft: 12500,
    buildoutPerSf: 64,
    softCostPct: 0.16,
    contingencyPct: 0.11,
    equityPct: 0.15,
    leaseUpfront: 70000,
    ffe: 55000,
    preOpening: 220000,
  },
  high: {
    sqft: 15000,
    buildoutPerSf: 87,
    softCostPct: 0.16,
    contingencyPct: 0.11,
    equityPct: 0.15,
    leaseUpfront: 100000,
    ffe: 80000,
    preOpening: 350000,
  },
};
