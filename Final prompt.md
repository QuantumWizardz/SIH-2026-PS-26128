# MASTER BUILD PROMPT — "Pashu Rakshak"
## Livestock Disease Early-Warning & Animal-Health Surveillance Platform
### Smart India Hackathon 2026 · Problem Statement SIH26128 · **Frontend-only interactive prototype**

> **How to use this document.** Paste this entire file into your coding assistant (Cursor, Claude Code, ChatGPT) as a single instruction. Build in the phase order given in Section 13. Do not ask clarifying questions before starting — every decision you need has already been made below. Where this document and your own defaults disagree, this document wins.

---

# SECTION 1 — ROLE & MISSION

You are a senior full-stack product engineer and design-led frontend architect. You are building a complete, demo-able, judge-facing **frontend-only prototype** of a national-scale livestock disease surveillance and decision-support platform.

This is one cohesive product, not eleven separate modules. Every feature below shares one design system, one mock data layer, one simulated API surface, one clock, and one event bus. A new disease report entering the system at one end must visibly ripple through clustering, risk scoring, mapping, facility recommendation, alerting and the animal's health record at the other end — with nothing faked in between.

**The product's one-sentence promise:**
> A farmer's symptom report — even one phoned in on a feature phone with no internet — becomes, within seconds, an explainable outbreak signal on a veterinary officer's map, a ranked list of the nearest labs and clinics, a booked consultation, a multilingual advisory pushed back to every farmer in the affected radius, and a permanent line in that animal's health passport.

---

# SECTION 2 — PROBLEM STATEMENT (the brief you are solving)

**"Efficient systems for early detection, prevention, and management of livestock diseases and animal health issues."**

Livestock owners, field veterinarians, para-veterinary workers and government departments lack a unified, real-time mechanism to identify emerging animal-health risks at the village, block and district levels. Disease symptoms are reported late, diagnostic facilities are distant, vaccination and treatment histories are incomplete, and information from farms, veterinary dispensaries, laboratories, vaccination drives and surveillance programmes stays fragmented. These gaps delay containment, increase livestock mortality and productivity loss, raise the risk of zoonotic transmission, and hurt farmers' incomes. The challenge is a practical system enabling early warning, rapid reporting, risk assessment, preventive action, referral and coordinated response — **including in low-connectivity areas.**

**Expected outcome:** a scalable animal-health surveillance and decision-support solution that can capture symptom and mortality reports from farmers and field workers; use rule-based or AI-assisted triage to flag suspected outbreaks; integrate geospatial risk mapping, weather and historical disease trends; maintain animal-level and herd-level health, vaccination and treatment records; issue multilingual advisories and alerts; support sample collection, laboratory referral and case escalation; provide dashboards for veterinary officials; and operate through mobile, web, IVR and offline-enabled channels. Expected outcomes: reduced reporting time, earlier outbreak identification, improved vaccination coverage, faster treatment and containment, lower mortality and productivity loss, and stronger evidence-based planning.

Every feature in Section 10 maps to a clause in that paragraph. Keep that traceability visible in the UI where it is cheap to do so.

---

# SECTION 3 — THE HARD CONSTRAINT: FRONTEND-ONLY, MOCKED END-TO-END

**This is non-negotiable and overrides every architectural suggestion in Section 10.**

Build this as a **frontend-only prototype**. There is **no backend server, no database, no Python, no FastAPI, no PostgreSQL, no PostGIS, no Twilio, no SMS gateway, no WhatsApp Cloud API, no weather API, and no LLM API call** in this phase. The entire application must run with `npm install && npm run dev` and work fully offline, out of the box, on a laptop with no keys, no `.env` values and no network.

### 3.1 What "mocked" means here

| Real-world thing | What you build instead |
|---|---|
| REST API / FastAPI routes | `src/services/api/*.ts` — async functions named after the exact REST paths, returning typed mock responses after a simulated latency |
| PostgreSQL / PostGIS tables | Typed TypeScript arrays + JSON files in `src/mock/`, loaded into a Zustand store that acts as the in-memory database |
| SQL transactions & row locks | Synchronous state mutations inside a single store action, guarded by an explicit status re-check (see F8 double-booking) |
| Twilio voice call + DTMF | An on-screen simulated feature-phone handset component with a keypad the judge can actually press |
| SMS / WhatsApp / Web Push delivery | A "Device Inbox" panel that renders the exact payload each driver produced, per channel, per language |
| Text-to-speech (SSML) | Render the generated SSML string in a monospaced panel; optionally call the browser's built-in `speechSynthesis` if a matching voice exists, and degrade silently if not |
| Auth + role-based access control | A role switcher in the header (Farmer / Veterinarian / Field Officer / Admin) that gates routes, actions and data visibility client-side |
| Weather API | `src/mock/weather.json`, read through a `weatherProvider` interface with one implementation |
| Trained ML model | Deterministic, pure, testable TypeScript functions — clearly labelled "rule-based engine" in code and "AI-assisted triage" in the pitch |

### 3.2 What must NOT be mocked

Mock the **data and the transport**. Never mock the **logic**. This distinction is the single most important instruction in this document.

**Hardcode these:** raw reports, villages, herds, animals, facilities, appointment slots, weather observations, historical baselines, disease profiles, farmer profiles, notification templates.

**Compute these live, in the browser, from the hardcoded raw data, every time:**
- cluster membership (DBSCAN over haversine distance)
- cluster radius, duration, villages/herds affected, growth rate
- symptom similarity (Jaccard)
- investigation priority scores, village risk scores, case risk scores, weather context scores, symptom-match confidence
- risk tiers and their thresholds
- every distance in kilometres
- facility rankings and "why recommended" bullet lists
- every "why flagged" explanation line
- historical baseline multipliers
- projected spread curves
- SMS digest text
- rendered notification bodies

> **If a number appears on screen, a judge must be able to change an input and watch that number change.** No hardcoded `86`. No hardcoded `4.2 km`. No hardcoded `"HIGH PRIORITY"`. No hardcoded explanation strings. The demo values quoted throughout this document are the values your seeded data *should produce*, never values you should type into a component.

### 3.3 Simulated API discipline

Every module talks to the rest of the system **only** through `src/services/api/`. No component reads `src/mock/*.json` directly. No component contains distance, scoring, ranking or clustering math. Engines live in `src/engines/`, are pure, take data in and return data out, and are unit-tested.

This gives you a one-file swap to a real backend later, and — critically for judging — it lets you show an in-app **API Contract** page listing every simulated endpoint with its live request/response shape.

---

# SECTION 4 — TECH STACK & PROJECT STRUCTURE

### 4.1 Stack (use exactly this)

- **React 18 + Vite + TypeScript** (strict mode on)
- **TailwindCSS** with the design tokens from Section 6 registered in `tailwind.config.js` — no arbitrary hex values scattered in components
- **Zustand** for global state (one root store composed of feature slices). No Redux.
- **React Router v6** for routing
- **react-leaflet + Leaflet + OpenStreetMap tiles** for all maps (no API key). Plus `leaflet.heat` for heatmaps and `react-leaflet-cluster` for marker clustering.
- **Recharts** for all charts
- **i18next + react-i18next** for the five locales
- **Dexie.js (IndexedDB)** for the offline queue in F2 — this is genuinely persistent and must survive a page reload
- **date-fns** for all date math
- **lucide-react** for icons, used sparingly (see Section 6.8)
- **Vitest + @testing-library/react** for tests
- **framer-motion** permitted only for the specific motion moments named in Section 6.9

No UI kit (no MUI, no Chakra, no shadcn). The design system in Section 6 is bespoke and you build its primitives yourself.

### 4.2 Project structure

```
src/
  main.tsx
  App.tsx
  routes.tsx

  design/                      # design system primitives ONLY
    tokens.ts                  # colors, spacing, radii, type scale as TS constants
    CircleMask.tsx             # the signature circular photo mask + offset backdrop
    ArchMask.tsx               # tombstone/arch mask for secondary imagery
    Button.tsx  Card.tsx  Section.tsx  Stat.tsx  Tag.tsx
    DotIndicator.tsx  RiskBadge.tsx  ScoreDial.tsx  EvidenceList.tsx
    EmptyState.tsx  UnknownValue.tsx  LoadingShimmer.tsx

  engines/                     # PURE, TESTED, NO REACT, NO I/O
    haversine.ts
    dbscan.ts                  # spatiotemporal DBSCAN
    symptomSimilarity.ts       # Jaccard + dominant symptom extraction
    baseline.ts                # historical anomaly multiplier
    investigationPriority.ts   # F3 cluster score  (0-100)
    triageMatrix.ts            # F5 deterministic S1-S6 matrix (0-100)
    differentialDiagnosis.ts   # F5 weighted pathogen overlap
    symptomConfidence.ts       # F1 symptom -> disease confidence engine
    villageRisk.ts             # F6 village risk score (0-100)
    weatherContext.ts          # F4 weather context score (0-100)
    contagion.ts               # F6 SIR-lite projection
    caseRisk.ts                # F10 IVR case-risk + severity
    facilityRanking.ts         # F7 filter + rank + explain
    dataQuality.ts             # F3 duplicate/completeness detection
    explain.ts                 # shared: builds evidence bullet lists from metrics

  services/
    api/                       # simulated REST surface (see Section 9)
      client.ts                # latency, failure injection, request log
      reports.api.ts  outbreaks.api.ts  weather.api.ts  villages.api.ts
      facilities.api.ts  appointments.api.ts  animals.api.ts
      diseases.api.ts  triage.api.ts  ivr.api.ts  notifications.api.ts
      digest.api.ts
    clock.ts                   # frozen demo clock + simulation stepping
    bus.ts                     # event bus: report:created, cluster:changed, ...
    connectivity.ts            # online/offline/syncing service (F2)
    localdb.ts                 # Dexie wrapper: pending_reports, images, kv

  store/                       # Zustand slices
    reportsSlice.ts  outbreakSlice.ts  facilitiesSlice.ts
    appointmentsSlice.ts  animalsSlice.ts  ivrSlice.ts
    notificationsSlice.ts  syncSlice.ts  sessionSlice.ts  uiSlice.ts

  mock/                        # raw seed data ONLY - never derived values
    villages.json  herds.json  animals.json
    reports.json  historical_baseline.json  historical_monthly_trends.json
    weather.json  facilities.json  appointment_slots.json  appointments.json
    diseases.json  farmers.json  vets.json  markets_routes.json
    vet_infrastructure.json  notification_templates.ts  ivr_prompts.ts
    simulation_script.ts

  features/                    # one folder per F1..F11, each with pages/ + components/
  i18n/                        # en.json hi.json pa.json gu.json mr.json
  types/                       # shared TypeScript domain types
```

---

# SECTION 5 — CANONICAL WORLD MODEL (read this before writing any data)

The eleven source specs this document merges were written independently and contain three different geographies, several overlapping score names, and two different demo dates. **These conflicts are resolved here, once. Follow these resolutions everywhere.**

### 5.1 Geography — Punjab is canonical

All coordinates, villages, districts, facilities, farms and animals live in **Punjab**, across four districts: **Patiala, Sangrur, Ludhiana, Bathinda**. The map opens centred on `[30.35, 76.1]` at zoom 8.

Where a source spec used Maharashtra coordinates (`19.100, 72.900`, "Demo District") or an Ahmednagar cluster origin, **re-anchor those synthetic points into Punjab while preserving their relative geometry exactly** — same inter-point distances, same cluster radius, same ordering of nearest facilities. The narrative anchor for every re-anchored scenario is **Rajpura (30.4841, 76.5940), Patiala district**.

Farmer-facing languages therefore lead with **Punjabi and Hindi**; Marathi remains a fully supported locale with its templates intact (see 5.3).

### 5.2 Frozen demo clock

`services/clock.ts` exports `NOW`, frozen at **2026-09-09T09:00:00+05:30**. Nothing in the app calls `new Date()` directly — everything reads the clock service. The simulation controls in F3/F7 advance this clock; advancing it must re-run every engine.

This matters: "72-hour window", "last 7 days rainfall", "reports in the last week", "upcoming appointments" and "seasonality = September" all resolve against `NOW`, not against the real system date, so the demo behaves identically in November.

### 5.3 Languages

Five locales, all fully wired through i18next: **English (`en`, default UI), Hindi (`hi`), Punjabi (`pa`), Gujarati (`gu`), Marathi (`mr`)**.

- Every farmer-facing string is translated: alerts, advisories, facility types, service labels, availability labels, recommendations, explanations, action steps, statuses, empty states, error states, map labels, IVR prompts.
- **Internal/machine values are never translated.** `diagnostic_laboratory`, `veterinary_consultation_pending`, `HIGH`, `suspected` stay language-independent; only their display labels change.
- Animal IDs, official facility names and laboratory names are never translated.
- The IVR module (F10) offers **Marathi = 1, Hindi = 2, English = 3** exactly as specified, because that is the rehearsed call flow.
- The notification template registry (F11) ships **verbatim Marathi and English bodies** exactly as given in Section 10.11 — do not paraphrase, re-translate or "improve" that Devanagari text. Punjabi, Hindi and Gujarati versions of those four templates are additionally required.
- Language fallback order: requested locale → `mr` for IVR/alerts templates (as specified) → `en`.

### 5.4 The five distinct scores — never merge them

This system computes five different 0–100 numbers. They have different owners, different inputs and different meanings. Keeping them separate is a correctness requirement and a talking point for judges.

| # | Score | Scope | Owner module | Answers |
|---|---|---|---|---|
| 1 | **Investigation Priority** | a detected *cluster* | F3 Outbreak Radar | "How urgently should authorities investigate this emerging spatiotemporal pattern?" |
| 2 | **Village Risk Score** | a *village* | F6 Mapping & Analytics | "How much risk is this village carrying right now, given cases, weather, season, proximity and vaccination gap?" |
| 3 | **Case Risk Score** | one *report / one animal or group* | F10 IVR + triage | "How urgent is this individual case?" |
| 4 | **Weather Context Score** | a *district* | F4 Weather Layer | "How unusual/conducive are current environmental conditions here?" |
| 5 | **Symptom-Match Confidence** | a *disease hypothesis* | F1 Knowledge Base | "How strongly do the reported symptoms point at this particular disease?" |

Plus one deterministic **Outbreak Risk Score** (Section 10.5) which is a specified point-matrix variant of #1 used for the guaranteed-scenario triage payload.

**Never display two of these as if they were the same number. Never average them into a single "score". Always label which one you are showing.** Confidence is not risk; risk is not probability; priority is not diagnosis.

### 5.5 ID conventions

Keep these verbatim so the cross-module demo narrative lines up:
- Villages `V01`–`V15` · Reports `R001`… · Clusters `CL001`… · Facilities `F001`… · Herds `H001`… · Slots `S001`… · Vaccinations `V001`… (namespaced separately from villages in code) · Diagnostics `D001`… · Visits `VIS001`…
- Appointments: generated at booking time as `APT-2026-0001XX` — **generated, never hardcoded**.
- IVR case IDs: generated as `26128-XXXXXX` with a collision-resistant suffix — **generated, never hardcoded**.
- Offline report IDs: `REPORT-<uuid v4>` generated on-device at creation time.
- The hero demo animal is **`MH-COW-00421`** (Cattle, 4 years). Keep this ID literally, even though the world is Punjab — treat it as an opaque legacy identifier. Every source spec's rehearsed flow references it.

### 5.6 Terminology discipline (used across all farmer- and officer-facing copy)

Permitted: *surveillance alert · suspected case · emerging cluster · investigation priority · high priority · preliminary assessment · recorded vaccination · previous illness recorded · veterinary confirmation pending · environmental conditions coincide with elevated disease activity.*

