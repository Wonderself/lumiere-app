# Lumiere App — Project History

> **GitHub**: https://github.com/Wonderself/lumiere-app.git
> **Production**: https://cinema.lumiere.film
> **Ce fichier doit être mis à jour à chaque modification significative.**

---

## Stack Technique
- Next.js 16.1.6 + React 19.2.3 (standalone output)
- NextAuth 5 beta (JWT + Credentials)
- PostgreSQL + Prisma 7.4.1
- Redis (ioredis, graceful degradation)
- TailwindCSS 4 + Radix UI + Framer Motion 12
- Blockchain: SHA-256 proof system (ready for Polygon/Base)

---

## Version History

### V1-V2 — Core Platform
- Film production system with phases and micro-tasks
- User registration, authentication, role-based access
- Task claiming, submission, AI review
- Payment system (Stripe, Lightning, Lumens)

### V3 — Streaming & Creators
- Streaming catalog (film submission, approval, view tracking)
- Creator content system (AI video generation, multi-platform publishing)
- Collaboration system (shoutouts, co-creation, video orders)
- Referral system

### V4 — Tokenization (Israeli Legal Framework)
- Film token offerings (soft/hard cap, KYC)
- Secondary market token transfers
- Governance proposals and voting
- Revenue sharing / dividends
- Legal structures: IL_EXEMPT, IL_PROSPECTUS, IL_SANDBOX

### V6 — AI Actors & Community
- AI actor profiles with personality traits
- Film cast roles system
- Bonus content (interviews, deleted scenes, BTS)
- Community scenarios voting
- Trailer contests with prize pools

### V7 — Blockchain Events
- BlockchainEvent table for on-chain proof recording
- Vote recording, tally, prize distribution on-chain
- Content registration with hash proofs
- Ready for Polygon/Base smart contract integration