Forbidden anywhere in generated copy: *confirmed diagnosis (unless the record's own `source` is a veterinary or laboratory record) · "your animal has X" · "the outbreak is confirmed" · "the rainfall caused the outbreak" · any drug name with a dosage · any invented appointment, phone number, opening hour or lab capability.*

---

# SECTION 6 — GLOBAL DESIGN SYSTEM: "EARTHY MODERN MINIMALIST"

This is a government/agricultural surveillance tool that must not look like one. The visual direction is **organic modernism: premium, grounded, highly structured, visually soft.** Every screen in the app — including the dense officer dashboards and the map — obeys this system.

### 6.1 Colour tokens

Register these in Tailwind as named tokens. Components reference token names, never raw hex.

```
--cream        #F7F3EB   base background (warm off-white, textured)
--cream-deep   #EFE8DC   secondary surface / card fill on cream
--espresso     #382C2A   primary text, dark elements, buttons (never pure black)
--espresso-70  #6B5A56   secondary text
--espresso-40  #A99B96   tertiary text, hairlines, disabled
--terracotta   #E27D60   accent / highlight / active state — use SPARINGLY
--clay         #C96A4E   accent pressed/hover
--sand         #E8DCC8   subtle fills, table zebra, chart gridlines
```

**Risk-tier palette** — the source specs asked for green/yellow/orange/red. Do not use saturated web-safe versions of those; use these earthy equivalents so tiers stay legible and on-brand:

```
NORMAL / LOW        #6E8B5E   moss
WATCH / MODERATE    #C9A227   ochre
HIGH                #D97742   burnt orange
CRITICAL            #A63A28   deep rust
ZOONOTIC flag       #7B2D26   oxblood  (+ biohazard glyph, always paired with text)
```

Never let colour alone carry meaning: every tier chip shows its label text; every zoonotic marker carries a glyph and a text banner.

### 6.2 Texture and surface

The page background must carry a **very subtle vertical pinstripe / ribbed-paper texture** so it never reads as flat. Implement as a tiling CSS gradient at very low contrast, e.g. `repeating-linear-gradient(90deg, rgba(56,44,42,0.028) 0 1px, transparent 1px 7px)` layered over `--cream`. It must be invisible at a glance and obvious when you look for it. Respect `prefers-reduced-transparency` by keeping opacity this low regardless.

Cards are not floating SaaS rectangles. They are **large, quiet planes that blend into the background** — `--cream-deep` fill, no drop shadow, at most a 1px `--espresso-40` hairline at 30% opacity, corner radius 4px (see 6.7).

### 6.3 Whitespace

Extremely generous macro-whitespace. Section vertical padding on desktop: **112–160px**. Content gutters: **64–96px**. Inside a data-dense dashboard card, drop to a 24px rhythm, but never let two sections touch. The layout must feel breathable and uncrowded even when it is showing fifteen villages and six charts.

Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160`.

### 6.4 Typography

- **Family:** Montserrat throughout (self-host or use Fontsource so it works offline). One family only.
- **Headings:** 700–800 weight, tight line-height (1.05–1.15) on multi-line headings, letter-spacing `-0.02em` on the largest sizes.
- **Body:** 400 (or 300 for large intro paragraphs), line-height 1.55–1.6, max line length under 72 characters.
- **Type scale (desktop):** 72 / 52 / 36 / 26 / 20 / 17 / 15 / 13. High contrast between H1/H2 and body is a defining feature — do not compress it.
- **Numerals:** enable tabular figures (`font-variant-numeric: tabular-nums`) on every score, distance, count and time so digits do not jitter when they recompute.

### 6.5 Layout & grid

- **Asymmetry is the rule.** Alternate two-column sections: text-left/visual-right, then visual-left/text-right. Do not centre everything.
- **Vertical flow:** the page is a sequence of full-width floating sections that blend into the background, not a stack of identical boxes.
- 12-column grid, 1280px max content width, but let the map and the officer dashboard break to full-bleed.
- Marketing/landing and farmer-facing screens lean fully into the asymmetric editorial layout. Officer dashboards keep the same tokens, texture and whitespace but use a disciplined grid — the brand shows through in colour, type and calm, not in decoration.

### 6.6 Shapes & image treatment (the signature motif — do not skip)

- **Circular masks are the defining visual device.** Primary photography (cattle, field vets, vaccination drives, farmers) is always masked into a perfect circle.
- **Offset geometric backdrop:** behind each circular image sits a solid `--espresso` circle, offset by ~16–24px on a diagonal, producing a flat, stylised layered shadow. This is the single most recognisable element of the identity.
- **Secondary masks:** soft arches (tombstone shapes) and rounded rectangles for supporting imagery, used to break the rhythm of circles.
- **Floating elements:** allow images and small decorative geometric shapes (a bare circle outline, a quarter-arch) to break out of their grid boundaries and overlap adjacent text zones and section boundaries slightly.
- Since there are no real photographs available offline, ship tasteful generated placeholders: flat two-tone illustrations or solid `--sand`/`--espresso` fills inside the masks, with a `figcaption`-style caption below. Never ship a broken image icon, and never hotlink an external image.

### 6.7 UI components

- **Buttons:** solid flat rectangles, `--espresso` fill, cream text, corner radius **4px** (softened, decidedly not pill-shaped), generous horizontal padding (24–32px), no shadow, no gradient. Secondary button = 1px espresso outline on transparent. Destructive = `--espresso` fill with `--clay` text. The accent terracotta is used for *active state* and *emphasis*, not as the default button colour.
- **Navigation:** ultra-minimal top nav, small type (14px), wide letter-spacing, very generous gaps between links, active item marked with a 4px terracotta dot beneath rather than a colour change.
- **Indicators:** simple minimalist dot indicators for carousels and section tracking in `--espresso`; small circular outline arrows for pagination.
- **Inputs:** bottom-hairline only, no boxed borders, terracotta hairline on focus with a visible 2px focus ring for keyboard users.
- **Tables:** no vertical rules; `--sand` zebra at very low contrast; sortable headers with a small caret; row hover raises the fill, never the shadow.
- **RiskBadge:** a small rounded-rect chip with the tier colour as a 3px left bar, tier label in espresso, score in tabular numerals.
- **ScoreDial:** a thin-stroke circular arc showing a 0–100 score with the tier colour, the number large and centred, and the score's *name* below it in small caps-free label text (e.g. "Investigation priority"). Because there are five different scores, the dial must always carry its name.
- **EvidenceList:** the shared "Why flagged? / Why recommended?" component — a list of ✓ bullets, each generated from a computed metric, each with the underlying number visible.
- **UnknownValue:** a dedicated component that renders `Not recorded` / `Unknown` / `Not found within X km` in `--espresso-40` italic. Every field that can be missing must route through it. This is a product principle rendered as a component.

### 6.8 Iconography and emoji

The source specs use emoji (🏥 🧪 💉 🚑 🌧 💧 🌡 ⚠ 🚨 🔬). Keep the **semantic distinctions** but render them as `lucide-react` line icons in `--espresso` for a consistent, premium feel: hospital, flask-conical, syringe, ambulance, cloud-rain, droplets, thermometer, alert-triangle, siren, microscope. Emoji are permitted in exactly two places, where they are payload content rather than UI chrome: the SMS/WhatsApp notification bodies (F11) and the plain-text SMS digest (F6). Icons are 1.5px stroke, 20px default, and always paired with a text label.

### 6.9 Motion

One orchestrated moment per screen, no more.
- Landing: a single page-load sequence where the offset backdrop circle settles behind the masked hero image.
- Outbreak Radar: when a new report arrives during simulation, the affected cluster's boundary redraws and its score dial counts up to the new value. That is the moment — everything else on that screen stays still.
- Map: cluster circles ease their radius; markers do not bounce.
- Everything else: 120–180ms opacity/position transitions on user-triggered state changes only.
- Respect `prefers-reduced-motion: reduce` by cutting straight to end state.

### 6.10 Anti-generic guardrails

This brief's palette (warm cream + clay accent) is close to a very common AI-generated look. The brief's own words win, so keep the palette — but earn the distinctiveness elsewhere and avoid these specific tells:
- No tracked-out ALL-CAPS eyebrow labels above every heading. The source specs write headings like `SURVEILLANCE ALERT` — render those in sentence case ("Surveillance alert") with weight and size carrying the emphasis.
- No middle-dot meta strings (`A · B · C`) as a default; use them only where the content really is a list of peers.
- No identical rounded card + soft grey shadow kit. No `rgba(0,0,0,.1)` shadows anywhere.
- No `→` appended to link and button text.
- No monospace face for small data labels — monospace appears exactly twice in this app: the SSML preview panel and the API Contract page.
- Do not accent a single word inside a heading in terracotta. Terracotta marks *state*, not *words*.

### 6.11 Quality floor

Responsive to 360px (the farmer flows are mobile-first and must be genuinely usable on a phone), visible keyboard focus, semantic landmarks, `aria-live="polite"` on the sync-status and alert regions, all interactive targets ≥44px in farmer-facing flows, colour contrast ≥4.5:1 for body text against cream, charts readable without colour (patterns or direct labels).

---

# SECTION 7 — INFORMATION ARCHITECTURE

### 7.1 Roles

A header role switcher (this is the prototype's stand-in for auth) toggles between:

- **Farmer** — own animals, own reports, own appointments, advisories received, offline report capture.
- **Veterinarian** — appointment queue, pre-visit summaries, passports of animals with appointments, consultation completion, cluster context.
- **Field Officer** — assigned villages, report capture, surveillance entry, facility lookup.
- **Veterinary Officer / Admin (District)** — the command centre: outbreak radar, geospatial analytics, weather context, alerts dispatch, facility and slot management, audit log, API contract page.

Role changes must visibly change routes, navigation and the data on screen. A farmer must never see another farmer's animals — enforce ownership filtering in the mock API layer, not just by hiding UI.

### 7.2 Routes

```
/                         Landing / product story (full design-system showcase)
/report/new               Field report capture (offline-first)          [Farmer, Field Officer]
/reports                  My reports + sync queue                        [Farmer, Field Officer]
/radar                    Spatiotemporal Outbreak Radar                  [Officer, Vet]
/radar/cluster/:id        Cluster detail + evidence + weather context    [Officer, Vet]
/map                      Geospatial Mapping & Analytics command centre  [Officer]
/map/village/:id          Village drawer (risk breakdown, reports, vets) [Officer]
/triage/:reportId         Deterministic triage payload + differential    [Officer, Vet]
/knowledge                Disease Knowledge Base explorer                [all]
/knowledge/:diseaseId     Full disease profile                          [all]
/symptom-checker          Symptom → confidence engine                    [all]
/facilities               Facility finder + response support             [all]
/appointments/book        Booking flow                                   [Farmer]
/appointments             Appointment list / history                     [Farmer]
/vet/appointments         Vet appointment queue + consultation           [Vet]
/animals                  Animal search / my animals                     [all, scoped]
/animals/:animalId        Animal Health Passport                         [all, scoped]
/ivr                      IVR simulator (feature-phone handset)          [all]
/alerts                   Alerts & omnichannel dispatcher + Device Inbox [Officer]
/admin/audit              Audit log                                      [Admin]
/dev/api                  Simulated API contract + live request log      [Admin]
```

### 7.3 The persistent shell

Every authenticated route sits inside a shell containing: minimal top nav, role switcher, language switcher (5 locales), **connectivity/sync pill** (F2 — always visible, always truthful), and a **simulation control** (Run live simulation / Step / Reset) that is available to Officer and Admin from anywhere.
---

# SECTION 8 — MOCK DATA REQUIREMENTS

All files live in `src/mock/`. They contain **raw facts only** — never a computed cluster, score, tier, distance, ranking or explanation. If a value could be derived, derive it at runtime.

### 8.1 File inventory

| File | Contents | Volume |
|---|---|---|
| `villages.json` | 15 Punjab villages with populations + vaccination coverage | verbatim, §8.2 |
| `outbreak_reports.json` | 12 curated village-level outbreak reports driving the map narrative | verbatim, §8.3 |
| `weather.json` | district weather: current + 3-day forecast, plus a 14-day daily series | §8.4 |
| `vet_infrastructure.json` | 6 district-level hospitals with cold-chain flag | verbatim, §8.5 |
| `markets_routes.json` | 4 mandis with connected villages | verbatim, §8.6 |
| `historical_monthly_trends.json` | 12 months × 5 diseases state-wide counts | verbatim, §8.7 |
| `diseases.json` | 8 full disease profiles with weighted symptoms | verbatim, §8.8 |
| `reports.json` | 50–100 individual farmer/field symptom reports for clustering | generated to spec, §8.9 |
| `herds.json` | ~60 herds with animal counts + vaccination coverage | §8.10 |
| `facilities.json` | 30–50 vet facilities, labs, vaccination centres, emergency services | §8.11 |
| `animals.json` + related | 20–30 animals with vaccinations, illnesses, visits, assessments, diagnostics | §8.12 |
| `appointment_slots.json`, `appointments.json` | 50–100 slots across dates/statuses; several existing appointments | §8.13 |
| `farmers.json`, `vets.json` | farmer contact profiles + veterinarians | §8.14 |
| `historical_baseline.json` | per-district historical reports/week baseline | §8.15 |
| `notification_templates.ts` | immutable multilingual template registry | §8.16 |
| `ivr_prompts.ts` | localized IVR prompt strings keyed by state | §8.17 |
| `simulation_script.ts` | the scripted arrival sequence for live demos | §8.18 |

### 8.2 `villages.json` — use exactly this

```json
[
  { "id": "V01", "name": "Rajpura", "district": "Patiala", "block": "Rajpura", "lat": 30.4841, "lng": 76.5940, "cattlePop": 8200, "goatPop": 1400, "poultryPop": 3000, "vaccinationCoverage": 58 },
  { "id": "V02", "name": "Ghanaur", "district": "Patiala", "block": "Ghanaur", "lat": 30.3550, "lng": 76.6400, "cattlePop": 5100, "goatPop": 900, "poultryPop": 1200, "vaccinationCoverage": 49 },
  { "id": "V03", "name": "Nabha", "district": "Patiala", "block": "Nabha", "lat": 30.3728, "lng": 76.1511, "cattlePop": 6700, "goatPop": 1100, "poultryPop": 2000, "vaccinationCoverage": 71 },
  { "id": "V04", "name": "Samana", "district": "Patiala", "block": "Samana", "lat": 30.1602, "lng": 76.1902, "cattlePop": 4300, "goatPop": 1600, "poultryPop": 1800, "vaccinationCoverage": 66 },
  { "id": "V05", "name": "Patran", "district": "Patiala", "block": "Patran", "lat": 30.1889, "lng": 75.9767, "cattlePop": 3900, "goatPop": 2100, "poultryPop": 900, "vaccinationCoverage": 44 },
  { "id": "V06", "name": "Bhadson", "district": "Patiala", "block": "Bhadson", "lat": 30.4333, "lng": 76.2333, "cattlePop": 5000, "goatPop": 800, "poultryPop": 1000, "vaccinationCoverage": 62 },
  { "id": "V07", "name": "Sangrur", "district": "Sangrur", "block": "Sangrur", "lat": 30.2458, "lng": 75.8421, "cattlePop": 7200, "goatPop": 1300, "poultryPop": 2500, "vaccinationCoverage": 77 },
  { "id": "V08", "name": "Dhuri", "district": "Sangrur", "block": "Dhuri", "lat": 30.3667, "lng": 75.8500, "cattlePop": 4600, "goatPop": 1000, "poultryPop": 1500, "vaccinationCoverage": 68 },
  { "id": "V09", "name": "Malerkotla", "district": "Sangrur", "block": "Malerkotla", "lat": 30.5222, "lng": 75.8814, "cattlePop": 5300, "goatPop": 2200, "poultryPop": 1700, "vaccinationCoverage": 53 },
  { "id": "V10", "name": "Sunam", "district": "Sangrur", "block": "Sunam", "lat": 30.1300, "lng": 75.8000, "cattlePop": 3800, "goatPop": 1500, "poultryPop": 1100, "vaccinationCoverage": 60 },
  { "id": "V11", "name": "Khanna", "district": "Ludhiana", "block": "Khanna", "lat": 30.7046, "lng": 76.2222, "cattlePop": 4100, "goatPop": 700, "poultryPop": 9500, "vaccinationCoverage": 81 },
  { "id": "V12", "name": "Samrala", "district": "Ludhiana", "block": "Samrala", "lat": 30.8367, "lng": 76.1900, "cattlePop": 3600, "goatPop": 650, "poultryPop": 4200, "vaccinationCoverage": 74 },
  { "id": "V13", "name": "Payal", "district": "Ludhiana", "block": "Payal", "lat": 30.7300, "lng": 75.9300, "cattlePop": 3300, "goatPop": 600, "poultryPop": 2800, "vaccinationCoverage": 69 },
  { "id": "V14", "name": "Rampura Phul", "district": "Bathinda", "block": "Rampura Phul", "lat": 30.2667, "lng": 75.1333, "cattlePop": 4900, "goatPop": 2600, "poultryPop": 800, "vaccinationCoverage": 39 },
  { "id": "V15", "name": "Talwandi Sabo", "district": "Bathinda", "block": "Talwandi Sabo", "lat": 29.9833, "lng": 75.0833, "cattlePop": 4200, "goatPop": 2400, "poultryPop": 700, "vaccinationCoverage": 41 }
]
```

### 8.3 `outbreak_reports.json` — use exactly this

Status values: `suspected | confirmed | contained`. Dates are relative to the frozen demo date **2026-09-09**.

```json
[
  { "id": "R001", "villageId": "V01", "disease": "FMD", "species": "cattle", "cases": 34, "deaths": 2, "status": "confirmed", "reportedDate": "2026-09-02", "reportedBy": "Field Vet - Rajpura" },
  { "id": "R002", "villageId": "V02", "disease": "FMD", "species": "cattle", "cases": 19, "deaths": 1, "status": "confirmed", "reportedDate": "2026-09-05", "reportedBy": "Para-vet Worker" },
  { "id": "R003", "villageId": "V06", "disease": "FMD", "species": "buffalo", "cases": 6, "deaths": 0, "status": "suspected", "reportedDate": "2026-09-08", "reportedBy": "Farmer App" },
  { "id": "R004", "villageId": "V09", "disease": "LSD", "species": "cattle", "cases": 27, "deaths": 3, "status": "confirmed", "reportedDate": "2026-08-30", "reportedBy": "Field Vet - Malerkotla" },
  { "id": "R005", "villageId": "V07", "disease": "LSD", "species": "cattle", "cases": 8, "deaths": 0, "status": "suspected", "reportedDate": "2026-09-07", "reportedBy": "Farmer App" },
  { "id": "R006", "villageId": "V14", "disease": "PPR", "species": "goat", "cases": 41, "deaths": 6, "status": "confirmed", "reportedDate": "2026-08-27", "reportedBy": "Field Vet - Rampura" },
  { "id": "R007", "villageId": "V15", "disease": "PPR", "species": "sheep", "cases": 15, "deaths": 1, "status": "confirmed", "reportedDate": "2026-09-01", "reportedBy": "Para-vet Worker" },
  { "id": "R008", "villageId": "V11", "disease": "AvianFlu", "species": "poultry", "cases": 120, "deaths": 45, "status": "confirmed", "reportedDate": "2026-09-04", "reportedBy": "Poultry Farm Inspector" },
  { "id": "R009", "villageId": "V05", "disease": "Anthrax", "species": "cattle", "cases": 2, "deaths": 2, "status": "suspected", "reportedDate": "2026-09-08", "reportedBy": "Farmer App", "zoonotic": true },
  { "id": "R010", "villageId": "V03", "disease": "HS", "species": "buffalo", "cases": 5, "deaths": 1, "status": "contained", "reportedDate": "2026-08-20", "reportedBy": "Field Vet - Nabha" },
  { "id": "R011", "villageId": "V08", "disease": "LSD", "species": "cattle", "cases": 3, "deaths": 0, "status": "suspected", "reportedDate": "2026-09-09", "reportedBy": "Farmer App" },
  { "id": "R012", "villageId": "V04", "disease": "PPR", "species": "goat", "cases": 4, "deaths": 0, "status": "suspected", "reportedDate": "2026-09-06", "reportedBy": "Para-vet Worker" }
]
```

The built-in narrative to preserve: an FMD cluster around **Rajpura (V01)** spreading toward **Ghanaur (V02)** and **Bhadson (V06)**, with **Nabha (V03)** exposed via the shared Rajpura Mandi despite being 25 km away; an LSD cluster around **Malerkotla (V09)**; a PPR cluster in goat-dense **Bathinda**; a poultry HPAI event at **Khanna (V11)**; and a suspected **Anthrax** case at **Patran (V05)** that must trigger the zoonotic path.

### 8.4 `weather.json`

Start from this district-level block exactly:

```json
{
  "Patiala":  { "tempC": 32, "humidityPct": 78, "rainfallLast7dMm": 38, "forecast": [{"day":1,"tempC":31,"humidityPct":80},{"day":2,"tempC":30,"humidityPct":82},{"day":3,"tempC":32,"humidityPct":75}] },
  "Sangrur":  { "tempC": 33, "humidityPct": 74, "rainfallLast7dMm": 22, "forecast": [{"day":1,"tempC":33,"humidityPct":72},{"day":2,"tempC":32,"humidityPct":76},{"day":3,"tempC":31,"humidityPct":78}] },
  "Ludhiana": { "tempC": 31, "humidityPct": 70, "rainfallLast7dMm": 15, "forecast": [{"day":1,"tempC":30,"humidityPct":71},{"day":2,"tempC":29,"humidityPct":73},{"day":3,"tempC":30,"humidityPct":69}] },
  "Bathinda": { "tempC": 35, "humidityPct": 55, "rainfallLast7dMm": 6,  "forecast": [{"day":1,"tempC":35,"humidityPct":53},{"day":2,"tempC":36,"humidityPct":50},{"day":3,"tempC":34,"humidityPct":57}] }
}
```

Then **extend** it (keeping this shape) with a `daily` array per district covering the **14 days ending 2026-09-09**, each entry `{ date, rainfall_mm, temperature_c, humidity_percent }`. The 7-day window ending on the demo date must show Patiala accumulating heavy rainfall and high humidity (roughly 140–150 mm total, average humidity ~84%) while Bathinda stays dry — this is what makes the F4 weather-context contrast visible. Also support the district-day record shape required by the weather module:

```json
{ "district": "Patiala", "date": "2026-09-08", "rainfall_mm": 48.5, "temperature_c": 29.4, "humidity_percent": 86 }
```

All weather access goes through a `weatherProvider` interface with a single `MockWeatherProvider` implementation, so a real API can replace it later.

### 8.5 `vet_infrastructure.json` — use exactly this

```json
[
  { "id": "H1", "name": "Civil Veterinary Hospital, Patiala", "lat": 30.3398, "lng": 76.3869, "coldChain": true,  "capacity": "High" },
  { "id": "H2", "name": "Veterinary Dispensary, Rajpura",     "lat": 30.4850, "lng": 76.5900, "coldChain": false, "capacity": "Low" },
  { "id": "H3", "name": "District Vet Hospital, Sangrur",     "lat": 30.2458, "lng": 75.8421, "coldChain": true,  "capacity": "Medium" },
  { "id": "H4", "name": "Veterinary Dispensary, Malerkotla",  "lat": 30.5222, "lng": 75.8814, "coldChain": false, "capacity": "Low" },
  { "id": "H5", "name": "District Vet Hospital, Ludhiana",    "lat": 30.9010, "lng": 75.8573, "coldChain": true,  "capacity": "High" },
  { "id": "H6", "name": "District Vet Hospital, Bathinda",    "lat": 30.2110, "lng": 74.9455, "coldChain": true,  "capacity": "Medium" }
]
```

### 8.6 `markets_routes.json` — use exactly this

```json
[
  { "id": "M1", "name": "Rajpura Cattle Mandi", "lat": 30.4800, "lng": 76.5950, "connectedVillageIds": ["V01","V02","V06","V03"] },
  { "id": "M2", "name": "Sangrur Livestock Market", "lat": 30.2460, "lng": 75.8400, "connectedVillageIds": ["V07","V08","V09","V10"] },
  { "id": "M3", "name": "Khanna Poultry & Cattle Market", "lat": 30.7050, "lng": 76.2200, "connectedVillageIds": ["V11","V12","V13"] },
  { "id": "M4", "name": "Bathinda Regional Mandi", "lat": 30.2100, "lng": 74.9500, "connectedVillageIds": ["V14","V15"] }
]
```

### 8.7 `historical_monthly_trends.json` — use exactly this

```json
[
  { "month": "2025-10", "FMD": 12, "LSD": 8,  "PPR": 20, "AvianFlu": 5,  "HS": 6 },
  { "month": "2025-11", "FMD": 9,  "LSD": 6,  "PPR": 34, "AvianFlu": 14, "HS": 4 },
  { "month": "2025-12", "FMD": 7,  "LSD": 5,  "PPR": 48, "AvianFlu": 27, "HS": 3 },
  { "month": "2026-01", "FMD": 6,  "LSD": 4,  "PPR": 52, "AvianFlu": 31, "HS": 2 },
  { "month": "2026-02", "FMD": 8,  "LSD": 5,  "PPR": 41, "AvianFlu": 22, "HS": 3 },
  { "month": "2026-03", "FMD": 11, "LSD": 9,  "PPR": 25, "AvianFlu": 11, "HS": 5 },
  { "month": "2026-04", "FMD": 15, "LSD": 14, "PPR": 14, "AvianFlu": 4,  "HS": 9 },
  { "month": "2026-05", "FMD": 19, "LSD": 21, "PPR": 9,  "AvianFlu": 2,  "HS": 14 },
  { "month": "2026-06", "FMD": 26, "LSD": 29, "PPR": 6,  "AvianFlu": 1,  "HS": 21 },
  { "month": "2026-07", "FMD": 38, "LSD": 41, "PPR": 5,  "AvianFlu": 1,  "HS": 33 },
  { "month": "2026-08", "FMD": 44, "LSD": 47, "PPR": 7,  "AvianFlu": 2,  "HS": 29 },
  { "month": "2026-09", "FMD": 31, "LSD": 35, "PPR": 11, "AvianFlu": 3,  "HS": 18 }
]
```

The seasonality is deliberate: FMD/LSD/HS peak with the monsoon (Jun–Sep); PPR and Avian Influenza peak in winter (Nov–Feb). The forecast feature in F6 reads this curve.

### 8.8 `diseases.json` — use exactly this (the knowledge base)

Schema per disease:

```json
{
  "id": "string (slug, e.g. 'fmd_001')",
  "disease_name": { "en": "string", "hi": "string", "pa": "string" },
  "abbreviation": "string",
  "species_affected": ["Cattle", "Buffalo", "Goat", "Sheep", "Pig", "Poultry"],
  "zoonotic": true,
  "symptoms": {
    "early": [ { "name": "string", "weight": 1-10 } ],
    "late":  [ { "name": "string", "weight": 1-10 } ]
  },
  "incubation_period_days": { "min": 0, "max": 0, "typical": 0 },
  "transmission_mode": ["string"],
  "severity": "Low | Medium | High | Critical",
  "mortality_characteristics": { "adult_mortality_rate_pct": 0, "young_mortality_rate_pct": 0, "note": "string" },
  "geographic_prevalence": ["State names"],
  "seasonality": { "peak_months": ["Month"], "note": "string" },
  "vaccination": { "vaccine_name": "string", "schedule": "string", "efficacy_pct": 0, "govt_program": "string" },
  "treatment_supportive_management": ["string"],
  "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h) | Within 72h | Routine", "reporting_authority": "string", "legal_basis": "string" },
  "recommended_containment_action": ["string"]
}
```

`weight` = how strongly that symptom points at this specific disease (10 = pathognomonic/near-unique, 1 = vague and generic). The weights power the confidence engine in F1 — do not drop, round or "simplify" them.

Extend each entry with `disease_name.gu` and `disease_name.mr` translations so all five locales resolve; leave the rest of the object byte-identical to this:

```json
[
  {
    "id": "fmd_001",
    "disease_name": { "en": "Foot-and-Mouth Disease", "hi": "खुरपका-मुंहपका रोग", "pa": "ਖੁਰ-ਮੂੰਹ ਦੀ ਬਿਮਾਰੀ" },
    "abbreviation": "FMD",
    "species_affected": ["Cattle", "Buffalo", "Sheep", "Goat", "Pig"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "High fever (104-106°F)", "weight": 6 }, { "name": "Loss of appetite", "weight": 3 }, { "name": "Reduced milk yield", "weight": 4 } ],
      "late": [ { "name": "Blisters on mouth, tongue, gums", "weight": 10 }, { "name": "Blisters between hooves / foot", "weight": 10 }, { "name": "Excessive salivation and drooling", "weight": 9 }, { "name": "Lameness / reluctance to walk", "weight": 7 } ]
    },
    "incubation_period_days": { "min": 2, "max": 14, "typical": 5 },
    "transmission_mode": ["Direct contact", "Airborne (up to 60 km)", "Contaminated fodder/water", "Fomites (vehicles, handlers, equipment)"],
    "severity": "High",
    "mortality_characteristics": { "adult_mortality_rate_pct": 2, "young_mortality_rate_pct": 50, "note": "Low mortality in adults; high in young calves due to myocarditis" },
    "geographic_prevalence": ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan", "Gujarat"],
    "seasonality": { "peak_months": ["July", "August", "September", "October"], "note": "Peaks post-monsoon due to congregation at shared water/grazing points" },
    "vaccination": { "vaccine_name": "FMD Polyvalent Vaccine (O, A, Asia-1)", "schedule": "Biannual, every 6 months under NADCP", "efficacy_pct": 85, "govt_program": "National Animal Disease Control Programme (NADCP)" },
    "treatment_supportive_management": ["Isolate affected animals immediately", "Soft, easily digestible feed", "Antiseptic mouth/foot wash (e.g. potassium permanganate)", "Antibiotics for secondary bacterial infection", "Oral rehydration / supportive fluids"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h)", "reporting_authority": "State Animal Husbandry Dept / nearest Veterinary Dispensary", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Quarantine farm; 10 km surveillance zone", "Restrict animal movement/markets in area for 30 days", "Disinfect sheds, vehicles, equipment (citric acid/sodium carbonate)", "Ring-vaccinate unaffected animals in radius", "Report to District Animal Husbandry Officer"]
  },
  {
    "id": "lsd_002",
    "disease_name": { "en": "Lumpy Skin Disease", "hi": "लम्पी त्वचा रोग", "pa": "ਲੰਪੀ ਸਕਿਨ ਬਿਮਾਰੀ" },
    "abbreviation": "LSD",
    "species_affected": ["Cattle", "Buffalo"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "Fever (up to 105°F)", "weight": 5 }, { "name": "Watery eyes/nasal discharge", "weight": 4 }, { "name": "Drop in milk yield", "weight": 4 } ],
      "late": [ { "name": "Firm skin nodules (2-5 cm) all over body", "weight": 10 }, { "name": "Swollen lymph nodes", "weight": 7 }, { "name": "Swelling of limbs", "weight": 6 }, { "name": "Nodules ulcerating/scabbing", "weight": 8 } ]
    },
    "incubation_period_days": { "min": 4, "max": 14, "typical": 7 },
    "transmission_mode": ["Blood-feeding insects (mosquitoes, flies, ticks)", "Direct contact", "Contaminated fomites"],
    "severity": "Medium",
    "mortality_characteristics": { "adult_mortality_rate_pct": 5, "young_mortality_rate_pct": 15, "note": "Morbidity high (up to 45%); mortality usually low but production loss is severe" },
    "geographic_prevalence": ["Rajasthan", "Punjab", "Haryana", "Gujarat", "Uttar Pradesh", "Himachal Pradesh"],
    "seasonality": { "peak_months": ["May", "June", "July", "August", "September"], "note": "Peaks with vector (fly/mosquito) activity in warm, humid months" },
    "vaccination": { "vaccine_name": "Lumpi-ProVacInd / Goat Pox vaccine (heterologous)", "schedule": "Annual", "efficacy_pct": 80, "govt_program": "State-led emergency ring vaccination drives" },
    "treatment_supportive_management": ["Isolate affected cattle", "Anti-inflammatory + antipyretic drugs", "Antibiotics for secondary skin infection", "Wound dressing on nodules", "Vector control (insect repellents, fly control in shed)"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h)", "reporting_authority": "State Animal Husbandry Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Isolate infected + in-contact animals", "Vector control across a 5 km radius", "Ring vaccination of healthy cattle nearby", "Restrict cattle fairs/markets in affected block", "Disinfect sheds and equipment"]
  },
  {
    "id": "ppr_003",
    "disease_name": { "en": "Peste des Petits Ruminants", "hi": "बकरी प्लेग", "pa": "ਬੱਕਰੀ ਪਲੇਗ" },
    "abbreviation": "PPR",
    "species_affected": ["Goat", "Sheep"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "Sudden high fever (up to 106°F)", "weight": 6 }, { "name": "Depression, reduced feeding", "weight": 3 } ],
      "late": [ { "name": "Oral erosions/ulcers", "weight": 9 }, { "name": "Severe diarrhoea", "weight": 8 }, { "name": "Nasal/ocular discharge", "weight": 6 }, { "name": "Pneumonia/coughing", "weight": 7 } ]
    },
    "incubation_period_days": { "min": 3, "max": 10, "typical": 5 },
    "transmission_mode": ["Direct contact", "Aerosol/respiratory droplets", "Contaminated feed and water"],
    "severity": "Critical",
    "mortality_characteristics": { "adult_mortality_rate_pct": 50, "young_mortality_rate_pct": 90, "note": "Can approach 100% in naive, young or stressed flocks" },
    "geographic_prevalence": ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Bihar", "West Bengal"],
    "seasonality": { "peak_months": ["November", "December", "January", "February"], "note": "Peaks in cold, dry winter months" },
    "vaccination": { "vaccine_name": "PPR Live Attenuated Vaccine", "schedule": "Once, with 3-yearly booster; part of national PPR eradication plan", "efficacy_pct": 90, "govt_program": "National Control Programme for PPR (NCP-PPR)" },
    "treatment_supportive_management": ["No specific antiviral — supportive care only", "Broad-spectrum antibiotics for secondary infection", "Oral rehydration for diarrhoea", "Isolate and keep warm/dry"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h)", "reporting_authority": "State Animal Husbandry Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Immediate isolation of flock", "Ban movement/sale of small ruminants in a 3 km radius", "Emergency ring vaccination", "Safe carcass disposal (deep burial/burning)", "Disinfect pens with 1% sodium hypochlorite"]
  },
  {
    "id": "hpai_004",
    "disease_name": { "en": "Highly Pathogenic Avian Influenza", "hi": "बर्ड फ्लू", "pa": "ਬਰਡ ਫਲੂ" },
    "abbreviation": "HPAI",
    "species_affected": ["Poultry"],
    "zoonotic": true,
    "symptoms": {
      "early": [ { "name": "Sudden drop in feed/water intake", "weight": 5 }, { "name": "Ruffled feathers, lethargy", "weight": 4 } ],
      "late": [ { "name": "Sudden unexplained mass mortality", "weight": 10 }, { "name": "Swollen head, cyanotic comb/wattles", "weight": 9 }, { "name": "Sharp drop in egg production", "weight": 7 }, { "name": "Respiratory distress", "weight": 6 } ]
    },
    "incubation_period_days": { "min": 1, "max": 7, "typical": 3 },
    "transmission_mode": ["Migratory wild birds", "Direct contact with infected birds/droppings", "Contaminated equipment, feed, water", "Live bird markets"],
    "severity": "Critical",
    "mortality_characteristics": { "adult_mortality_rate_pct": 90, "young_mortality_rate_pct": 100, "note": "Can cause near-100% flock mortality within 48 hours" },
    "geographic_prevalence": ["Kerala", "West Bengal", "Haryana", "Himachal Pradesh", "Maharashtra"],
    "seasonality": { "peak_months": ["November", "December", "January", "February"], "note": "Correlates with migratory bird season" },
    "vaccination": { "vaccine_name": "Not recommended (culling policy) in India", "schedule": "N/A", "efficacy_pct": 0, "govt_program": "Stamping-out policy under National Action Plan for Avian Influenza" },
    "treatment_supportive_management": ["No treatment — notifiable, cull-only policy", "Biosecurity lockdown of premises", "PPE mandatory for handlers (zoonotic risk)"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h) — dual report to Animal AND Public Health dept", "reporting_authority": "State Animal Husbandry Dept + District Health Dept (zoonotic)", "legal_basis": "National Action Plan for Prevention, Control & Containment of Avian Influenza" },
    "recommended_containment_action": ["Immediate culling within 1 km infected zone", "10 km surveillance zone, movement ban 90 days", "Safe disposal of carcasses (burial/incineration)", "Alert public health authorities — zoonotic risk to handlers", "Disinfect and depopulate affected sheds before restocking"]
  },
  {
    "id": "anthrax_005",
    "disease_name": { "en": "Anthrax", "hi": "तिल्ली रोग / एंथ्रेक्स", "pa": "ਤਿੱਲੀ ਦੀ ਬਿਮਾਰੀ" },
    "abbreviation": "Anthrax",
    "species_affected": ["Cattle", "Buffalo", "Sheep", "Goat"],
    "zoonotic": true,
    "symptoms": {
      "early": [ { "name": "Sudden high fever", "weight": 5 }, { "name": "Staggering, trembling", "weight": 6 } ],
      "late": [ { "name": "Sudden death with dark, unclotted blood from body openings", "weight": 10 }, { "name": "Bloody discharge from nose/mouth/anus", "weight": 9 }, { "name": "Rapid bloating of carcass after death", "weight": 8 } ]
    },
    "incubation_period_days": { "min": 1, "max": 7, "typical": 3 },
    "transmission_mode": ["Ingestion of spore-contaminated soil/fodder", "Contact with contaminated carcasses", "Biting flies (mechanical vector)"],
    "severity": "Critical",
    "mortality_characteristics": { "adult_mortality_rate_pct": 90, "young_mortality_rate_pct": 95, "note": "Often peracute — animal found dead with no prior signs observed" },
    "geographic_prevalence": ["Andhra Pradesh", "Tamil Nadu", "Karnataka", "Odisha", "West Bengal"],
    "seasonality": { "peak_months": ["June", "July", "August"], "note": "Spore exposure rises after heavy rains disturb soil" },
    "vaccination": { "vaccine_name": "Anthrax Spore Vaccine", "schedule": "Annual, before monsoon in endemic zones", "efficacy_pct": 85, "govt_program": "State endemic-zone vaccination drives" },
    "treatment_supportive_management": ["High-dose antibiotics (penicillin/oxytetracycline) if caught early", "DO NOT open the carcass — spores will contaminate soil for decades", "Isolate herd from carcass site immediately"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h) — zoonotic emergency", "reporting_authority": "State Animal Husbandry Dept + District Health Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Do not open/skin the carcass — burn or bury deep (2m) with lime", "Quarantine and disinfect the site", "Vaccinate all in-contact/herd animals", "Alert public health dept — human handlers at risk", "Restrict grazing on the site for years, not days"]
  },
  {
    "id": "csf_006",
    "disease_name": { "en": "Classical Swine Fever", "hi": "सुअर बुखार", "pa": "ਸੂਰ ਬੁਖਾਰ" },
    "abbreviation": "CSF",
    "species_affected": ["Pig"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "High fever, huddling", "weight": 5 }, { "name": "Loss of appetite", "weight": 3 } ],
      "late": [ { "name": "Purple skin discoloration (ears, abdomen, legs)", "weight": 9 }, { "name": "Staggering gait / hind-limb weakness", "weight": 7 }, { "name": "Constipation followed by diarrhoea", "weight": 6 }, { "name": "Sudden high mortality in the herd", "weight": 8 } ]
    },
    "incubation_period_days": { "min": 2, "max": 14, "typical": 6 },
    "transmission_mode": ["Direct contact", "Contaminated feed (especially swill/kitchen waste)", "Fomites and vehicles"],
    "severity": "High",
    "mortality_characteristics": { "adult_mortality_rate_pct": 50, "young_mortality_rate_pct": 90, "note": "Acute form near-100% fatal in piglets" },
    "geographic_prevalence": ["Assam", "Nagaland", "Mizoram", "Bihar", "West Bengal"],
    "seasonality": { "peak_months": ["October", "November", "December"], "note": "Rises with pig-market activity around festival season" },
    "vaccination": { "vaccine_name": "CSF Lapinized Vaccine", "schedule": "Piglets at 60-90 days, annual booster", "efficacy_pct": 90, "govt_program": "State piggery vaccination schemes" },
    "treatment_supportive_management": ["No specific treatment — supportive care only", "Isolate sick animals", "Antibiotics only for secondary bacterial infection", "Improve feed hygiene (stop swill feeding)"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h)", "reporting_authority": "State Animal Husbandry Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Isolate/cull severely affected animals", "Movement ban on pigs in a 3 km radius", "Ring vaccination of healthy pigs nearby", "Stop swill/kitchen-waste feeding immediately", "Disinfect sties with sodium hydroxide"]
  },
  {
    "id": "hs_007",
    "disease_name": { "en": "Haemorrhagic Septicaemia", "hi": "गलघोंटू", "pa": "ਗਲਘੋਟੂ" },
    "abbreviation": "HS",
    "species_affected": ["Cattle", "Buffalo"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "Sudden high fever (106-107°F)", "weight": 6 }, { "name": "Depression, drooling", "weight": 4 } ],
      "late": [ { "name": "Hot, painful swelling of throat/neck", "weight": 10 }, { "name": "Difficulty breathing, protruding tongue", "weight": 8 }, { "name": "Rapid death (within 24h of onset)", "weight": 9 } ]
    },
    "incubation_period_days": { "min": 1, "max": 5, "typical": 2 },
    "transmission_mode": ["Direct contact", "Contaminated feed/water", "Stress-triggered (transport, overwork, monsoon)"],
    "severity": "Critical",
    "mortality_characteristics": { "adult_mortality_rate_pct": 80, "young_mortality_rate_pct": 60, "note": "Peracute course — often fatal within a day of first signs" },
    "geographic_prevalence": ["Punjab", "Haryana", "Uttar Pradesh", "Bihar", "Odisha"],
    "seasonality": { "peak_months": ["June", "July", "August", "September"], "note": "Classic monsoon disease — stress + humidity trigger outbreaks" },
    "vaccination": { "vaccine_name": "HS Oil Adjuvant Vaccine", "schedule": "Annual, pre-monsoon (May)", "efficacy_pct": 90, "govt_program": "State pre-monsoon vaccination camps" },
    "treatment_supportive_management": ["Early high-dose antibiotics (sulphonamides/oxytetracycline) — must be immediate", "Anti-inflammatory support for throat swelling", "Isolate and reduce handling stress"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Immediate (24h)", "reporting_authority": "State Animal Husbandry Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Isolate herd immediately", "Emergency vaccination of in-contact animals", "Avoid transport/overwork of herd during outbreak", "Safe carcass disposal", "Disinfect water/feed troughs"]
  },
  {
    "id": "ndv_008",
    "disease_name": { "en": "Newcastle Disease (Ranikhet)", "hi": "रानीखेत रोग", "pa": "ਰਾਣੀਖੇਤ ਬਿਮਾਰੀ" },
    "abbreviation": "ND",
    "species_affected": ["Poultry"],
    "zoonotic": false,
    "symptoms": {
      "early": [ { "name": "Sudden drop in feed/egg production", "weight": 4 }, { "name": "Respiratory gasping/coughing", "weight": 5 } ],
      "late": [ { "name": "Twisted neck / neurological signs", "weight": 9 }, { "name": "Greenish diarrhoea", "weight": 7 }, { "name": "High sudden flock mortality", "weight": 8 } ]
    },
    "incubation_period_days": { "min": 2, "max": 15, "typical": 5 },
    "transmission_mode": ["Direct contact", "Airborne", "Contaminated feed/water/equipment"],
    "severity": "High",
    "mortality_characteristics": { "adult_mortality_rate_pct": 50, "young_mortality_rate_pct": 90, "note": "Velogenic strains can wipe out unvaccinated flocks within days" },
    "geographic_prevalence": ["Tamil Nadu", "Andhra Pradesh", "West Bengal", "Punjab"],
    "seasonality": { "peak_months": ["October", "November", "March", "April"], "note": "Seasonal transition months (temperature stress on flocks)" },
    "vaccination": { "vaccine_name": "ND Lasota / R2B Vaccine", "schedule": "Day 7 and Day 28, then every 3 months", "efficacy_pct": 90, "govt_program": "State poultry extension vaccination schemes" },
    "treatment_supportive_management": ["No antiviral treatment — supportive care only", "Vitamin/electrolyte supplementation", "Isolate sick birds, cull severely affected"],
    "reporting_urgency": { "notifiable": true, "urgency_level": "Within 72h", "reporting_authority": "State Animal Husbandry / Poultry Dept", "legal_basis": "Prevention & Control of Infectious & Contagious Diseases in Animals Act, 2009" },
    "recommended_containment_action": ["Isolate and cull severely affected birds", "Emergency vaccination of remaining flock", "Disinfect coops and equipment", "Restrict sale/movement of birds from the farm for 30 days"]
  }
]
```
### 8.9 `reports.json` — individual symptom reports (the clustering substrate)

Generate **50–100 synthetic reports**. This is the raw material the Outbreak Radar clusters, so its shape decides whether the demo works.

Record shape:

```json
{
  "report_id": "R001",
  "timestamp": "2026-09-08T10:30:00+05:30",
  "latitude": 30.4841,
  "longitude": 76.5940,
  "village": "Rajpura",
  "village_id": "V01",
  "district": "Patiala",
  "species": "cattle",
  "animals_affected": 8,
  "deaths": 1,
  "symptoms": ["fever", "mouth_lesions", "excessive_salivation"],
  "herd_id": "H001",
  "animal_id": "MH-COW-00421",
  "farmer_id": "FR001",
  "source": "mobile | ivr | field_officer | offline_sync",
  "reporter_role": "Farmer | ParaVet | VetOfficer",
  "location_source": "registered_profile | farmer_voice_input | gps | field_worker_verified",
  "gps_accuracy_m": 12,
  "created_at": "2026-09-08T10:30:00+05:30"
}
```

The set **must** contain, so the engines have something real to find:
- **one strong cluster** — ≥8 reports, 4 villages, within ~10 km and ~52 hours, highly similar symptoms, rising counts (day 1 → 8 affected, day 2 → 15, day 3 → 31), and ≥5 cumulative deaths. Anchor it at Rajpura/Ghanaur/Bhadson/Nabha.
- **one weaker cluster** — 3–4 reports, lower similarity, no deaths, flat growth. Anchor near Malerkotla.
- **isolated / noise reports** scattered singly.
- **distant reports** well outside any cluster radius.
- **unrelated symptom profiles** (respiratory-only, diarrhoea-only) inside the cluster radius, to prove symptom similarity actually discriminates.
- **older reports** outside the 72-hour active window, to prove temporal filtering works.
- **mixed species and severities**.
- **two near-duplicate reports** (same herd, same symptoms, timestamps ~4 minutes apart) so the data-quality module has a duplicate to catch.
- **two incomplete reports** (missing species or missing symptoms) so "Data quality: Moderate" is reachable.

Symptom vocabulary is a fixed machine-readable list (`fever`, `mouth_lesions`, `excessive_salivation`, `skin_nodules`, `lameness`, `nasal_discharge`, `diarrhoea`, `reduced_appetite`, `swelling`, `coughing`, `sudden_death`, `bloody_discharge`, `swollen_lymph_nodes`, `drop_in_milk_yield`, `neurological_signs`) mapped to display names per locale, and mapped to the knowledge-base symptom names for F1.

### 8.10 `herds.json`

~60 herds:

```json
{ "herd_id": "H001", "village_id": "V01", "farmer_id": "FR001", "species": "cattle",
  "animal_count": 45, "vaccinated_count": 14, "vaccination_coverage": 32,
  "last_vaccination_date": "2025-11-02" }
```

Vaccination coverage is **supporting context only** for cluster priority — never the dominant driver.

The Rajpura 5 km catchment must contain **50 herds totalling 500 cattle with 290 vaccinated (58% coverage)** so the deterministic scenario in F5 resolves as specified.

### 8.11 `facilities.json` — 30–50 facilities

```json
{
  "facility_id": "F001",
  "name": "Government Veterinary Hospital, Rajpura",
  "type": "veterinary_facility | diagnostic_laboratory | vaccination_centre | emergency_veterinary_service",
  "latitude": 30.4850, "longitude": 76.5900,
  "village": "Rajpura", "district": "Patiala", "state": "Punjab",
  "phone": "+91XXXXXXXXXX",
  "services": ["veterinary_assessment", "sample_collection", "emergency_support"],
  "diagnostic_capabilities": [],
  "availability": "available | unavailable | closed | unknown",
  "cold_chain": true,
  "capacity": "High | Medium | Low"
}
```

Permitted services: `veterinary_assessment`, `sample_collection`, `diagnostic_testing`, `vaccination`, `emergency_support`, `animal_health_consultation`.

The set must include: nearby and distant facilities; all four types; multiple villages and districts; **unavailable and `unknown`-availability** facilities; facilities with empty `diagnostic_capabilities`; and at least one scenario where **the closest facility is the wrong one** (a vet clinic at ~3 km with no diagnostic testing versus a laboratory at ~8 km with it) so the ranking rule in F7 visibly beats naive distance. Include a diagnostic laboratory roughly 17–18 km from Rajpura and none inside 25 km of Bathinda's villages, so the radius-expansion path is reachable.

Fold the 6 records from `vet_infrastructure.json` (§8.5) into this set as `veterinary_facility` entries, preserving their `cold_chain` and `capacity` fields; keep the separate file too, since the map layer toggles on it.

Never infer a service from a facility's name.

### 8.12 Animal health records

`animals.json` — 20–30 animals across cattle, buffalo, goat, sheep, pig, poultry, multiple farms and herds:

```json
{ "animal_id": "MH-COW-00421", "species": "cattle", "breed": "crossbred", "sex": "female",
  "date_of_birth": "2022-05-14", "farm_id": "FARM001", "herd_id": "H001",
  "owner_farmer_id": "FR001", "status": "active",
  "created_by": "field_officer", "created_at": "...", "updated_by": "...", "updated_at": "..." }