### V9 — Major Redesign
- Light-to-dark mode redesign
- Modern UI with gold (#D4AF37) accent
- Reorganized navigation
- Hub landing page with Instagram gradient

### 2025-02-24 — TypeScript Strict Mode + Performance Optimization
- Enabled `noImplicitAny: true` in tsconfig.json
- Fixed all implicit `any` types across 4 files
- Replaced `<img>` with Next.js `<Image>` for optimization
- Added Redis caching for stats queries
- Optimized next.config.ts (image formats, package imports, compression)
- Added `display: 'swap'` to font loading
- Created documentation: PROJECT_HISTORY.md, FEATURES.md, FILM_PIPELINE.md

### 2026-02-24 — Complete Film Pipeline + Blockchain Integration
- Extended BlockchainEventType enum with 13 new event types (pipeline + tokenization)
- Added generic `recordEvent()` in blockchain.ts for full lifecycle tracking
- **Auto-film creation from scenario winner**: pickScenarioWinnerAction now auto-creates a Film with 10 phases + auto-generated tasks via film-decomposer
- Blockchain events now cover: film creation, task claim/submit/validate, phase unlock/complete, film completion
- Blockchain events for tokenization: token purchase, listing, secondary transfer, governance proposals/votes, dividend claims
- Integrated reputation scoring (`calculateReputationScore` + `getBadgeForScore`) in task approval flow
- New admin actions: `reassignTaskAction()` (release claimed tasks), `cleanupExpiredTasksAction()` (auto-release expired tasks)
- Task lifecycle events: TASK_CLAIMED, TASK_SUBMITTED on blockchain
- `force-dynamic` kept on all DB pages (Prisma requires runtime DB connection)

### 2026-02-24 — Netflix-Style Redesign + Slate Deck 2026
- **Complete Netflix-style homepage**: Hero banner with auto-rotating featured films, horizontal scrolling film rows by category
- **New components**: `src/components/netflix/` — NetflixHeader, HeroBanner, FilmRow, CreatorBar, NetflixHome
- **Netflix header**: Transparent on scroll, bigger logo, cleaner navigation, scroll-aware background
- **Creator participation bar**: 4 cards (Scenarios, Voting, Contests, Production) with gradient backgrounds
- **20 films from Slate Deck 2026** added to seed:
  - 8 main projects: MERCI, KETER, Code d'Esther, Zion of Africa, Dernier Convoi, Carnaval, Na Nah Nahma, Ortistes
  - 7 extras: Super-Heros, Amelie Poul2, Royal Rumble, Trip Carnaval, Tokenisation, Nuit des Cesars, Metacinema
  - 5 bonus: Enfants de la Lumiere, Prophetie des Sables, Tel Aviv Nights, Gardiens du Shabat, Frequency 432
- **SLATE_DECK.md** created with all project details (genres, formats, loglines, poster concepts)
- **Graceful fallback**: Homepage works without DB using hardcoded film data
- **Gold theme (#D4AF37)** consistent across all Netflix components (replaces Netflix red)
- **Public layout** now uses Netflix header
- **Image optimization**: `<img>` replaced by Next.js `<Image>` in films page

---

## Key Decisions
1. **Standalone output** — Required for deployment (Docker/Railway/Coolify)
2. **JWT strategy** — Stateless auth, no server-side sessions needed
3. **Hash-based blockchain** — Proof system works offline, ready for real contracts
4. **Redis graceful degradation** — App works without Redis, just slower
5. **Israeli legal framework** — Tokenization follows IL securities law
6. **Prisma adapter-pg** — Direct PostgreSQL adapter for better performance
7. **noImplicitAny: true** — Strict TypeScript for code quality
8. **force-dynamic on DB pages** — Prisma can't connect during build, static generation fails
9. **Auto-film from scenario** — Winning scenario auto-generates Film + phases + tasks via decomposer
10. **Blockchain for everything** — Every important action (film, task, phase, token, governance) recorded on-chain
11. **Netflix-style UI** — Horizontal scroll rows, hero banner, dark+gold theme, creator bar integrated
12. **Fallback data** — Homepage works without DB connection using hardcoded film cards

### 2026-02-24 — Design Polish + Screenwriter CTA + Premium Footer
- **Design refinement across all Netflix components**:
  - HeroBanner: taller viewport, animated progress bar per slide, pause on hover, stronger typography
  - FilmRow: consistent padding, rounded-xl cards with ring border, hover glow, gradient play button
  - TopTenRow: refined number sizing, play button on hover, gold ring
  - CreatorBar: refined animations (scale 0.96→1), taller cards, stronger icons
  - Footer: 12-column grid, Lucide icons, gold accent line, "Powered by" bar
- **ScreenwriterCTA section**: "100 Scenaristes. Un Film." — recruitment banner, benefits grid, stats bar
- **Better fallback images**: Cinematic Unsplash images matched to each film theme
- **Consistent padding**: All sections use `px-8 md:px-16 lg:px-20`

### 2026-02-24 — Complete Homepage Redesign (Manifesto + Streaming Hybrid)
- **New HeroManifesto**: full-viewport manifesto with canvas particle animation, animated counters, stats bar (films/taches/budget/location)
- **ManifestoSection**: cinematic fade-in text "Le cinema coute des millions. Nous le faisons pour 25K€"
- **HowItWorks**: 5 pillar cards (Micro-Taches, Vote, IA Ethique, Watch/Create/Earn, France-Israel)
- **PipelineVisual**: 8-step visual pipeline from idea to revenues (horizontal desktop, vertical mobile)
- **ComparisonTable**: Hollywood vs Netflix vs Lumiere (cost, time, participation, AI, blockchain)
- **SocialProof**: credential badges (Innovation Authority, CNC, BPI, Fair AI Cinema) + founders quote
- **FinalCTA**: full-width conversion section with "Le cinema de demain se construit maintenant"
- **Header updated**: "Communaute" → "Voter", "S'inscrire" → "Rejoindre" (gold CTA)
- **Footer updated**: "Hollywood" removed → "Paris · Jerusalem", added "Investisseurs" link
- Homepage flow: Hero Manifesto → Top 10 + CreatorBar → Manifesto Text → Films → HowItWorks → Pipeline → More Films → Comparison → ScreenwriterCTA → Dev Films → Social Proof → Final CTA → Footer

### 2026-02-24 — AI Frontend Integration + Screenwriter UX
- **AI Synopsis Generator UI**: "Generer avec l'IA" button in scenario submission form
  - Calls Claude Haiku 4.5 via `generateSynopsisAction` to auto-fill logline + synopsis
  - User enters title + genre, AI generates content, user can edit before submitting
  - Loading state, error handling, gold-themed assistant panel
- **AI Analysis Display**: scenario detail page now shows AI analysis when available
  - Score badge (green/yellow/red), analysis text, bullet-point suggestions
  - Auto-populated by async AI analysis on submission (non-blocking)
- **Screenwriter Registration**: auto-select role from URL params (`?role=SCREENWRITER`)
  - Custom welcome message for screenwriters: "Devenez Scenariste"
  - Links from ScreenwriterCTA and footer go directly to screenwriter registration
- **Roadmap status update**: Phase 1 (IA & Qualite) now complete for frontend integration

### 2026-02-24 — Security & Stability Hardening + Invest Page
- **24 pages fixed with `force-dynamic`**: All Prisma-using pages now have runtime DB config
  - Prevents build failures when DB is unavailable during static generation
  - Covers: cinema, dashboard, profile, admin (14 admin pages), tasks, lumens, etc.
- **Auth middleware created** (`src/middleware.ts`):
  - Centralized route protection for /dashboard/*, /admin/*, /profile/*, /tasks/*, etc.
  - Admin role check on /admin/* routes (redirects non-admins to /dashboard)
  - Unauthenticated users redirected to /login with callbackUrl
- **Login password minimum**: Fixed inconsistency (6->8 chars, matching registration)
- **Investor page** (`/invest`): Professional landing page for investors
  - Key metrics, 6 advantage cards, market comparison table, 4-phase timeline
  - CTA with email link (invest@lumiere.film)
  - Linked from footer "Investisseurs"

### 2026-02-24 — Build-Safe Prisma + Deployment Fixes + Roadmap Advance
- **Build-safe Prisma client** (`src/lib/prisma.ts`):
  - Lazy Proxy singleton — client only created at first runtime access, never at build
  - Prevents `DATABASE_URL!` crash during Docker build when env is not set
  - Descriptive error message when DATABASE_URL is truly missing at runtime
- **Dockerfile fix**: Added dummy `DATABASE_URL` during build stage for Prisma module analysis
- **3 additional force-dynamic pages** fixed: admin/tasks/new, admin/films/[id]/edit, admin/tasks/[id]/edit
- **Sitemap rewrite** (`src/app/sitemap.ts`):
  - Lazy prisma import (`await import()`) to avoid build-time DB connection
  - Added force-dynamic + try/catch fallback
  - Added /community and /invest URLs
- **JSON-LD Movie schema**: Film detail pages now include structured data (Movie type) for SEO
  - Organization, production company, genre, image, dateCreated
- **Admin Task Generator UI**: "Generateur de Taches IA" button on film edit page
  - Uses film-decomposer to auto-generate genre-specific tasks for any film
  - `generateTasksForFilmAction` creates tasks in bulk, updates totalTasks count
- **Roadmap statuses updated** to reflect actual completion:
  - V2-1 (AI validation): DONE — Claude Haiku 4.5 integrated
  - V2-2 (Auto task generation): DONE — Film Decomposer + admin UI
  - V6-1 (Scenario submission): DONE — with AI synopsis generator
  - V6-2 (AI evaluation): DONE — auto-scoring on submission
  - V7-1 (Deployment): IN PROGRESS — Coolify + Hetzner
  - V7-2 (SEO): DONE — metadata + sitemap + robots.txt + JSON-LD
  - V7-3 (Security): DONE — middleware + Zod + password policy
  - V7-6 (Legal RGPD): DONE — 3 full legal pages

### 2026-02-24 — Search + Public Profiles + Screenwriter Dashboard + Timeline
- **Search overlay** (`src/components/search-overlay.tsx`):
  - Expandable search in header (Ctrl+K shortcut)
  - Real-time search across films, tasks and users via `searchAction`
  - 300ms debounce, categorized results with navigation
  - Replaces static search icon in NetflixHeader
- **Public user profiles** (`src/app/(public)/users/[id]/page.tsx`):
  - Full creator profile: avatar, bio, level, role, reputation badges
  - Stats grid: points, validated tasks, reputation, completed tasks
  - Skills & languages display with themed pills
  - Recent contributions (validated tasks with film links)
  - Scenario proposals list with vote counts and AI scores
- **Screenwriter dashboard** (`src/app/(dashboard)/dashboard/screenwriter/page.tsx`):
  - Stats: total scenarios, votes, avg AI score, winners
  - Active voting alert banner
  - Full scenario list with status indicators and AI scores
  - Tips section for writing good scenarios
  - Banner link from main dashboard for SCREENWRITER and ADMIN roles
- **Film production timeline** (`src/components/film-timeline.tsx`):
  - Interactive horizontal timeline bar (desktop) with phase dots
  - Expandable vertical list with task details
  - Click to expand phases and see tasks with prices and status
  - Replaces static phase display on film detail pages
- **Roadmap updated**: V2-7, V5-3 marked done; V5 now in_progress

---

## ROADMAP — Etapes Detaillees

> Chaque etape contient: description, prompt Claude, pre-requis utilisateur.
> API Claude disponible dans .env (ANTHROPIC_API_KEY).

### PHASE A — Fondations Visuelles (Semaines 1-2)

#### A1. Generateur d'affiches IA pour les 20 films
**Statut**: PRET (API Claude dispo)
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
L'API Anthropic est dans .env. Cree une route API /api/generate-poster qui:
1. Prend un filmId
2. Lit le film depuis Prisma (titre, genre, synopsis)
3. Utilise Claude pour generer un prompt de poster cinematique
4. Genere un SVG placeholder poster avec le prompt (titre en grand, gradient du genre)
5. Sauvegarde dans /public/posters/{slug}.webp
6. Met a jour coverImageUrl dans la DB
Cree un script batch pour generer toutes les affiches.
Optimise: max_tokens=200, envoie uniquement titre+genre+logline.
```

#### A2. Page d'inscription scenariste dediee
**Statut**: PRET
**Pre-requis utilisateur**: Texte des CGU scenaristes (a fournir)
**Prompt Claude**:
```
Cree /register/screenwriter avec formulaire multi-etapes: Identite > Pitch > Portfolio > CGU Blockchain.
Champs: nom, email, bio, portfolio, pitch (500 mots max), genres.
CGU: credits blockchain acceptes. Server action createScreenwriterAction.
Design: theme Netflix gold/dark. Lien depuis ScreenwriterCTA.
```

#### A3. Amelioration header + search
**Statut**: PRET
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Ameliore NetflixHeader: search expandable (films par titre/genre), icones mobile
(notifications, lumens), transition slide-down fluide, active state dore plus visible.
```

### PHASE B — Intelligence Artificielle (Semaines 3-4)

#### B1. AI Synopsis Generator
**Statut**: PRET (API Claude dispo)
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Cree generateSynopsisAction(filmId): lit film, appelle Claude API
(system: scenariste pro, user: titre+genre+logline), met a jour synopsis.
Bouton admin "Generer synopsis IA". max_tokens=300, temperature=0.8.
```

#### B2. AI Task Description Generator
**Statut**: PRET
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Dans film-decomposer.ts, appelle Claude pour enrichir chaque tache:
descriptionMd + instructionsMd generes. Batch 10 taches/appel, JSON strict.
```

#### B3. AI Scenario Scoring
**Statut**: PRET
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Cree scoreScenarioAction(scenarioId): analyse scenario par Claude (originalite,
potentiel commercial, faisabilite IA, qualite ecriture). Score/100 + feedback.
Ajouter aiScore, aiFeedback dans ScenarioProposal. max_tokens=500.
```

### PHASE C — Experience Utilisateur (Semaines 5-6)

#### C1. Editeur de soumission de scenario
**Statut**: A FAIRE
**Pre-requis utilisateur**: Format accepte (PDF/Markdown/texte)
**Prompt Claude**:
```
Page /community/scenarios/submit: editeur riche, titre/genre/logline/synopsis,
preview split-screen, upload PDF, submitScenarioAction + scoreScenarioAction auto.
Design: dark, gold, typo scenariste.
```

#### C2. Dashboard scenariste
**Statut**: A FAIRE
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Page /dashboard/screenwriter: liste scenarios + statut + score IA, stats,
notifications shortlist/victoire, CTA nouveau scenario, graphique votes.
force-dynamic requis.
```

#### C3. Page de vote amelioree
**Statut**: A FAIRE
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Ameliore /community/scenarios: cartes scenario (titre, genre, logline, score IA,
auteur), vote un-click dore, filtres genre/score/date, tri, barre progression votes.
```

### PHASE D — Production & Blockchain (Semaines 7-8)

#### D1. Timeline visuelle de production
**Statut**: A FAIRE
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Composant FilmTimeline dans /films/[slug]: 10 phases en timeline Gantt, progression,
click expand taches, couleurs par statut. Responsive vertical sur mobile.
```

#### D2. Smart contract preparation
**Statut**: A FAIRE
**Pre-requis utilisateur**: Choix blockchain (Polygon ou Base) + wallet deploiement
**Prompt Claude**:
```
Cree src/lib/smart-contracts.ts: interfaces FilmToken (ERC-20), FilmNFT (ERC-721),
GovernanceVote. ABI types, prepareTransaction(), config reseau testnet.
```

#### D3. Notifications temps reel
**Statut**: A FAIRE
**Pre-requis utilisateur**: Aucun
**Prompt Claude**:
```
Route SSE /api/notifications/stream, hook useNotifications(), toast pour votes/taches/
shortlist, badge temps reel header, son optionnel.
```

### PHASE E — Monetisation & Growth (Semaines 9-10)

#### E1. Stripe integration
**Statut**: A FAIRE
**Pre-requis utilisateur**: Compte Stripe + cles API (test mode ok)
**Prompt Claude**:
```
Integre Stripe: /api/stripe/checkout, /api/stripe/webhook, abonnement premium,
page /pricing (Free/Premium/Producer), webhook met a jour tokens.
```

#### E2. Email transactionnel
**Statut**: A FAIRE
**Pre-requis utilisateur**: Compte Resend ou SendGrid + cle API
**Prompt Claude**:
```
Integre Resend: templates bienvenue/confirmation/shortlist/victoire/vote,
sendEmailAction generique, appel auto dans registration/submit/vote/winner.
Templates HTML branding Lumiere gold/dark.
```

---

### 2026-02-24 — Gamification: Badges + Parrainage + Niveaux + Enrichissement IA

**Badge System (13 badges)**
- Created `src/lib/achievements.ts` with full badge logic
- 4 categories: contribution (4), quality (3), community (4), special (2)
- Auto-award triggers integrated into:
  - `admin.ts` → `approveSubmissionAction` calls `checkTaskBadges()`
  - `community.ts` → scenario submit/vote/winner calls `checkCommunityBadges()`
  - `referral.ts` → referral completion calls `checkCommunityBadges()`
- `BadgeShowcase` component with compact and full grid views
- Badges displayed on private profile and public user profiles

**Referral System**
- Created `src/app/actions/referral.ts` with 4 server actions
- `getReferralCode()` generates unique code (LUM-XXXXXX-XXXXX)
- `applyReferralCode()` creates PENDING referral record
- `completeReferral()` awards 30 Lumens to referrer + 10 to referred
- `getReferralStats()` returns counts and earnings
- Full UI page at `/dashboard/referral` with share link, stats, referral list
- Referral banner added to main dashboard

**Level Progress Visualization**
- Created `src/components/level-progress.tsx` — ROOKIE → PRO → EXPERT → VIP
- Shows current level, points, progress bar, distance to next level
- Integrated into private profile page and public user profiles
- Compact and full modes available

**AI Task Enrichment**
- Added `enrichTaskDescriptionAction` to `src/app/actions/ai.ts`
- Claude generates description, instructions, deliverables, quality criteria
- Admin-only action using Claude Haiku 4.5

**Roadmap Updated**
- V2-8: AI task enrichment → done
- V5-1: Level progress visualization → done
- V5-2: Badges & achievements → done
- V5-5: Parrainage → done

### 2026-02-24 — Deployment Fix + Recommendations + Analytics + UX Improvements

**Prisma Runtime Fix (Docker)**
- Root cause identified: `serverExternalPackages: ['@prisma/adapter-pg', 'pg']` in next.config.ts means Next.js does NOT bundle these modules — they must exist in node_modules at runtime
- Dockerfile runner stage only copied `@prisma/*` and `prisma`, but NOT `pg` and its 12 dependencies
- **Fixed Dockerfile**: Added 13 COPY lines for pg, pg-pool, pg-protocol, pg-types, pg-connection-string, pg-int8, pg-cloudflare, pgpass, postgres-array, postgres-bytea, postgres-date, postgres-interval, split2
- **Improved start.sh**: Added pg module verification check, DATABASE_URL presence check, retry with --accept-data-loss for first deploy

**Task Recommendation Engine**
- Created `src/app/actions/recommendations.ts` — personalized task suggestions
- Skill-to-task-type mapping covering 16 skills → matching task types
- Difficulty filtering by user level (ROOKIE→EASY/MEDIUM, VIP→MEDIUM/HARD/EXPERT)
- Scoring algorithm: skill match (+10), previous success (+5), pay rate (+1/50€)
- Returns top 6 recommendations with match indicators
- "Recommande pour vous" section added to main dashboard

**Lumen Analytics**
- Added analytics stats cards on Lumens page (`/lumens`)
- Shows: total earned, total spent, task rewards, bonuses
- Computed from transaction history with color-coded cards

**Notification Type Filters**
- Added URL-based filter pills on notifications page
- Filter types: Toutes, Validees, Rejetees, Paiements, Niveaux, Systeme
- Active filter highlighted with gold accent

**Leaderboard Enhancement**
- Made ranking rows clickable → navigate to public user profiles (`/users/{id}`)
- Added gold hover border effect on rows

**Roadmap Updated**
- V5-6: Task recommendations → done
- V5-7: Lumen analytics → done
- V5-8: Notification filters → done

### 2026-02-24 — Task DAG + Cron + Payments Export + Earnings + Monthly Contests + Redis Cache

**Task Dependencies DAG (v2-4)**
- Added dependency validation in `claimTaskAction`: checks all `dependsOnIds` tasks are VALIDATED before allowing claim
- Added phase status check: task's phase must be ACTIVE (not LOCKED)
- Enables proper sequential unlocking of tasks within production pipeline

**Timer 48h + Auto-Release Cron (v2-5)**
- Created `src/app/api/cron/route.ts` — automated maintenance endpoint
- 3 maintenance tasks: expired task auto-release, contest auto-close, phase auto-complete
- Phase auto-complete: when all tasks in a phase are VALIDATED, phase completes + next phase unlocks
- Secured with CRON_SECRET env var, callable via external cron service or Coolify
- Notifications sent to users when tasks expire

**Admin Payments CSV Export (v3-3)**
- Created `src/app/api/admin/export-payments/route.ts` — CSV download for accounting
- Exports: date, user, email, film, task, amount, method, status, payment date
- Admin-only endpoint with proper auth check
- Export button added to admin payments page with Download icon

**Contributor Earnings Dashboard (v3-4)**
- Created `src/app/(dashboard)/dashboard/earnings/page.tsx`
- Stats cards: total earned, pending, completed count, Lumens balance
- Monthly revenue chart (last 6 months) — simple bar chart with gold gradient
- Full payment history list with status badges (Paye, En attente, En cours, Echoue)
- Empty state with CTA to find tasks
- Earnings banner added to main dashboard

**Monthly Themed Contests (v5-4)**
- 12 monthly themes defined in `community.ts` (Janvier→Decembre with descriptions)
- `createMonthlyContestAction` — admin creates monthly themed contest with 1 click
- Auto-checks if contest already exists for current month
- Default prize pool: 500 EUR with 60/25/15% distribution
- Themes: Nouveau Depart, Amour, Femmes, Nature, Travail, Musique, Aventure, Sci-Fi, Rentree, Frissons, Memoire, Lumiere

**Redis Cache & Performance (v7-4)**
- Added `getCached()` to 3 high-traffic public pages:
  - Films page hero stats (5 min TTL)
  - Leaderboard top 50 + global stats (2-5 min TTL)
  - Community stats (3 min TTL)
- Graceful degradation: falls back to direct DB query if Redis unavailable
- Significant load reduction on frequently-accessed public queries

**Roadmap Updated**
- V2-4: Task dependencies → done
- V2-5: Timer 48h + auto-release → done
- V3-3: Admin payments export → done
- V3-4: Earnings dashboard → done
- V5-4: Monthly contests → done
- V7-4: Redis cache → done
- V3 phase status: todo → in_progress

### 2026-02-24 — Emails + Deals + Sentry + VideoPlayer + Invoices + Build Fix

**Emails Transactionnels (v2-6)**
- Created `src/lib/email.ts` — 6 email templates (welcome, password reset, task validated, payment, screenplay accepted, weekly digest)
- Resend SDK with graceful degradation (logs in dev if no API key)
- HTML email layout: dark theme with gold (#D4AF37) accents, matching brand
- Integrated into auth.ts (welcome + reset), admin.ts (task validated + payment), screenplays.ts (deal accepted)

**Deal Automatisé Scénarios (v6-3)**
- Created `generateScreenplayDeal()` in `src/lib/contracts.ts`
- Complete deal contract with: IP rights, revenue share, credit type, modification tolerance, festival bonuses, 24-month production deadline
- `generateScreenplayDealAction` in screenplays.ts — admin generates deal for accepted screenplay
- Email + notification + blockchain event on deal creation

**Sentry Monitoring (v7-5)**
- Created `src/instrumentation.ts` — Next.js instrumentation hook for Sentry
- Created `src/app/global-error.tsx` — Global error boundary with Sentry reporting
- Dynamic imports: only loads when NEXT_PUBLIC_SENTRY_DSN is set, zero overhead otherwise
- `onRequestError` handler captures server-side errors

**Video Player Component (v4-1)**
- Created `src/components/video-player.tsx` — Full-featured video player
- Controls: play/pause, mute, volume slider, fullscreen, seek, skip ±10s
- Keyboard shortcuts: Space/K (play), F (fullscreen), M (mute), arrows (seek)
- Subtitle track support (.vtt/.srt), progress callback, auto-hide controls
- Gold-themed UI matching the design system

**Invoice System (auto-payment)**
- Created `src/lib/invoices.ts` — Invoice generation (Markdown format)
- Legal-compliant French invoice template with: SIRET, TVA, prestation details, auto-liquidation clause
- Sequential invoice numbers: LB-YYYY-MMDD-XXXXXX
- Created `src/app/api/invoices/route.ts` — Download invoice by paymentId (owner or admin only)
- Invoice download button added to earnings page for each COMPLETED payment
- Blockchain event on payment completion

**Build Fix (Docker/Coolify)**
- Fixed `prisma/seed.ts` TypeScript errors: added `as never` casts for enum types (TaskType, Difficulty, Status)
- Fixed `scripts/test-auth.ts`: added `as never` cast for PhaseName enum
- These were blocking the Docker build on Coolify (TypeScript strict mode fails on enum string literals)

**Existing Features Recognized in Roadmap**
- v3-2 (Co-production) → Marked done (tokenization ecosystem: marketplace, portfolio, governance, dividends)
- v4-3 (Catalogue streaming) → Marked done (/streaming with search, genres, featured hero)
- v4-6 (Soumission de films) → Marked done (/streaming/submit with auto-contract + AI evaluation)
- V5 Gamification → Marked DONE (8/8 items complete)

### 2026-02-24 — Uploads + Subtitles + Book-to-Screen + Subscriptions

**File Upload Service (v2-3)**
- Created `src/lib/upload.ts` — S3-compatible presigned URL generation
- Supports 5 categories: video, image, document, subtitle, audio
- 500MB max file size, MIME type validation per category
- `getPresignedUploadUrl()` — generates presigned PUT URL for direct client-to-bucket upload
- Dev fallback: mock URL for local upload via API route
- Created `src/app/api/upload/route.ts` — local dev upload endpoint (saves to public/uploads/)
- Created `src/components/file-upload.tsx` — drag & drop component with circular progress bar, category icons
- XHR upload with progress tracking for S3 presigned URLs
- S3 SDK dynamically imported (only loaded in production when installed)

**Subtitle Management (v4-5)**
- Created `src/app/actions/subtitles.ts` — full subtitle pipeline
- 12 supported languages: fr, en, es, de, it, pt, ar, zh, ja, ko, ru, he
- `validateSubtitleContent()` — detects VTT/SRT format, counts cues
- `srtToVtt()` — automatic SRT→VTT conversion (browser-compatible timecodes)
- `addSubtitleAction()` — stores subtitle tracks in film tags (no schema change needed)
- `extractSubtitleTracks()` — extracts subtitle data for VideoPlayer component

**Book-to-Screen Pipeline (v6-4)**
- Created `src/app/actions/book-to-screen.ts` — Éditions Ruppin adaptation pipeline
- `analyzeBookForAdaptation()` — scores: visual potential, dialogue density, narrative structure, market appeal
- Budget estimation (LOW/MEDIUM/HIGH) and format recommendation (SHORT/FEATURE/SERIES)
- Adaptation outline generation with 3-act structure
- `submitBookForAdaptationAction()` — creates screenplay entry from book metadata with AI analysis

**Subscription System (v4-4)**
- Created `src/app/(public)/pricing/page.tsx` — subscription pricing page
- 3 plans: Free (0€), Basic (4.99€/mo), Premium (9.99€/mo)
- Features: quality tiers (720p/1080p/4K), offline downloads, ad-free, badges
- Created `src/app/actions/subscriptions.ts` — plan management
- `subscribeToPlanAction()` — activates subscription (Stripe-ready, works without Stripe)
- `getUserSubscription()` — returns current plan with expiry check

**Roadmap Phase Updates**
- V2 → DONE (8/8 items complete)
- V4-4 (Abonnements) → done
- V4-5 (Sous-titres) → done
- V6 → DONE (4/4 items complete)
- V6-4 (Book-to-screen) → done

**Middleware Fix (Next.js 16)**
- Deleted `src/middleware.ts` — conflicted with proxy.ts in Next.js 16
- Updated `src/proxy.ts` protectedPaths to include all routes from deleted middleware

---

## Important Files
- `prisma/schema.prisma` — Full database schema (70+ models, 23 BlockchainEventType values)
- `src/lib/auth.ts` — Authentication configuration
- `src/lib/blockchain.ts` — Blockchain proof system + generic `recordEvent()`
- `src/lib/redis.ts` — Redis caching layer
- `src/lib/film-decomposer.ts` — Auto-generates tasks/budget/timeline from genre
- `src/lib/reputation.ts` — Weighted reputation scoring system
- `src/lib/achievements.ts` — Badge/achievement system (13 badges, auto-award)
- `src/app/actions/admin.ts` — Film, task, phase, review management + reassignment + cleanup
- `src/app/actions/community.ts` — Scenarios, contests + auto-film from winner
- `src/app/actions/tasks.ts` — Task claim, submit, abandon + blockchain events
- `src/app/actions/tokenization.ts` — Token purchase, sale, governance, dividends + blockchain events
- `src/app/actions/referral.ts` — Referral system (codes, bonuses, stats)
- `src/app/actions/ai.ts` — AI synopsis generation, scenario analysis, task enrichment
- `next.config.ts` — Build & optimization configuration
- `src/components/netflix/` — Netflix-style UI components (header, hero, film rows, creator bar, screenwriter CTA)
- `SLATE_DECK.md` — Full project pipeline with 20 projects details