```

Age is **derived** from `date_of_birth` against the frozen clock, never stored.

Companion files, each with a `source` field of `farmer | veterinary_officer | laboratory | surveillance_engine` and full audit fields:

- `vaccinations.json` — `{ vaccination_id, animal_id, vaccine, date_administered, dose, administered_by, next_due_date (nullable), status }`
- `health_events.json` — `{ illness_id, animal_id, reported_date, condition_recorded, confirmation_status: "suspected" | "confirmed", status: "active" | "resolved", source, notes }`
- `veterinary_visits.json` — `{ visit_id, animal_id, visit_date, facility_id, veterinarian, reason, outcome, notes }`
- `surveillance_assessments.json` — `{ assessment_id, animal_id, report_id, timestamp, risk_score, severity_level, risk_level, source: "surveillance_engine", status: "pending_veterinary_confirmation" }`
- `diagnostic_records.json` — `{ record_id, animal_id, sample_date, sample_type, laboratory, test_name, status: "pending" | "completed", result (nullable), result_date (nullable) }`

The hero animal **MH-COW-00421** must resolve to: FMD vaccination Jan 2026; HS vaccination Mar 2026; a *resolved* LSD illness Aug 2025; a veterinary visit 05/09/2026; an active high-priority surveillance assessment dated 08/09/2026; current status **veterinary consultation pending**. Every one of those is a stored record — the passport reads them, it does not invent them. Its assessment `risk_score` is the value the F3 engine actually computes for its linked report, not the literal 87.

Some animals must have **no** vaccinations, **no** illness history and **no** visits, so the `Not recorded` path is demonstrable.

### 8.13 Appointments

`appointment_slots.json` — 50–100 slots across **5–10 facilities**, multiple veterinarians and **4+ consecutive dates from 2026-09-09**:

```json
{ "slot_id": "S001", "facility_id": "F001", "veterinarian_id": "VET01",
  "date": "2026-09-10", "start_time": "10:30", "end_time": "10:50", "status": "available" }
```

Statuses across the set: `available`, `booked`, `blocked`, `cancelled`. Include at least one date with **zero** available slots at a facility, so the empty state is reachable. Facility F001 on 2026-09-10 should expose 10:30 ✓, 11:15 ✓, 12:00 ✗ (booked), 14:30 ✓ — this is the rehearsed flow.

`appointments.json` — several pre-existing appointments in `completed`, `cancelled` and `booked` states, so appointment history is not empty on first load.

### 8.14 People

`farmers.json`:

```json
{ "farmer_id": "FR001", "full_name": "...", "phone_number": "+91XXXXXXXXXX",
  "preferred_language": "pa", "village_id": "V01", "village_name": "Rajpura",
  "taluka": "Rajpura", "district": "Patiala",
  "pwa_push_subscription": { "endpoint": "...", "keys": {} } }
```

Phone numbers are the IVR's primary identifier, so at least one farmer must be reachable by the number the IVR simulator dials by default, and at least one dialled number must resolve to **no** registered farmer, to exercise the unregistered path.

`vets.json`: `{ veterinarian_id, name, facility_id, designation }`.

### 8.15 `historical_baseline.json`

Per district (and per district × disease where useful): `{ district, disease, avg_reports_per_week, sample_period }`. Set Patiala's FMD baseline near **2 reports/week** so the seeded current activity resolves to roughly **5× baseline** — computed, not typed.

### 8.16 `notification_templates.ts`

An **immutable, frozen** registry object (`Object.freeze`, `as const`). Structure mirrors the relational model it replaces:

```ts
type TemplateCategory = 'OUTBREAK_EPIDEMIC' | 'APPOINTMENT_LIFECYCLE' | 'RING_VACCINATION' | 'LAB_RESULT';

interface NotificationTemplate {
  template_code: string;            // e.g. 'OUTBREAK_ALERT_V1'
  language_code: 'mr' | 'en' | 'hi' | 'pa' | 'gu';
  category: TemplateCategory;
  title_template: string;
  body_template: string;            // strict {variable} syntax
  ivr_ssml_template: string;        // wrapped for TTS synthesis
  whatsapp_payload_schema: object;  // interactive message + quick replies
}
```

Unique on (`template_code`, `language_code`). The four mandated templates and their verbatim Marathi/English bodies are in F11 (Section 10.11). **No LLM, ever, generates a notification body.** Every dispatched message resolves through this registry.

### 8.17 `ivr_prompts.ts`

Localized prompt strings keyed by IVR **state name** (`LANGUAGE_SELECTION`, `MAIN_MENU`, `SPECIES`, …) for `mr`/`hi`/`en`. Translations live here, business logic lives in the state machine — one state machine, five prompt tables, never a duplicated call flow per language.

### 8.18 `simulation_script.ts`

The scripted arrival sequence used by the "Run live simulation" control. Each step is a **raw report**, not a result:

```
Step 1  Day 1  Rajpura (V01)   → 8 animals affected, 1 death
Step 2  Day 2  Ghanaur (V02)   → 6 animals affected, 1 death
Step 3  Day 2  Bhadson (V06)   → 9 animals affected, 2 deaths
Step 4  Day 3  Nabha (V03)     → 12 animals affected, 3 deaths
```

The expected observable outcome — Normal → Watch → Emerging cluster → High priority — is what the engines must *produce*. Assert it in a test; never hardcode it in the UI.

---

# SECTION 9 — THE SIMULATED API LAYER

### 9.1 Client behaviour

`services/api/client.ts` exposes a single `request<T>(endpoint, method, payload)` helper that every API module uses. It must:

1. **Simulate latency** — random 120–400 ms, configurable; a single `FAST_MODE` flag drops it to ~0 for demos.
2. **Simulate failure** — a dev-panel toggle for injected failures (network error, 409 conflict, 500) so the retry/backoff, conflict and error states in F2 and F8 are demonstrable on demand rather than by luck.
3. **Log every call** — method, endpoint, request body, response, duration, into a ring buffer surfaced at `/dev/api`.
4. **Enforce authorization** — reject reads/writes that the current role or ownership does not permit, returning a 403-shaped error object. Ownership checks live here, not in components.
5. **Return typed responses** with consistent envelopes and HTTP-shaped status codes.

### 9.2 Endpoint surface (implement all of these as functions)

Keep the exact paths — they are the integration contract from the source specs, and the `/dev/api` page renders them as proof of a real architecture.

```
Reports & outbreak radar
  POST /api/reports                          create a report (idempotent, see F2)
  GET  /api/reports                          list/filter
  POST /api/reports/sync                     offline sync, idempotent on local_report_id
  GET  /api/outbreaks/active                 all active clusters with scores + explanations
  GET  /api/outbreaks/{cluster_id}           full cluster detail
  GET  /api/dashboard/summary                officer dashboard summary tiles

Geospatial analytics
  GET  /api/villages                         villages with live riskScore + riskTier
  GET  /api/villages/{id}                    detail incl. 5-component score breakdown
  GET  /api/risk-map                         GeoJSON FeatureCollection of villages + scores
  GET  /api/trends/monthly                   12-month historical series
  GET  /api/digest/sms                       plain-text top-5 high-risk digest
  POST /api/alerts/trigger                   fired when a village crosses into Critical

Weather
  GET  /api/weather/district/{district}       current + window aggregates + context score
  GET  /api/weather/correlation/{district}    disease activity vs weather time series

Triage & knowledge base
  GET  /api/diseases                          lightweight list
  GET  /api/diseases/{id}                     full profile
  GET  /api/diseases/search?q=                keyword search over names + symptoms
  GET  /api/diseases/symptoms                 deduplicated master symptom list
  POST /api/triage/match                      { species, symptoms[], state, month } → ranked differential + escalation flag
  GET  /api/diseases/{id}/advisory?lang=       rendered multilingual advisory
  POST /api/diseases                          admin add/edit
  POST /api/triage/outbreak-risk               deterministic S1–S6 payload for a report

Facilities
  GET  /api/facilities
  GET  /api/facilities/{id}
  GET  /api/facilities/nearby?lat=&lng=&radius=
  GET  /api/facilities/nearest?lat=&lng=&type=
  POST /api/facilities/recommend
  POST /api/facilities/simulate

Appointments
  GET  /api/appointments/slots?facility_id=&date=
  POST /api/appointments
  GET  /api/appointments/{appointmentId}
  GET  /api/appointments/my
  GET  /api/appointments/facility/{facilityId}
  POST /api/appointments/{appointmentId}/cancel
  POST /api/appointments/{appointmentId}/reschedule
  POST /api/appointments/{appointmentId}/complete

Animal passport
  GET  /api/animals/{animalId}
  GET  /api/animals/{animalId}/passport
  GET  /api/animals/{animalId}/vaccinations
  GET  /api/animals/{animalId}/health-events
  GET  /api/animals/{animalId}/veterinary-visits
  GET  /api/animals/{animalId}/assessments
  GET  /api/animals/{animalId}/diagnostics
  GET  /api/animals/{animalId}/timeline
  GET  /api/animals/{animalId}/related-alerts
  POST /api/animals/{animalId}/vaccinations
  POST /api/animals/{animalId}/health-events
  POST /api/animals/{animalId}/veterinary-visits

IVR
  POST /ivr/session/start
  POST /ivr/session/{session_id}/input
  GET  /ivr/session/{session_id}
  POST /ivr/report
  GET  /ivr/report/{report_id}
  GET  /ivr/farmer/{phone}/reports
  POST /ivr/veterinary-request
  POST /ivr/appointment-request
  POST /ivr/image-upload-request
  POST /ivr/assessment
  POST /ivr/sms

Notifications
  POST /api/notifications/outbreak-broadcast
  POST /api/notifications/appointment-confirmed
  GET  /api/notifications/log
```

### 9.3 The event bus — this is what makes the demo feel alive

`services/bus.ts` publishes domain events. Recomputation is **reactive**, never manual:

```
report:created  →  outbreak radar re-clusters
                →  village risk recomputes
                →  weather context re-aggregates
                →  facility recommendations recompute for the affected cluster
                →  data-quality re-evaluates
                →  if any cluster crosses into HIGH/CRITICAL:
                      alerts:candidate emitted → dispatcher offers a broadcast
                →  if the report is linked to an animal:
                      that animal's passport timeline and status update

appointment:booked   → passport status + timeline update; vet queue updates
consultation:completed → passport status + timeline update; slot released/kept per rules
cluster:levelChanged → cluster-evolution history appends a new entry (no duplicate alert)
clock:advanced       → every window-based engine re-runs
```

A single new report must move **at least six** visible things on screen. That ripple is the product.

---

# SECTION 10 — CORE FEATURES

---

## F1 — DISEASE KNOWLEDGE BASE & SYMPTOM-CONFIDENCE ENGINE

The foundation layer every other feature reads from.

### 10.1.1 Knowledge Base Explorer (`/knowledge`)
Searchable, filterable view of all 8 diseases. Filters: species, severity, zoonotic. Keyword search runs across disease names **and** symptom names. Clicking a row expands the full profile: species affected, weighted early/late symptoms, incubation range, transmission modes, severity, mortality characteristics (adult vs young), geographic prevalence, seasonality with peak months, vaccination (vaccine, schedule, efficacy, government programme), supportive management, reporting urgency (notifiable flag, urgency level, authority, legal basis) and recommended containment actions.

Zoonotic diseases (Anthrax, HPAI) carry a distinct oxblood marker and a one-line "can transmit to humans" note wherever they appear across the whole app.

### 10.1.2 Symptom Checker (`/symptom-checker`) — the confidence engine

**Input:** species, multi-select symptoms (checkbox list built from the deduplicated master symptom list derived from the dataset — not a hand-typed list), state, month (defaults to the frozen clock's month).

**Scoring, per disease:**

```
matched_weight    = Σ weights of selected symptoms present in this disease's early+late lists
total_weight      = Σ weights of ALL symptoms listed for this disease
base_score        = (matched_weight / total_weight) × 100
seasonal_bonus    = +10 if current month ∈ disease.seasonality.peak_months else 0
geographic_bonus  = +10 if farmer's state ∈ disease.geographic_prevalence else 0
species_gate      = if species ∉ disease.species_affected → disqualified, score 0, not shown
final_score       = min(100, base_score + seasonal_bonus + geographic_bonus)
```

**Output:** all non-disqualified diseases ranked by `final_score` descending; return the **top 3** as a differential list, each tagged **High confidence (≥70) / Medium (40–69) / Low (<40)**, each with a horizontal confidence bar in the tier colour, each showing which of the selected symptoms matched and at what weight (this is the explainability).

**Auto-escalation rule:** if the top match has `final_score ≥ 70` **and** `reporting_urgency.notifiable === true`, generate a **Suspected Outbreak Alert** object tagged with `zoonotic: true|false`, publish it on the bus toward the radar and alerts modules, and render an escalation banner. Zoonotic escalations additionally show the dual animal-health + public-health path.

**Worked demo case (must resolve without being hardcoded):** species Cattle; symptoms High fever, Blisters on mouth/tongue/gums, Excessive salivation and drooling, Lameness; state Punjab; month August → **FMD at roughly 96%, High confidence**, auto-flagged as a suspected outbreak, with containment actions and Hindi + Punjabi advisories rendered immediately.

### 10.1.3 Multilingual advisory generator
A pure template filler — **no LLM** — that takes any disease object and renders, in each of the five locales:

> "⚠️ [Disease name] suspected in [species]. Key signs: [top 2 late symptoms by weight]. Isolate the animal immediately and contact [reporting_authority]. Do not move animals to markets. [1 line from recommended_containment_action]."

Uses the `disease_name` translations already in the dataset. Zero external calls, fully offline-safe — say this out loud in the pitch.

### 10.1.4 Low-connectivity design note
The whole dataset is one small static JSON file, deliberately bundled into the client so it works with no network and can be shipped to a mobile/IVR client and synced only when new diseases are added. Surface this as a visible note in the Explorer's footer — judges ask about low connectivity.

### 10.1.5 Stretch
Free-text symptom entry with simple keyword matching against the master symptom list; a `+5` weather bonus for vector-borne diseases when district humidity exceeds a threshold; an admin form that adds a 9th disease live to prove extensibility.

---

## F2 — OFFLINE-FIRST FIELD REPORTING

The problem statement's "operate in low-connectivity areas" clause, implemented for real in the browser. This is a PWA-style web client, so **IndexedDB via Dexie** is the local store — never `localStorage` for structured reports.

### 10.2.1 Connectivity service
A reusable service exposing one state to the whole app: **Online / Offline / Syncing / Sync completed / Sync failed**. Derive it from `navigator.onLine` plus a periodic lightweight reachability probe against the mock API (which the dev panel can force to fail) — and expose a manual override toggle so a judge can switch the app offline on stage without touching airplane mode. Do not poll at high frequency.

### 10.2.2 Local store — `pending_reports`
Dexie table with exactly these fields:

```
local_report_id, server_report_id (nullable), animal_id, farmer_id, species,
symptoms, number_of_affected_animals, number_of_deaths, latitude, longitude,
gps_accuracy_m, captured_at, created_at, updated_at,
sync_status, retry_count, last_sync_attempt, sync_error, image_local_ref
```

`sync_status ∈ { pending, syncing, synced, failed, conflict }`.

### 10.2.3 ID generation
Every report gets a collision-resistant ID **immediately on device**, offline: `REPORT-<uuid v4>`. Never derive an ID from a timestamp. Never wait for the server to assign one.

### 10.2.4 Save-first behaviour

```
IF online:   save locally first → attempt sync → mark synced only after server confirmation
IF offline:  save locally → sync_status = "pending" →
             "Report saved on this device. It will be uploaded automatically when internet is available."
```

The user must never lose a report because the network was unavailable. Never delete the local record on send — only mark it synced after a successful response.

### 10.2.5 Sync queue, idempotency, backoff
On reconnect (and on a manual **Sync now** button): fetch all pending reports, upload in **controlled batches**, wait for confirmation per record, mark successes, retain failures for retry.

`POST /api/reports/sync` is **idempotent on `local_report_id`** — the mock backend keeps a set of processed IDs and returns the existing record rather than creating a duplicate. The dev panel must be able to force a double-send so this is demonstrable:

```json
Request  { "local_report_id": "...", "animal_id": "...", "symptoms": [...], "latitude": ..., "longitude": ..., "created_at": "..." }
Response { "success": true, "server_report_id": "...", "local_report_id": "...", "status": "synced" }
```

Retry uses **exponential backoff**: immediate → 5 s → 30 s → 2 min → 10 min. After repeated failure the report stays queued and the UI states plainly: "3 reports are waiting to sync."

### 10.2.6 Conflicts
Server-confirmed records cannot be silently modified: a local edit to a synced report creates an **update record** rather than overwriting. Compare `updated_at` timestamps, preserve audit information, and notify the user explicitly when a conflict occurs, showing both versions and asking which to keep. Never overwrite silently.

### 10.2.7 Images
Store the image itself as a Blob in IndexedDB (not base64 in a key-value string), keep only its reference on the report, and compress before storing — target ~1600px longest edge at ~0.7 JPEG quality, preserving enough detail for veterinary assessment. On sync: upload the image first, verify success, then sync the report that references it. A failed image upload must not lose the report.

### 10.2.8 GPS and timestamps
Capture latitude, longitude, GPS accuracy, timestamp and timezone at creation. If GPS is unavailable, allow submission with location marked **unavailable** — never block the report, never fabricate coordinates. Show the accuracy figure to the user.

### 10.2.9 Sync indicator (always visible in the shell)

```
Online     ✓ Connected · All reports synchronized
Offline    ⚠ Offline · 4 reports stored on this device
Syncing    ↻ Synchronizing 4 reports…
Completed  ✓ All reports synchronized
Failed     ⚠ 3 reports waiting to sync   [Sync now]
```

Design note: this pill lives in the shell in `--sand` with an espresso hairline; only the failed state uses a tier colour. It carries `aria-live="polite"`. The user must always know, truthfully, whether their report reached the server.

### 10.2.10 Security posture (prototype-appropriate, still stated)
No secrets or tokens in plain text; use a token-storage abstraction; keep farmer and animal identifiers out of console logs; re-validate everything at the mock API boundary and treat all client data as untrusted; document that production would require HTTPS, server-side authn/authz and encryption at rest. Say this in the README rather than pretending it is implemented.

### 10.2.11 Performance
Never block the main thread during sync. Batch uploads instead of firing hundreds of requests. Debounce connectivity checks. The UI stays fully interactive while the queue drains.

---

## F3 — SPATIOTEMPORAL OUTBREAK RADAR

The heart of the system: it detects emerging disease clusters from individual reports and produces an **explainable investigation-priority alert** for veterinary authorities.

> **This is not a diagnosis system.** It must never claim a specific disease is confirmed. Its output is surveillance/investigation priority.

### 10.3.1 Clustering
DBSCAN over **haversine** geographic distance, with a temporal constraint. Configurable parameters, exposed in a small "Detection settings" panel so a judge can change them and watch clusters re-form:

- minimum reports: **3**
- maximum distance: **~10 km**
- active time window: **~72 hours**

A report joins an emerging cluster only when it is close enough in **both** space and time. Compute per cluster: report count, affected villages, affected herds, geographic radius, first and latest report time, duration, total affected animals, total deaths.

### 10.3.2 Symptom and severity analysis
Symptom similarity via **Jaccard** (explainable, not a black box). Per cluster: dominant symptoms, symptom frequency distribution, average pairwise symptom similarity. Also: total affected animals, total deaths, mortality rate, and growth in affected animals and reports over the window (e.g. day 1 → 8, day 2 → 15, day 3 → 31). A rapidly growing cluster scores higher.

### 10.3.3 Historical baseline
Compare current activity against `historical_baseline.json` and display the multiplier, e.g. "5.2× above historical baseline". Computed from actual counts against the actual baseline — the multiplier changes when reports arrive.

### 10.3.4 Herd vulnerability
Read herd `animal_count`, `vaccination_coverage`, `last_vaccination_date`. Use vaccination coverage **only as supporting context** for cluster priority.

### 10.3.5 Investigation Priority Score (0–100)

Initial, **configurable** weights:

```
Spatial concentration     30%
Temporal concentration    20%
Symptom similarity        20%
Severity / growth         15%
Historical anomaly        15%
```

Levels: `0–39 NORMAL · 40–69 WATCH · 70–84 HIGH PRIORITY · 85–100 CRITICAL`.

Weights and thresholds live in one config object and are editable in the detection-settings panel. Label the number everywhere as **Investigation Priority — not disease probability.**

### 10.3.6 Explainable alerts
Every cluster explains itself from its own computed metrics. Target shape (values generated, never typed):

```
High priority
Investigation priority: 86/100

4 villages affected · 6 herds · 35 animals · 5 deaths · detected over 52 hours

Why flagged?
✓ Multiple nearby villages affected
✓ Reports concentrated within 52 hours
✓ High symptom similarity
✓ Cases increasing rapidly
✓ 5 deaths reported
✓ Activity 5.2× above historical baseline
```

Each bullet is emitted by `engines/explain.ts` only when its underlying metric crosses its threshold, and carries the number that triggered it. If a metric does not qualify, its bullet does not appear.

### 10.3.7 Outbreak radar map
React + Leaflet. Layers: individual reports, detected clusters, villages, veterinary centres. Clusters render as boundary circles sized to their true computed radius, coloured by tier (moss / ochre / burnt orange / deep rust) and always labelled with the tier name.

Clicking a cluster opens its detail: priority score, risk level, report count, villages, herds, affected animals, deaths, duration, dominant symptoms, historical multiplier, full explanation, weather context (F4), nearby response support (F7) and a **Book veterinary consultation** entry point (F8).

### 10.3.8 Cluster evolution
Track how an existing cluster changes as reports arrive:

```
09:00 → 45 Watch
13:00 → 61 Watch
18:00 → 76 High priority
next day → 88 Critical
```

Show score and level transitions plus newly affected villages. **Never emit a duplicate alert for the same evolving cluster** — update the existing one and append to its evolution history. Cluster identity must survive the addition of new reports (match on overlapping membership, not on array index).

### 10.3.9 Live simulation
A **Run live simulation** control (plus Step and Reset) that feeds `simulation_script.ts` reports in sequentially. Every new report triggers a full recalculation through the engines. The frontend never fakes a score or a cluster state — it renders whatever the engines return after each step. Expected observable arc: Normal → Watch → Emerging cluster → High priority.

### 10.3.10 Data quality and duplicates
Flag obvious duplicate reports (same herd + same symptom set + timestamps within a short window), handle missing optional fields, and distinguish incomplete from reliable reports. Show **Data quality: High / Moderate / Low** as a separate indicator, never folded into the priority score. Let veterinary users open the list of underlying reports supporting any cluster, including the ones flagged as duplicates or incomplete, with the reason shown.

---

## F4 — WEATHER & ENVIRONMENTAL CONTEXT LAYER

Weather is **contextual evidence**, never a cause. Its job is to answer "what environmental conditions are present in an area where disease activity is changing?" — not "did the weather cause the disease?"

### 10.4.1 Indicators and thresholds
Configurable, not hardcoded per district:

```
Rainfall     LOW < 10 mm · MODERATE 10–30 mm · HIGH > 30 mm
Humidity     LOW < 50%  · MODERATE 50–75%   · HIGH > 75%
Temperature  configurable low/moderate/high bands
```

### 10.4.2 Temporal alignment
Analyse a window, not a single day: rainfall total over the previous 3–7 days, average humidity and temperature over the same window, and disease reports over that same window compared with the historical baseline. Example target output (computed): previous 7 days — rainfall 145 mm, average humidity 84%, disease reports 14 against a historical average of 3 → activity 4.7× baseline.

### 10.4.3 Weather Context Score (0–100)
A **separate** score, never a disease probability. Components (configurable weighting): rainfall anomaly, humidity level, temperature conditions, recent weather persistence. Combine with outbreak intelligence so that weather **supports** the disease signal rather than dominating it — a HIGH weather context alone must never push a cluster into HIGH priority.

### 10.4.4 Causality rule (hard)
Never render "heavy rainfall caused the outbreak" or "high humidity caused the disease". Use only:
- "Current environmental conditions coincide with elevated disease activity."
- "Recent rainfall and humidity levels provide additional contextual evidence for increased surveillance."
- "Environmental conditions are associated with increased surveillance relevance."

Put these three strings in the i18n files so they cannot drift, and forbid free-form causal copy anywhere near weather.

### 10.4.5 Dashboard panel
Attached to the selected cluster/district:

```
Patiala
Disease activity  ↑ 4.2× baseline
Rainfall          High · 48.5 mm
Temperature       Moderate · 29.4 °C
Humidity          High · 86%
Weather context   78/100
⚠ Conditions coincide with elevated disease activity.
Recommended: maintain increased surveillance.
```

### 10.4.6 Map layer
Toggles: **Disease reports · Outbreak clusters · Weather context**. Render weather as district overlays / intensity shading. Where a high-priority cluster overlaps unusual conditions, highlight the area as **"Environmental context: elevated"** — never as "weather-caused outbreak".

### 10.4.7 Correlation view
A small Recharts chart plotting disease activity alongside rainfall and humidity over time, so an officer can visually inspect whether they move together. Caption it explicitly as observation, not causation.

### 10.4.8 Module boundary
All of this lives in `engines/weatherContext.ts`, exposing: weather indicators, weather anomalies, contextual weather score, district-level weather context. The pipeline becomes:

```
Reports → spatial clustering → temporal clustering → symptom similarity → severity
        → historical baseline → herd vulnerability → weather context
        → explainable investigation priority → surveillance alert
```

---

## F5 — DETERMINISTIC TRIAGE ENGINE & DIFFERENTIAL DIAGNOSIS

A second, **strictly deterministic** scoring path used when an officer opens a single report's triage view (`/triage/:reportId`). No LLM touches this calculation. It exists to prove the system can produce an auditable, reproducible number with a fixed point matrix.

### 10.5.1 The point matrix (total max 100)

Let `C_t` be the target report's coordinate. Evaluate all data within a **5,000 m radius** of `C_t` using haversine distance (the browser equivalent of a spheroidal `ST_DWithin`).

```
S1  Spatial density        max 25   25 if active suspected cases within 5 km ≥ 10, else (cases / 10) × 25
S2  Temporal velocity      max 20   growth over 72 h; 20 if growth_rate ≥ 3.0, else (growth_rate / 3.0) × 20
S3  Herd vulnerability     max 21   (1 − vaccinated_head / total_head) × 50, capped at 21
S4  Mortality impact       max 10   10 if reported deaths within 5 km > 0, else 0
S5  Historical precedence  max  5   5 if a historical outbreak of the same pathogen occurred within 10 km in the last 24 months
S6  Vector favourability   max  5   5 if the environmental index for the region is favourable, else 0
```

### 10.5.2 Differential diagnosis — weighted pathogen overlap
Pathogen vectors (extend with the full F1 knowledge base, but these two must exist exactly):

```
LSD (Lumpy Skin Disease)  { nodular_skin_lesions: 0.40, high_fever: 0.20, enlarged_lymph_nodes: 0.25, nasal_discharge: 0.15 }  zoonotic: false
Anthrax                   { uncoagulated_blood_discharge: 0.45, sudden_high_fever: 0.30, rapid_death: 0.25 }                    zoonotic: true
```

Compute weighted overlap (Jaccard-style) between the report's observed symptoms and each pathogen vector, rank, and express as percentage confidence.

### 10.5.3 The guaranteed scenario (seeded, still computed)
Seed a scenario that **produces** 86/100 rather than declaring it. Re-anchored from Ahmednagar to **Rajpura (30.4841, 76.5940)** per Section 5.1, preserving every quantity:

- 50 herds within 5 km · 500 cattle total · 290 vaccinated (58% coverage)
- 11 LSD symptom reports: 2 from five days ago, 9 within the last 72 hours (growth ≈ 4.5×)
- exactly 2 reports with `mortality_count = 1`
- 1 historical LSD outbreak 2.8 km away, 14 months ago
- environmental index for the region set to vector-favourable

Write a unit test asserting the engine returns 86 for this seed. If your arithmetic lands elsewhere, fix the seed data, never the display.

### 10.5.4 Strict payload contract
`POST /api/triage/outbreak-risk` returns exactly this structure, every value populated dynamically:

```json
{
  "triage_metadata": {
    "risk_score_display": "HIGH RISK — 86/100",
    "quarantine_cordon_radius_km": 3.0,
    "surveillance_buffer_radius_km": 10.0
  },
  "clinical_assessment": {
    "primary_suspected_disease": "Lumpy Skin Disease (LSD)",
    "zoonotic_threat_level": "NONE",
    "differential_diagnosis": [
      { "disease": "Lumpy Skin Disease (LSD)", "pathogen_overlap_confidence": "85.0%" },
      { "disease": "Foot-and-Mouth Disease (FMD)", "pathogen_overlap_confidence": "10.0%" }
    ]
  },
  "explainable_ai_reasons": [
    "✓ 11 suspected cases within 5 km",
    "✓ Cases increased 4.5x in last 72 hours",
    "✓ Vaccination coverage only 58.0%",
    "✓ 2 reported deaths",
    "✓ Similar outbreaks occurred historically in this quadrant",
    "✓ Environmental conditions are favorable for vector transmission"
  ],
  "recommended_containment_sop": "MAH-LSD-LVL3"
}
```

Every string in `explainable_ai_reasons` is assembled from the computed S1–S6 inputs. `zoonotic_threat_level` derives from the top suspected pathogen's zoonotic flag (`NONE` / `ELEVATED`), and when it is elevated the UI must surface the dual animal-health + public-health escalation path. `primary_suspected_disease` is always rendered in the UI as **suspected**, never confirmed.

### 10.5.5 UI
The triage view renders the payload as: a ScoreDial labelled "Outbreak risk", the S1–S6 breakdown as a Recharts horizontal bar chart (this is the explainability judges ask for), the differential list with confidence bars, the two containment radii drawn on a small inset Leaflet map, the evidence bullets, and the recommended containment SOP code linked to the matching knowledge-base containment actions.
---

## F6 — GEOSPATIAL MAPPING & ANALYTICS COMMAND CENTRE

The visual command centre: where risk is happening, why, and what could happen next.

### 10.6.1 Interactive outbreak map (`/map`)
Punjab, centred `[30.35, 76.1]`, zoom 8, OpenStreetMap tiles. Markers per report: **icon = species** (cattle, goat, poultry, generic), **colour = risk tier**. Marker clustering when zoomed out. Clicking a marker opens a right-side drawer: village info → active reports → **risk breakdown chart** → generate-advisory action → nearest veterinary facility and distance.

Toggleable layers: **Outbreak points · Risk heatmap · Vaccination coverage · Livestock markets & trade routes · Vet infrastructure · Weather context**.

### 10.6.2 Village Risk Score — `computeRiskScore(village, reports, weather)`
A pure, testable function. Score 0–100:

```
RiskScore = 0.35 × CaseDensityScore
          + 0.25 × WeatherSuitabilityScore
          + 0.15 × SeasonalHistoricalScore
          + 0.15 × ProximityScore
          + 0.10 × VaccinationGapScore
```

- **CaseDensityScore** = `min(100, (activeCases / (herdPopulation / 1000)) × 10)`; active = suspected + confirmed, excluding contained.
- **WeatherSuitabilityScore** — see the sensitivity table below.
- **SeasonalHistoricalScore** = the current month's historical case count for the village's dominant reported disease, normalised against that disease's 12-month maximum → 0–100.
- **ProximityScore** = `100 × e^(−nearestConfirmedOutbreakDistanceKm / 10)`, and 0 if there is no confirmed outbreak within 50 km.
- **VaccinationGapScore** = `100 − vaccinationCoverage`.

Tiers: **0–30 Low · 31–60 Moderate · 61–80 High · 81–100 Critical**, rendered in the earthy tier palette from Section 6.1 (not the raw web hexes) and always with the tier word.

**Disease weather-sensitivity table (drives WeatherSuitabilityScore):**

| Disease | Ideal temp °C | Ideal humidity % | Note |
|---|---|---|---|
| FMD | 25–35 | 70–90 | thrives in humid monsoon conditions |
| LSD | 28–36 | 65–90 | vector (fly/mosquito) borne, warm + humid |
| HS | 26–34 | 75–95 | linked to waterlogging / monsoon |
| PPR | 5–20 | 20–50 | spreads in dry, cool winter conditions |
| AvianFlu | 5–18 | 30–60 | risk rises with migratory bird winter season |
| Anthrax | any | any | soil-borne; constant moderate risk (50) unless rainfall > 30 mm in 7 days, then 80 |

Scoring: both temp and humidity inside the ideal range → 90–100; one inside → 55–70; neither → 15–30.

### 10.6.3 Explainable risk breakdown
Clicking a village opens a Recharts radar or horizontal bar chart of the **five weighted components** of its score, each with its raw input value beside it. Government users need to trust *why* a village is flagged. This is cheap to build and disproportionately convincing.

### 10.6.4 Historical trends & time-travel slider
A timeline slider covering the **last 90 days**, plus the 12-month seasonal area chart:
- Dragging the slider replays how outbreak points appeared and spread, animating marker fade-in by report date.
- A **seasonal forecast band** projects, from the 12-month curve, which disease is statistically likely to rise in the **next 30 days** per district even with zero current reports. Render statements like: "PPR historically rises sharply from October — recommend pre-emptive vaccination in goat- and sheep-dense villages." Label it clearly as a historical projection, not a prediction of confirmed outbreaks.

### 10.6.5 Contagion radius simulator
For any **confirmed** outbreak, draw concentric buffer rings at **5 / 10 / 20 km** (Leaflet circles, haversine distances) and list every village inside each ring with its distance and current risk tier.

Projection, for animation only and labelled explicitly as an illustrative projection rather than a certified epidemiological model:

```
ProjectedCases(day t) = min(SusceptiblePopulation, currentCases × R0^(t / serialIntervalDays))
```

Illustrative parameters: FMD R0 = 4 / 4 days · LSD R0 = 2.5 / 7 days · PPR R0 = 5 / 5 days · AvianFlu R0 = 3 / 3 days · HS R0 = 2 / 5 days. A **Day 0 → Day 7** slider grows the danger zone visually.

### 10.6.6 Livestock trade-route / market overlay
Disease travels through **mandis**, not only across fields. Render markets as nodes connected to the villages that trade through them. If a market lies within 10 km of a confirmed outbreak, every village connected to that market receives a **"Market-linked risk"** flag and a flat **+15** on its risk score (capped at 100) — even when it sits far outside the 20 km geographic buffer. Nabha is the demo case: 25 km away, outside every ring, still flagged because it trades through the Rajpura Mandi.

### 10.6.7 One-Health / zoonotic spillover flag
Anthrax and Avian Influenza auto-tag with a distinct oxblood biohazard marker and a banner: *"Zoonotic risk — recommend notifying the District Health Department."* Anywhere a zoonotic disease appears — map, cluster, passport, advisory, IVR, SMS — that dual-notification path must be visible.

### 10.6.8 Officer dashboard
Summary tiles: **Active outbreaks · Districts at high/critical risk · Estimated animals at risk · Average vaccination coverage gap · Live zoonotic alerts**. Below: the 12-month seasonal trend chart and a sortable village risk table (village, district, score, tier, dominant disease, vaccination coverage, market-linked flag).

### 10.6.9 Low-connectivity SMS/IVR digest
A **Generate SMS digest** action converting the current top-5 highest-risk villages into an ultra-short plain-text string, e.g.:

`HIGH RISK: Rajpura(FMD,82), Ghanaur(FMD,76), ...`

Show the character count against a 160-character SMS limit. This is what would actually be pushed to field vets in low-connectivity blocks — and it hands straight off to F11's SMS driver.

---

## F7 — LIVESTOCK HEALTH RESPONSE & FACILITY FINDER

Connects a concerning report or surveillance alert to the nearest **relevant** veterinary, diagnostic, vaccination and emergency services.

> **Boundary:** this is early warning and decision support. It never confirms a diagnosis, never confirms an outbreak, never claims an unverified diagnostic capability, never invents facility information, contact details, opening hours or appointments, and never gives disease-specific treatment instructions.

### 10.7.1 Core objective
From a report or cluster coordinate, identify the nearest: **veterinary facility · diagnostic laboratory · vaccination centre · emergency veterinary service** — considering geographic distance, facility type, required service capability, availability when known, and explicitly-recorded diagnostic capabilities.

### 10.7.2 Distance
**Haversine only.** Never raw Euclidean distance on lat/lng. Return kilometres, rounded for display, exact internally.

```
Report → lat/lng → facility dataset → haversine distance → filter suitable
       → rank → nearest suitable facility
```

### 10.7.3 Search radius
Configurable, starting at **25 km**, expanding **25 → 50 → 100 km** only when nothing suitable is found. State the expansion honestly:

```
No suitable diagnostic laboratory was found within 25 km.
Nearest available laboratory: 42.7 km away.
```

Never fabricate a result to fill the slot.

### 10.7.4 Filtering
Per requirement: prefer matching `type` **and** the required service (`veterinary_assessment`, `diagnostic_testing`, `vaccination`, `emergency_support` respectively). Only show specific diagnostic capabilities when they are explicitly present in the record. Distinguish three outcomes everywhere: **FOUND · NOT_FOUND · UNKNOWN**.

### 10.7.5 Ranking — not distance alone
Rank strictly in this order: **1) correct facility type → 2) required service capability → 3) availability → 4) geographic distance.**

The canonical demonstration: Facility A at 3 km without diagnostic testing loses to Facility B at 8 km with it, when the requirement is diagnostic. Show this happening on screen; the ranking must be explainable, and the explanation is generated from the facility's own fields.

### 10.7.6 High-priority response support
When a cluster's risk level is HIGH or CRITICAL, generate the nearby response support block — all four distances computed live:

```
Surveillance alert
Investigation priority: 86/100

Nearby response support
Nearest veterinary facility        4.2 km
Nearest diagnostic laboratory     17.6 km
Nearest vaccination centre         6.8 km
Nearest emergency service          8.1 km
```

### 10.7.7 Diagnostic laboratory support
Do not stop at clinics. For high-priority cases, give the nearest suitable laboratory prominence: name, distance, location, phone, services, diagnostic capabilities, availability, with **Call laboratory** and **Get directions** actions. When capabilities are absent from the record, display **"Diagnostic capability: Unknown"** and recommend contacting the laboratory about appropriate sample submission — never guarantee that a specific test is available.

### 10.7.8 Explainable recommendation
Every recommended facility explains itself from actual fields and computed metrics:

```
Recommended veterinary facility
Government Veterinary Hospital, Rajpura

Why recommended?
✓ Suitable veterinary facility
✓ Veterinary assessment available
✓ Sample collection available
✓ Currently available
✓ Closest suitable facility
✓ Located 4.2 km from the reported location
```

### 10.7.9 Recommended action
Generated dynamically from surveillance priority, risk level, available facility types, capabilities, availability and proximity. For a high-priority case:

```
1. Contact the nearest veterinary facility.
2. Arrange veterinary assessment.
3. Follow veterinary guidance regarding sample collection.
4. Contact the diagnostic laboratory regarding sample submission.
5. Follow official animal-health instructions.
```

No disease-specific treatment instructions, ever.

### 10.7.10 Unknown and missing data
Never convert missing information into a false value. `Availability: Unknown`, `Diagnostic capability: Unknown`, `Contact information unavailable`, `No suitable diagnostic laboratory found within 25 km`, `Showing the nearest suitable facility within 50 km`. Route all of these through the shared `UnknownValue` component.

### 10.7.11 Radar integration
The Facility Finder **consumes** radar output and never diagnoses independently. It accepts:

```json
{ "cluster_id": "CL001", "risk_level": "HIGH", "investigation_priority": 86, "reports": 4,
  "villages": 4, "herds": 6, "animals_affected": 35, "deaths": 5, "duration_hours": 52,
  "dominant_symptoms": ["fever","mouth_lesions","excessive_salivation"],
  "latitude": 30.4841, "longitude": 76.5940 }
```

Full chain: reports → clustering → temporal detection → symptom similarity → severity → baseline → investigation priority → risk level → surveillance alert → **facility finder** → nearest vet / lab / vaccination centre / emergency service → recommended next action.

### 10.7.12 Map and alert card
Leaflet map with distinct markers per entity type (report/cluster, veterinary facility, diagnostic laboratory, vaccination centre, emergency service — rendered as the lucide icons from Section 6.8). Marker click shows name, type, distance, services, availability, contact, with **Get directions** (opens coordinates) and **Call** (only when a phone number exists).

A farmer-friendly **high-priority alert card** presents the same content in the Section 6 visual language: the cluster's score in a ScoreDial, four response-support rows with icons, the recommended action, and a **View on map** action. Every value dynamic.

### 10.7.13 Simulation
**Run live simulation** and **Simulate new report** controls. Each new report recalculates cluster/report location, all four facility distances, rankings, availability, recommended action and explanations. Sequence: Village A (8 affected, 1 death) → Normal · Village B (6, 1) → Watch · Village C (9, 2) → Emerging cluster, facility finder activates · Village D (12, 3) → High priority, facility results recalculated.

### 10.7.14 Multilingual
All farmer-facing content in English, Hindi, Gujarati and Punjabi (plus Marathi in this build): alert messages, facility types, service labels, recommendations, explanations, action steps, availability labels, empty and error states, map labels. Internal values stay language-independent (`diagnostic_laboratory` → "Nearest diagnostic laboratory" / "निकटतम नैदानिक प्रयोगशाला" / "નજીકની નિદાન પ્રયોગશાળા" / "ਨਜ਼ਦੀਕੀ ਡਾਇਗਨੋਸਟਿਕ ਲੈਬੋਰੇਟਰੀ"). Facility names are never translated.

---

## F8 — VETERINARY APPOINTMENT BOOKING

Converts a surveillance recommendation into an actual scheduled consultation. A booking and workflow system — never a diagnosis or treatment system.

### 10.8.1 Flow

```
Surveillance detects elevated concern → "Veterinary consultation recommended"
→ Facility Finder returns suitable facilities → farmer selects facility
→ available slots → farmer selects date + time → confirm → booked
→ Disease Passport updated → authorized veterinarian sees the history
```

### 10.8.2 Entry points (one shared booking service behind all three)
From the **Outbreak Radar** alert ("Book veterinary consultation"), from the **Facility Finder** ("View available slots"), and from the **Disease Passport** ("Book veterinary appointment").

### 10.8.3 Facility selection
The list comes from the **Facility Finder service** — the booking module must not re-implement facility search or ranking. It receives and uses `facility_id`, name, `distance_km`, type, services, availability.

### 10.8.4 Slots UI
Date strip (4+ dates), then slots for the selected date with clear states: **AVAILABLE · BOOKED · UNAVAILABLE · CANCELLED · UNKNOWN**. Unavailable slots are visible but not selectable and are never presented as available. Empty state: "No available appointments on this date. [Choose another date]".

Label synthetic availability honestly in the prototype: a small persistent note that slot data is demonstration data, not a live scheduling system.

### 10.8.5 Confirmation summary
Before booking, show animal, species, reason, facility, distance, date, time — and require an explicit **Confirm appointment**. Pre-populate the reason when the booking originates from an alert: *"Veterinary assessment following surveillance alert"*, with an optional free-text notes field. Never convert symptoms into a diagnosis in the reason.

### 10.8.6 Booking creation (the transaction, simulated faithfully)
On confirm, the mock API must, in order: validate the animal → validate farmer ownership → validate the facility → validate the slot → **re-check the slot is still available** → create the appointment → mark the slot booked → associate it with animal and farmer → attach `related_report_id` / `related_cluster_id` when present → update the passport status → return confirmation.

Because there is no database, implement this as a **single synchronous store action** that re-reads slot status inside the action immediately before mutating. Provide a dev-panel control that books a slot "from another user" mid-flow so the conflict is demonstrable:

```
This appointment slot is no longer available.  [Choose another slot]
```

Never rely on frontend disabling alone. Front-end optimism must not survive a failed re-check.

### 10.8.7 Appointment record

```
appointment_id, animal_id, farmer_id, facility_id, veterinarian_id, slot_id,
related_report_id, related_cluster_id, appointment_date, start_time, end_time,
reason, farmer_notes, status, created_at, updated_at
```

Status: `booked · confirmed · completed · cancelled · no_show · rescheduled`. IDs generated as `APT-2026-0001XX`.

### 10.8.8 Confirmation screen
Appointment ID, animal, facility, date, time, status, reason, with **View appointment**, **View disease passport**, **Get directions**.

### 10.8.9 Veterinarian view (`/vet/appointments`)
Today's queue: time, animal ID, species, reason, and a related-surveillance-alert marker where applicable. Opening one shows appointment details, the related alert (cluster, investigation priority — read from the radar, never recalculated here), **View disease passport** and **Start consultation**.

### 10.8.10 Pre-visit health summary
Assembled from the passport: animal, age, vaccinations, previous illness, last visit, current surveillance assessment with its risk level, surveillance risk score, severity, current status — closed with the mandatory line:

> ⚠ Surveillance information is not a confirmed diagnosis.

### 10.8.11 Consultation completion
The veterinarian records visit outcome, observations, assessment status, follow-up required, sample collection and diagnostic referral, and may schedule a next appointment. **Do not force the veterinarian to select a disease diagnosis** — a free "assessment status" and notes must be sufficient. On completion, update the passport status and timeline without overwriting the underlying surveillance assessment.

### 10.8.12 Reschedule and cancel
Reschedule: select new date → new slot → confirm; release the original slot only after the new one is reserved; set `status = rescheduled` and preserve history. Cancel: confirm dialog → status `cancelled` → release the slot → **never delete the record**.

### 10.8.13 Appointment history
Farmers see their own past and upcoming appointments with statuses. Veterinarians see those relevant to their facility.

### 10.8.14 Errors
Slot already booked · facility unavailable · no slots for this date · network failure ("We couldn't complete the booking. Please try again.") · invalid animal ("Animal record could not be found.") · unauthorized access (403-shaped error). Errors state what happened and what to do next; they do not apologise or go vague.

### 10.8.15 Boundary reminder
The Radar detects patterns · the Passport holds individual history · the Facility Finder locates support · Booking schedules · the veterinarian assesses. **No module duplicates another's logic.** Do not recalculate the outbreak score inside booking; store the reference and read it.

---

## F9 — LIVESTOCK DISEASE PASSPORT (animal health record)

Every animal gets one longitudinal digital health record, so nobody has to reconstruct its history from scattered sources before a visit.

> **Boundary:** a health-record and decision-support feature, not a diagnosis system. It may display recorded or system-generated surveillance information, but it must never present an AI/surveillance risk estimate as a confirmed diagnosis.

### 10.9.1 Contents
Animal identity, species, breed, sex, age/DOB, owner/farm/herd, vaccination history, previous illnesses, veterinary visits, diagnostic/sample records, current surveillance assessment, current status, pending consultation, related alerts, notes and follow-up actions. Every field that can be absent renders `Not recorded` / `Unknown` — never an invented value.

### 10.9.2 Species and herd support
Support cattle, buffalo, goat, sheep, pig and poultry, with optional fields where species differ — do not assume identical health fields across species. Individual animal records are the primary view; herd passports (herd ID, species, farm, animal count, vaccination coverage, health events, alerts, visits) are supported as a secondary view.

### 10.9.3 Current status
Derived from actual records and workflow state, never from symptoms alone:

```
HEALTHY / NO ACTIVE ALERT · MONITORING · SURVEILLANCE ALERT ·
VETERINARY CONSULTATION PENDING · UNDER VETERINARY ASSESSMENT ·
SAMPLE TESTING PENDING · FOLLOW-UP REQUIRED · RESOLVED
```

### 10.9.4 Current surveillance assessment
Show the score, severity level and risk level from the linked assessment record, labelled **"Surveillance risk score"** and never **"disease probability"** — and never described as a calibrated probability of disease. Add the meaning line ("High priority — veterinary assessment recommended") and the status ("Veterinary confirmation pending").

Show a **Why flagged?** block containing only reasons that genuinely exist in the source assessment (recent health report · multiple concerning symptoms recorded · associated with a surveillance alert), closed with:

> ⚠ This is a surveillance assessment, not a confirmed diagnosis.

### 10.9.5 Illness records and confirmation status
Distinguish reported, suspected, assessed and confirmed. A suspected condition renders as **"Suspected condition — veterinary confirmation pending"** and can only become confirmed when a record whose `source` is `veterinary_officer` or `laboratory` says so.

### 10.9.6 Health timeline
Generated dynamically from stored events, sorted chronologically, merging vaccinations, illnesses, visits, assessments, diagnostics and appointments into one vertical rail. Visually, this is a strong place for the design system: a thin espresso rail with small circular nodes, tier-coloured only where the event carries a risk level.

### 10.9.7 Two views
- **Veterinarian view:** a scannable clinical summary (identity, species, age, vaccinations, previous illness, last visit, current assessment, current status) with expanders for vaccination history, illness history, visits, surveillance reports and diagnostic records.
- **Farmer view:** simpler — my animal, vaccination status, previous health events, current alert, upcoming appointment, recommended next action. Never expose internals like model versions or feature vectors; say "Veterinary assessment recommended" instead.

### 10.9.8 Integrations
- **Appointment (F8):** booking links to the animal and flips status to "Veterinary appointment booked" with date, time and facility; the appointment appears on the timeline.
- **Facility Finder (F7):** when status is high-priority or consultation-pending, show nearby veterinary support with distances **obtained from the Facility Finder service** — never re-implemented here.
- **Outbreak Radar (F3):** if the animal's report contributed to a detected cluster, link to it ("Emerging cluster · Investigation priority 86/100 · View cluster") while making clear the animal is *associated with* an alert, not diagnosed with the disease behind it.

### 10.9.9 Search and access
Search by animal ID, herd ID, farm ID, species, village, owner. Farmers see only their own animals; veterinarians and field officers see only what their assignment authorises. Enforce this in the mock API layer, and audit-log every passport view.

### 10.9.10 Auditability
Every record carries `created_by`, `updated_by`, `created_at`, `updated_at` and a `source` (`farmer` / `veterinary_officer` / `laboratory` / `surveillance_engine`). Nothing generated may overwrite an authoritative veterinary or laboratory record. Show the source as a small tag on each record — it is a trust feature, not metadata clutter.

### 10.9.11 Download / share
**Download health passport** produces a printable summary (a clean print stylesheet is sufficient; no server-side PDF) containing identity, vaccination history, previous health events, veterinary visits, current assessment, diagnostic records and appointment details — and no internal system information. Sharing with a veterinarian shares only what the appointment needs.

### 10.9.12 Where AI is and is not allowed
AI may summarise a long history, translate the passport, explain terminology, convert a farmer's natural-language description into a structured health event, and generate a concise appointment summary. AI may **not** create a record, alter a vaccination record, create a diagnosis, overwrite laboratory results, convert suspected into confirmed, or determine authoritative outcomes. In this frontend-only build, implement the summariser as a deterministic template over the stored records — and label it as generated, e.g. *"The animal has two recorded vaccinations, one previous illness, and a recent high-priority surveillance assessment. Veterinary consultation is pending."*

---

## F10 — IVR SIMULATOR (feature-phone reporting)

The channel for farmers with no smartphone, no data and no technical literacy. Built here as an **on-screen simulated handset** that a judge can operate with a mouse: a rendered phone with a keypad, a call transcript that streams system prompts and farmer keypresses, and a live panel showing the IVR session state, the collected report and the generated SMS.

> The IVR must never ask the farmer to diagnose the animal. The farmer reports observable symptoms; the system generates a **preliminary assessment**, always presented as a possible/suspected condition and never as a confirmed veterinary diagnosis.

### 10.10.1 What a farmer can do
Report a sick animal or group · answer a guided symptom sequence · identify the affected animal/farm where possible · have their profile, animals, vaccinations and past reports retrieved from their phone number · receive a preliminary AI-assisted assessment · a disease confidence · a severity level · a case-risk score · immediate care and precautions · request veterinary assistance or a callback · check an existing report · receive a case ID by voice and SMS · resume a partially completed report after a dropped call.

### 10.10.2 Call flow (implement as a state machine, one machine, localized prompts)

States: `LANGUAGE_SELECTION · MAIN_MENU · IDENTIFY_FARMER · REPORT_TYPE · ANIMAL_ID · SPECIES · AGE · ONSET · AFFECTED_COUNT · SYMPTOMS · WARNING_SIGNS · DEATHS · VACCINATION · PREVIOUS_ILLNESS · LOCATION · IMAGE_OPTION · CONFIRMATION · SUBMIT_REPORT · AI_ASSESSMENT · ASSESSMENT_RESULT · VETERINARY_ASSISTANCE · APPOINTMENT_REQUEST · CALLBACK_REQUEST · REPORT_STATUS · END_CALL`

Each state has a clear input, validates it, updates session state, transitions, supports retry, and survives interruption/resumption. Never write one giant function, and never duplicate the flow per language.

**Prompts:**
- Welcome: "Welcome to the Livestock Health Assistance Service." → "For Marathi, press 1. For Hindi, press 2. For English, press 3." Store the selection in the session; everything afterwards uses it.
- Main menu: 1 = report a sick animal · 2 = check an existing report · 3 = request veterinary assistance. Invalid input: "I did not understand your selection. Please try again." Configurable retry limit, then offer to restart, then end gracefully and log the failure.
- Farmer identification by **incoming caller number**: look up the farmer, retrieve profile, farm/location, registered animals/herds, vaccination history and previous reports, and **do not re-ask what is already known**: "We found your registered farm in [Village], [Taluka], [District]. Is this the location of the affected animal? 1 Yes / 2 No." Unregistered callers may still report — ask only the minimum, and never force registration ahead of an urgent report.
- Report type: 1 = one animal (ask ear-tag/ID if available, allow skip) · 2 = multiple (ask how many). Validate numerics; reject 0 or negatives and re-ask.
- Species: 1 Cattle · 2 Buffalo · 3 Goat · 4 Sheep · 5 Poultry · 6 Other (free text stored as-is).
- Age: 1 <1 yr · 2 1–3 · 3 3–6 · 4 >6 · 5 Unknown. For group reports use age group / herd-level info rather than asking per animal.
- Onset: 1 Today · 2 Yesterday · 3 2–3 days ago · 4 More than 3 days ago · 5 Not sure. Store the category and normalise to a duration.
- Affected count for group reports; `affected_count ≥ 1`; individual reports set it to 1.
- Symptoms, multi-select, pressed sequentially, ending with 0: 1 Fever · 2 Skin lumps/nodules/lesions · 3 Wounds or ulcers · 4 Difficulty walking · 5 Excessive salivation · 6 Coughing or difficulty breathing · 7 Diarrhoea · 8 Reduced appetite · 9 Swelling · 0 Finished. Prevent duplicates, cap the count configurably, and keep the symptom list extensible without rewriting the flow.
- Serious warning signs, each 1 Yes / 2 No / 3 Not sure: severe difficulty breathing · unable to stand or walk · extremely weak, collapsed or unconscious. These feed severity and risk; a critical sign flags the case as potentially urgent. Never give dangerous treatment instructions.
- Deaths: 1 Yes / 2 No / 3 Not sure; if yes, ask how many; validate `1 ≤ deaths ≤ affected_count` and re-ask on violation. Deaths weigh heavily in case and outbreak risk.
- Vaccination status: 1/2/3; if records exist, retrieve them, confirm rather than interrogate, and store the status, the known history and the **source of the information**. Never invent vaccination records.
- Previous similar illness: 1/2/3; pull prior health records where they exist and feed them into the assessment.
- Location: confirm the known location for registered farmers ("We have your location as [Village], [Taluka], [District]. Is this correct?"); otherwise collect village, taluka/block, district and PIN where useful. Offer SMS-based location sharing for smartphone users and field-worker verification later. **Never claim that an ordinary phone call provides GPS.** Store `location_source ∈ { registered_profile, farmer_voice_input, SMS_location, field_worker_verified, other }`, plus latitude/longitude/accuracy/source when coordinates genuinely exist.
- Optional image: offer an SMS upload link (1 Yes / 2 No). If yes, generate a link, associate any upload with the report, store image metadata — and keep the report valid without it. The IVR itself cannot inspect an image.
- Confirmation: read back a summary (animal type, number affected, symptoms, onset, deaths) → 1 Submit · 2 Edit · 3 Cancel. Editing returns to the relevant section, not to the start.

### 10.10.3 Report creation
Generate a collision-resistant case ID (`26128-AB1234` shape). Store report ID, farmer ID, phone number, `source = IVR`, language, animal/group info, symptoms, onset, affected count, deaths, vaccination info, previous illness, location, timestamp, IVR session ID and status.

Statuses form an **append-only timeline**, never an overwrite: `RECEIVED · AI_ASSESSMENT_PENDING · ASSESSED · VET_REQUESTED · VET_ASSIGNED · VISIT_SCHEDULED · LAB_PENDING · DIAGNOSIS_CONFIRMED · FOLLOW_UP · CLOSED`.

The report created here enters the **same** reports store as every other channel, so it flows straight into clustering, mapping and the passport. Show that on screen: after the call ends, the report appears on the radar.

### 10.10.4 Assessment service (rule-based, abstracted)
Build an `assessmentService` interface with a rule-based implementation, structured so a model could replace it. Inputs: species, age group, symptoms, duration, affected count, deaths, warning signs, vaccination status, previous illness, location, historical info, and image assessment if one is later uploaded. Reuse the F1 confidence engine rather than writing a second scoring path — map IVR symptom codes onto knowledge-base symptom names.

Returns: possible/suspected condition · disease confidence · severity · case-risk score · recommended next action · immediate care/precaution category.

Example shape (values computed): possible condition Lumpy Skin Disease · confidence 82% · severity Moderate · case risk 74/100 · recommended action "Veterinary assessment recommended."

Spoken as: *"The symptoms are consistent with a possible case of Lumpy Skin Disease. A veterinary assessment is recommended."* Never *"You definitely have…"*. If confidence is low: *"Unable to determine a likely condition from the information provided. Veterinary assessment is recommended."*

### 10.10.5 Severity and case risk — two different things
Severity: `LOW · MODERATE · HIGH · CRITICAL`, considering warning signs, number affected, deaths, symptom severity, duration, species and relevant disease characteristics. CRITICAL covers severe breathing difficulty, collapse/unconsciousness, inability to stand with severe weakness, rapidly increasing deaths. HIGH covers multiple serious symptoms, multiple animals, deaths, strong outbreak indicators. MODERATE is clear illness without critical warning signs. LOW is limited symptoms and no major warning signs. The scoring mechanism is configurable.

Case risk is a separate 0–100 number stored and exposed separately from disease confidence. Confidence answers "how strongly does the assessment support this suspected disease?"; case risk answers "how urgent is this case?" Keep them apart in the data model and the API, and never show one labelled as the other.

### 10.10.6 Immediate care and precautions
Use exactly that heading. Permitted content: separate visibly sick animals where appropriate · avoid unnecessary movement · maintain clean housing · provide clean drinking water · monitor for worsening symptoms · report deaths promptly · seek veterinary assessment.

**Never** provide prescription drug dosages, antibiotic prescriptions, drug combinations, injections, invasive procedures or definitive treatment decisions. All disease-specific guidance comes from the F1 knowledge base's `treatment_supportive_management` and `recommended_containment_action` fields — and the drug-bearing lines in that dataset are for the veterinarian-facing knowledge base only, never read out to a farmer over IVR.

### 10.10.7 Veterinary assistance
Offer it after assessment (1 Yes / 2 No). On yes, create a request storing request ID, report ID, farmer ID, priority (derived from severity/risk), location, requested-at and status. HIGH/CRITICAL cases flag for urgent attention and trigger the callback workflow — but **never claim a veterinarian has been assigned unless the system state actually says so**. Offer: 1 Request appointment · 2 Request callback · 3 Return to main menu.

Main-menu option 3 lets a farmer request help without filing a new report: 1 Animal illness · 2 Emergency · 3 Vaccination-related · 4 Follow-up on an existing case · 5 Other, associated with an existing report where relevant.

### 10.10.8 Facility information over IVR
When facility data exists, use the farmer's **verified** location and prioritise emergency capability → service suitability → availability → distance — not distance alone (this is the F7 service, called, not duplicated). Say "The nearest suitable veterinary facility is approximately 8 kilometres away." Only state an appointment time if the slot service actually confirms one; otherwise: "Your request for veterinary assistance has been recorded." **Never invent availability.**

### 10.10.9 SMS follow-up
After report creation, generate an SMS in the farmer's selected language containing case ID, receipt confirmation, preliminary assessment if available, severity, case-risk score, veterinary assistance status and next steps, with the preliminary nature stated. Render it in the Device Inbox (F11) exactly as it would be sent. Example shape:

```
Livestock Health Report received.
Case ID: 26128-AB1234.
Possible condition: Lumpy Skin Disease.
Severity: Moderate.
Case risk: 74/100.
Veterinary assessment recommended.
```

### 10.10.10 Check existing report (menu option 2)
Identify by caller number; ask for the report ID if several exist, otherwise use the most recent. Read back case ID, date reported, current status, preliminary assessment if available, severity, veterinary assistance status, appointment status if confirmed, and lab status if available. **Never expose another farmer's case** — verify ownership through phone-number association.

### 10.10.11 Call drop and resume
Persist the session, store the last completed state and all collected answers, and mark it `INTERRUPTED`. On a later call from the same number within a configurable window: "Your previous report was incomplete. Would you like to continue? 1 Continue / 2 Start a new report." No collected information is lost. Provide a **Simulate call drop** button in the simulator so a judge can watch this work.

### 10.10.12 Error handling
Every DTMF question handles invalid key, timeout, repeated timeout, speech-recognition failure, unexpected speech and provider failure. "I did not understand your response. Please try again." After configurable retries: "We are unable to process your response. You may call again later." On system failure: log it, preserve the session, **never silently lose a disease report**, and fall back gracefully.

### 10.10.13 Speech
Provide a speech-input abstraction alongside DTMF (the simulator can expose a "speak" text field that feeds the same handler), and a TTS abstraction that renders SSML for Marathi/Hindi/English and optionally speaks via the browser's `speechSynthesis` when a suitable voice exists.

---

## F11 — MULTILINGUAL ALERTS & OMNICHANNEL DISPATCHER

The advisory layer. All notifications resolve through an **immutable, pre-approved template registry** — **no generative model ever writes health advice.** Marathi is a first-class language with English as fallback.

### 10.11.1 Domain model (as typed in-memory collections)
- `NotificationTemplate` — `template_code` (PK), `language_code`, `category` (`OUTBREAK_EPIDEMIC` / `APPOINTMENT_LIFECYCLE` / `RING_VACCINATION` / `LAB_RESULT`), `title_template`, `body_template` (strict `{variable}` syntax), `ivr_ssml_template`, `whatsapp_payload_schema`; unique on (`template_code`, `language_code`).
- `FarmerContactProfile` — `farmer_id` (UUID), `full_name`, `phone_number` (E.164 `+91XXXXXXXXXX`), `preferred_language` (default `mr`), `village_name`, `taluka`, `district`, `pwa_push_subscription` (nullable).
- `VetAppointment` — `appointment_id`, `farmer_id`, `vet_officer_name`, `dispensary_name`, `status` (`WAITLISTED` / `CONFIRMED` / `COMPLETED` / `CANCELLED`), `scheduled_at` (timezone-aware).
- `NotificationDispatchLog` — `dispatch_id`, `recipient_id`, `channel` (`SMS` / `IVR` / `WHATSAPP` / `PWA`), `rendered_content`, `delivery_status` (`QUEUED` / `DISPATCHED` / `FAILED`), `dispatched_at`.

### 10.11.2 The four mandated templates — Marathi and English bodies **verbatim**

**1. `OUTBREAK_ALERT_V1`** (category `OUTBREAK_EPIDEMIC`)

Marathi body:
```
🚨 रोगाचा संभाव्य उद्रेक
आपल्या गावाजवळ जनावरांमध्ये संशयित रोगाची प्रकरणे आढळली आहेत.
कृपया:
• आजारी जनावरे वेगळी ठेवा
• जनावरांची अनावश्यक वाहतूक टाळा
• पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधा
```
English body:
```
🚨 Potential Disease Outbreak
Suspected disease cases have been detected near your village.
Please:
• Isolate sick animals
• Avoid unnecessary animal transportation
• Contact the veterinary officer immediately
```

**2. `APPT_WAITLIST_CONFIRMED_V1`** (category `APPOINTMENT_LIFECYCLE`)

Marathi body:
```
✅ पशुवैद्यकीय भेट निश्चित झाली!
आपली प्रतीक्षा यादीतील भेट आता पुष्टी झाली आहे.
पशुवैद्यकीय अधिकारी: {vet_name}
दवाखाना/केंद्र: {dispensary_name}
तारीख व वेळ: {appointment_time}
कृपया जनावराची आरोग्य नोंद वही सोबत आणावी.
```
English body:
```
✅ Veterinary Appointment Confirmed!
Your waitlisted appointment is now confirmed.
Veterinary Officer: {vet_name}
Dispensary: {dispensary_name}
Date & Time: {appointment_time}
Please bring the livestock health record book.
```

**3. `RING_VACCINATION_CALL_V1`** (category `RING_VACCINATION`)

Marathi body:
```
💉 तातडीची रिंग लसीकरण मोहीम
{village_name} गावाच्या ५ किमी परिसरात {disease_name} चा संसर्ग रोखण्यासाठी मोफत लसीकरण सत्र सुरू आहे.
स्थान: {vaccination_center}
वेळ: आज सकाळी ९ ते दुपारी ४ वाजेपर्यंत.
```
English body:
```
💉 Emergency Ring Vaccination Drive
A free vaccination drive is underway in a 5 km radius of {village_name} to curb {disease_name}.
Location: {vaccination_center}
Time: Today from 9:00 AM to 4:00 PM.
```

**4. `LAB_TEST_CONFIRMATION_V1`** (category `LAB_RESULT`)

Marathi body:
```
🔬 प्रयोगशाळा तपासणी अहवाल
नमुना क्रमांक {sample_id} चे निदान: {disease_name} (पॉझिटिव्ह).
तातडीची सूचना: बाधित जनावराला {quarantine_days} दिवस स्वतंत्र गोठ्यात ठेवा आणि निर्जंतुकीकरण फवारणी करा.
```
English body:
```
🔬 Laboratory Diagnostic Report
Sample #{sample_id} result: {disease_name} (POSITIVE).
Urgent Advisory: Keep the infected animal isolated for {quarantine_days} days and disinfect the shed immediately.
```

Add Hindi, Punjabi and Gujarati versions of all four (translate the *content*, keep the emoji, structure, bullets and `{variable}` names byte-identical). Note the deliberate exception to the platform's "never confirm a disease" rule: `LAB_TEST_CONFIRMATION_V1` **may** state a positive result, because its `source` is an authoritative laboratory record — it can only be dispatched from a `diagnostic_records` entry with `status: completed` and a real `result`. Never from a surveillance score.

### 10.11.3 Channel drivers
A `BaseNotificationChannel` interface with four concrete implementations, each fully implemented — no `TODO`, no empty method:

- **`SmsChannelDriver`** — validates character length and UTF-8 encoding, computes GSM-7 vs UCS-2 segmentation (Devanagari and Gurmukhi force UCS-2 at 70 chars/segment — show the segment count, it is a genuinely good detail), and formats the payload the way a CDAC/NIC-style gateway would expect.
- **`IvrChannelDriver`** — converts the localized text into SSML (`<speak><p>…</p></speak>`) with prosody suited to an Indian-accent Marathi/Hindi TTS voice, correct pause handling for bullet lists and numerals read digit-by-digit for IDs.
- **`WhatsAppChannelDriver`** — builds a WhatsApp Cloud API interactive JSON message with quick-reply buttons ("कॉल करा" [Call vet], "मार्गदर्शन पहा" [View SOP]).
- **`PwaPushChannelDriver`** — generates a standard W3C Web Push payload with `icon`, `badge`, `vibrate: [200, 100, 200]` and offline caching directives.

Each driver **returns its rendered payload** and logs a `NotificationDispatchLog` entry; nothing is actually transmitted. The Device Inbox renders each payload in a channel-appropriate frame: an SMS in a feature-phone screen, a WhatsApp bubble with tappable quick replies, a push toast, and the SSML in the one permitted monospace panel.

### 10.11.4 Orchestrator — `OmnichannelNotificationService`
- `renderTemplate(template_code, lang, params)` — safe interpolation with a **fallback to `mr`** when the requested language has no entry, then to `en`. Missing parameters must throw loudly in dev, never render `{vet_name}` to a farmer.
- `dispatchOutbreakBroadcast(village_name, disease_name, radius_km)` — selects every `FarmerContactProfile` inside the affected radius (haversine against village coordinates), renders `OUTBREAK_ALERT_V1` in each recipient's preferred language, and dispatches across **WhatsApp and SMS**. Show the recipient count and the per-language breakdown before sending, and require an officer to confirm.
- `dispatchAppointmentConfirmed(appointment_id)` — moves the appointment from `WAITLISTED` to `CONFIRMED`, renders `APPT_WAITLIST_CONFIRMED_V1` in the farmer's preferred language, and dispatches across **WhatsApp, SMS and PWA push**.
- Ring vaccination and lab-result dispatches follow the same pattern from their own triggers.

### 10.11.5 Demonstration path
Replace the source spec's `if __name__ == '__main__'` script with an in-app **Dispatcher console** at `/alerts` that: seeds a sample farmer profile and a waitlisted appointment, triggers the outbreak broadcast and the appointment confirmation, and prints every simulated channel payload cleanly — plus a dispatch log table with channel, language, status and timestamp. The console must also be reachable from a live radar alert, so the demo path is *cluster crosses into HIGH → dispatcher pre-loaded with the affected village, disease and radius → officer confirms → payloads appear in the Device Inbox in Punjabi, Hindi and Marathi.*
---

# SECTION 11 — GLOBAL SAFETY, HONESTY AND LANGUAGE RULES

These apply to every module, every string, every component. They are the difference between a surveillance tool and a liability.

### 11.1 Never claim what the system does not know

| Never | Instead |
|---|---|
| "Your animal has FMD." | "The reported symptoms are consistent with a possible case of FMD. Veterinary assessment is recommended." |
| "Outbreak confirmed." | "Emerging cluster · Investigation priority 86/100." |
| "Heavy rainfall caused the outbreak." | "Current environmental conditions coincide with elevated disease activity." |
| "Disease probability: 87%." | "Surveillance risk score: 87/100." |
| "Nearest lab does FMD PCR." | "Diagnostic capability: Unknown. Contact the laboratory regarding sample submission." |
| "A veterinarian has been assigned." | "Your request for veterinary assistance has been recorded." |
| "Appointment available at 4 PM." (unverified) | "Demonstration slot data — no live scheduling system connected." |
| A blank field rendered as 0 or "None" | `Not recorded` / `Unknown` / `Not found within 25 km` |

### 11.2 Never fabricate
No invented facility information, contact details, opening hours, diagnostic capabilities, appointment availability, vaccination records, laboratory results, veterinary visits, or GPS coordinates. Missing is a legitimate state and must be rendered as one.

### 11.3 Never prescribe
No drug names with dosages, no antibiotic prescriptions, no drug combinations, no injections, no invasive procedures, no definitive treatment decisions in any farmer-facing surface. Disease-specific management content stays in the veterinarian-facing knowledge base, sourced from `treatment_supportive_management`, and is never read out to a farmer through IVR or SMS.

### 11.4 Keep provenance visible
Every health record shows its `source`. Nothing generated overwrites anything authoritative. Suspected never silently becomes confirmed. A surveillance score never becomes a diagnosis.

### 11.5 Zoonotic handling
Anthrax and HPAI carry the zoonotic marker everywhere they appear, and every zoonotic escalation shows the dual animal-health **and** public-health notification path. This is a headline differentiator — make it visible, not buried.

### 11.6 Copy voice
Sentence case. Active voice. Plain verbs. A CTA says exactly what will happen ("Book consultation" → toast "Consultation booked"). Errors explain what happened and what to do next, without apologising or being vague. Empty states invite an action rather than describing a void. No filler, no marketing tone, no exclamation marks outside the notification templates that already carry them.

---

# SECTION 12 — TESTING

Frontend-only does not mean untested. Vitest, focused on the pure engines — that is where correctness lives and where a judge's "is this real?" question gets answered.

**Engine unit tests (required):**
- haversine against known coordinate pairs
- DBSCAN: forms the strong cluster, excludes the distant reports, excludes reports outside the 72-hour window, and re-forms correctly when a report is added
- Jaccard symptom similarity, including the disjoint-symptom case inside the cluster radius
- investigation priority: weights sum to 1.0; each component's contribution moves the score in the right direction; threshold boundaries (39/40, 69/70, 84/85) classify correctly
- the F5 point matrix returns **86** for the seeded Rajpura scenario, and each of S1–S6 is independently tested
- symptom-confidence engine returns FMD ≈96% High confidence for the worked demo case, and disqualifies species that do not match
- village risk: each of the five components, plus the +15 market-linked bonus capped at 100
- weather context: threshold banding, 7-day aggregation, and the rule that a high weather context alone cannot lift a cluster into HIGH
- facility ranking: the 3 km-without-capability vs 8 km-with-capability case resolves to the 8 km facility; radius expansion triggers only when nothing suitable is found
- case risk vs disease confidence remain independent values
- baseline multiplier maths
- contagion projection is bounded by susceptible population
- data quality flags the seeded duplicate pair and the incomplete reports

**Integration/component tests (required):**
- report submitted while online → synced
- report submitted while offline → queued, survives a page reload (real IndexedDB, not a mock)
- multiple offline reports → batch sync on reconnect
- duplicate upload of the same `local_report_id` → one record, existing record returned
- server timeout → retry with backoff, report retained
- app restart with pending reports → queue intact
- failed image upload → report not lost
- conflicting update → user is notified, nothing silently overwritten
- booking a slot that was taken mid-flow → clear error, no appointment created, slot not double-booked
- a farmer cannot read another farmer's animal, report or appointment through the API layer
- IVR: language selection, invalid DTMF, retries, registered vs unregistered farmer, individual vs group report, duplicate symptom presses, invalid affected count, deaths > affected count, warning-sign escalation, vaccination retrieval, location confirmation, confirmation/edit path, report creation, unique ID, assessment, low-confidence assessment, veterinary escalation, SMS generation, status lookup, call interruption, resume
- one **end-to-end test** replaying the full sample IVR conversation in Section 14.2 and asserting the resulting report, case ID format, severity, case risk and SMS content

Also include the connectivity test with the network genuinely disabled (dev-panel forced offline), not merely a mocked flag.

---

# SECTION 13 — BUILD ORDER (follow this sequence)

Build vertically, not horizontally: get one thin slice working end-to-end early, then widen. Do not build all the UI first.

**Phase 0 — Foundation.** Scaffold Vite + React + TS + Tailwind. Implement `design/tokens.ts` and the full design-system primitive set from Section 6 on a `/styleguide` route before building any feature screen. Add the frozen clock, the event bus, the API client with latency/failure/logging, the role switcher and the i18n scaffolding with all five locales wired (English complete, others at least fully keyed).

**Phase 1 — Data + engines.** Author every file in `src/mock/`. Implement every function in `src/engines/` as pure TypeScript with its unit tests. **Do not write a single feature component until the engines pass their tests.** This is the phase that decides whether the demo is real.

**Phase 2 — F3 Outbreak Radar.** Cluster detection, scoring, explanations, cluster map, cluster detail, cluster evolution, data quality, live simulation. This is the spine — everything else attaches to it.

**Phase 3 — F1 Knowledge Base + Symptom Checker + advisory generator.** Fast to build, high demo value, and it feeds F5 and F10.

**Phase 4 — F6 Geospatial command centre.** Village risk, layers, heatmap, buffer rings, market overlay, zoonotic flags, dashboard tiles, trend chart, village table, time-travel slider, contagion simulator, SMS digest.

**Phase 5 — F4 Weather context** layered into the radar and the map, plus the correlation chart.

**Phase 6 — F7 Facility Finder,** wired to consume radar output, with its map, alert card, explanations and simulation.

**Phase 7 — F9 Passport + F8 Appointment booking.** Build the passport first (booking updates it), then the booking flow, the vet queue, pre-visit summary, consultation completion, reschedule/cancel and history.

**Phase 8 — F2 Offline-first reporting.** Dexie store, connectivity service, sync queue, idempotency, backoff, conflicts, images, sync UI.

**Phase 9 — F10 IVR simulator** and **F11 Alerts dispatcher + Device Inbox**, wired so an IVR report lands on the radar and a radar alert pre-loads the dispatcher.

**Phase 10 — F5 Deterministic triage view,** the `/dev/api` contract page, the audit log, the landing page, accessibility pass, and the rehearsed demo path.

**Acceptance gate for every phase:** all engine tests still pass; adding one report through `POST /api/reports` still ripples through at least six visible surfaces; no hardcoded scores, distances, tiers or explanations have crept in.

---

# SECTION 14 — DEMO SCRIPTS

### 14.1 The 5-minute judge walkthrough (build toward this)

1. **Landing** — the design system does the talking for ten seconds. One line: what the product does.
2. **A farmer reports, offline.** Switch to Farmer, force the app offline, file a report from Ghanaur with photo and GPS. Show "Report saved on this device." Reload the page — it is still there. Go online: it syncs, and the sync pill goes truthful. Hit "sync again" from the dev panel: no duplicate is created.
3. **A farmer with no smartphone reports.** Open the IVR simulator, press 2 for Hindi, walk the keypad through the flow, watch the transcript build a structured report, receive a case ID and the SMS in Hindi in the Device Inbox.
4. **The radar reacts.** Switch to Veterinary Officer. Both reports are on the map. Run the live simulation: Normal → Watch → Emerging cluster → High priority, with the score dial counting up and the cluster boundary redrawing. Open the cluster: the "Why flagged?" list, every bullet backed by a number.
5. **Context.** Weather panel: rainfall high, humidity high, activity 4.7× baseline — read the "coincide with" line aloud and say why it is not "caused by". Then the map: buffer rings catch Bhadson, and the market overlay flags Nabha 25 km away through the Rajpura Mandi.
6. **Explainability.** Open the triage view: the S1–S6 bar chart, the differential diagnosis, 86/100 derived not typed. Change a detection parameter in the settings panel and let the judges watch every number move.
7. **Response.** Facility finder: nearest vet 4.2 km, nearest lab 17.6 km — and show the ranking choosing the 8 km lab over the 3 km clinic, with the reason. Book the 10:30 slot. Have the dev panel steal the slot mid-flow to show the double-booking guard.
8. **Record.** Open MH-COW-00421's passport: timeline now carries the appointment; switch to the veterinarian view and show the pre-visit summary with the "not a confirmed diagnosis" line.
9. **Reach.** Open the dispatcher from the alert: 214 farmers in the 5 km radius, broken down by preferred language; dispatch; show the Marathi WhatsApp payload with quick replies, the Punjabi SMS with its UCS-2 segment count, and the SSML that the IVR would speak.
10. **Low connectivity close.** Generate the SMS digest: the whole district's top-5 risk in 160 characters. One sentence: *"Everything you just saw runs with no internet, no API keys and no server."*

### 14.2 The rehearsed IVR call (implement and test exactly this)

```
SYSTEM  Welcome to the Livestock Health Assistance Service.
        For Marathi press 1, Hindi press 2, English press 3.
FARMER  3
SYSTEM  For reporting a sick animal press 1. To check an existing report press 2.
        To request veterinary assistance press 3.
FARMER  1
SYSTEM  We found your registered farm in Village X, Taluka Y, District Z.
        Is this the location of the affected animal?
FARMER  1
SYSTEM  Is one animal affected or are multiple animals affected?
FARMER  1
SYSTEM  What type of animal is affected? 1 cattle, 2 buffalo, 3 goat, 4 sheep, 5 poultry, 6 other.
FARMER  1
SYSTEM  What is the approximate age?
FARMER  2
SYSTEM  When did the symptoms first appear?
FARMER  3
SYSTEM  Please select all symptoms. 1 fever, 2 skin lumps or lesions, 3 wounds or ulcers,
        4 difficulty walking, 5 excessive salivation, 6 coughing or difficulty breathing,
        7 diarrhea, 8 reduced appetite, 9 swelling, 0 finished.
FARMER  1 → 2 → 8 → 0
SYSTEM  Is the animal having severe difficulty breathing?            FARMER  2
SYSTEM  Is the animal unable to stand or walk?                       FARMER  2
SYSTEM  Is the animal extremely weak, collapsed, or unconscious?     FARMER  2
SYSTEM  Have any animals died?                                       FARMER  2
SYSTEM  Are the affected animals vaccinated?                         FARMER  1
SYSTEM  Have these animals experienced a similar illness before?     FARMER  2
SYSTEM  You reported a cattle animal with fever, skin lesions, and reduced appetite.
        Symptoms began 2 to 3 days ago. Press 1 to submit, 2 to change, 3 to cancel.
FARMER  1
SYSTEM  Your report has been received. Your case number is 26128-AB1234.
AI      Possible condition: Lumpy Skin Disease · Confidence 82% · Severity Moderate · Case risk 74/100
SYSTEM  The reported symptoms are consistent with a possible case of Lumpy Skin Disease.
        This is a preliminary assessment and should be confirmed by a veterinarian.
        Immediate care and precautions: keep the affected animal separated where appropriate,
        maintain clean housing and drinking water, avoid unnecessary movement,
        and seek veterinary assessment.
        Would you like veterinary assistance? Press 1 for yes, 2 for no.
FARMER  1
SYSTEM  Your veterinary assistance request has been recorded. Your case number is 26128-AB1234.
        You will receive further information by SMS.
```

The case ID and every assessment number here are **generated**; only the prompt wording is fixed.

### 14.3 Other rehearsed paths
- **Knowledge base:** filter to zoonotic → Anthrax and HPAI stand out → symptom checker with the four FMD symptoms, Punjab, August → FMD ~96% High confidence → escalation banner → toggle to Hindi → advisory renders.
- **Facility finder:** open a high-priority cluster → nearby response support → open the lab on the map → distance, capability, availability, contact → "Why recommended?" → get directions → toggle English → Hindi → Gujarati → simulate a new report and watch every distance recalculate.
- **Passport:** my animals → MH-COW-00421 → passport → timeline → current assessment with the not-a-diagnosis note → book appointment → confirm → status updates → switch to vet view → pre-visit history → complete consultation → timeline gains the sample-collected entry.

---

# SECTION 15 — WHAT NOT TO DO, AND THE FINAL CHECKLIST

### 15.1 Hard prohibitions

- ❌ No backend, database, ORM, migration, Docker file, `.env` requirement, or any code that needs a key or a network call to run.
- ❌ No hardcoded cluster results, risk scores, risk levels, outbreak labels, distances, rankings, explanations, multipliers or "why flagged" strings.
- ❌ No `localStorage` for structured reports (IndexedDB via Dexie only).
- ❌ No deep learning, no model download, no LLM API call. Rule-based engines only, honestly labelled in code and confidently framed as "AI-assisted triage" in the pitch.
- ❌ No `pass`, `# TODO`, `...`, empty method bodies or "implementation left as an exercise". Every driver, engine, state and screen is complete and runnable.
- ❌ No `any` in shared domain types. Strict TypeScript throughout.
- ❌ No business logic inside React components. Engines are pure; components render.
- ❌ No component reading `src/mock/*.json` directly — everything goes through `services/api/`.
- ❌ No diagnosis claims, no causation claims about weather, no invented facility or appointment data, no drug dosages.
- ❌ No merging the five scores, and no displaying one under another's name.
- ❌ No duplicate alerts for the same evolving cluster.
- ❌ No UI kit, no rounded-card-and-grey-shadow default, no ALL-CAPS eyebrow labels, no `→` in button text.

### 15.2 Final deliverables checklist

```
Foundation
[ ] Vite + React + TS + Tailwind, runs with npm install && npm run dev, no keys, works offline
[ ] Design tokens + /styleguide route showing every primitive
[ ] Pinstripe texture, circular masks with offset backdrops, arch masks, asymmetric sections
[ ] Frozen demo clock, event bus, API client with latency + failure injection + request log
[ ] Role switcher (Farmer / Vet / Field Officer / Officer-Admin) with real data gating
[ ] Five locales wired, internal values language-independent

Data & engines
[ ] All mock datasets from Section 8, verbatim where specified
[ ] All engines in src/engines/, pure, typed, unit-tested
[ ] Engine test suite green, including the 86/100 and ~96% FMD assertions

Features
[ ] F1  Knowledge base explorer, symptom checker, confidence engine, auto-escalation, advisories
[ ] F2  Offline capture, Dexie queue, connectivity service, idempotent sync, backoff, conflicts, images, GPS, sync UI
[ ] F3  Spatiotemporal clustering, priority scoring, explanations, cluster map, evolution, data quality, live simulation
[ ] F4  Weather indicators, temporal windows, context score, causality-safe copy, map layer, correlation chart
[ ] F5  Deterministic S1–S6 matrix, differential diagnosis, seeded scenario, strict JSON payload, breakdown chart
[ ] F6  Risk map, village risk score + breakdown, layers, heatmap, time-travel, contagion rings, trade routes, zoonotic flags, dashboard, SMS digest
[ ] F7  Haversine distances, radius expansion, filtering, capability-first ranking, four facility types, explanations, map, alert card, simulation
[ ] F8  Booking flow from three entry points, slots, confirmation, generated IDs, double-booking guard, vet queue, pre-visit summary, completion, reschedule, cancel, history
[ ] F9  Passport (farmer + vet views), timeline, statuses, assessments, diagnostics, provenance, search, print/share, integrations
[ ] F10 IVR simulator: state machine, DTMF keypad, 3 languages, identification, symptoms, warning signs, validation, assessment, case ID, SMS, status lookup, drop/resume, errors
[ ] F11 Template registry (4 templates × 5 languages, Marathi verbatim), 4 channel drivers, orchestrator, dispatch log, Device Inbox

Quality
[ ] Unit + integration tests per Section 12
[ ] Empty, loading, unknown and error states everywhere
[ ] Responsive to 360px; farmer flows genuinely usable on a phone
[ ] Keyboard focus, aria-live on sync and alert regions, reduced-motion respected
[ ] /dev/api contract page with live request log
[ ] Audit log page
[ ] README: what is mocked, what is real, what production would need, and the demo script
```

### 15.3 The one-line test before you ship

> Pick any number on any screen. Can you point at the raw data that produced it, change that data, and watch the number change? If not, you have hardcoded something the judges will find.

**Now build it. Start with Phase 0 and work in order.**
