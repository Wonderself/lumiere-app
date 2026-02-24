# Lumiere App — Complete Feature Inventory

> **Ce fichier documente TOUTES les fonctionnalités du site.**
> **Doit être mis à jour à chaque ajout/modification de fonctionnalité.**
> **Ne JAMAIS supprimer une fonctionnalité sans la documenter ici.**

---

## 1. Authentication & User Management

### Registration & Login
- Email/password registration with role selection
- URL param auto-select role (e.g. `?role=SCREENWRITER`)
- Custom welcome for screenwriters: "Devenez Scenariste"
- Credential-based login via NextAuth 5
- JWT stateless sessions
- Password reset via token (1h expiry, email link)
- Profile updates (name, bio, skills, languages, wallet address)

### Route Protection (Middleware)
- Centralized middleware (`src/middleware.ts`) for auth route protection
- Protected: /dashboard/*, /admin/*, /profile/*, /tasks/*, /lumens/*, /notifications/*, /screenplays/*, /tokenization/*
- Admin role check on /admin/* (redirects non-admins to /dashboard)
- Unauthenticated users redirected to /login with callbackUrl

### Roles
| Role | Description |
|------|-------------|
| ADMIN | Full platform access, film/task management |
| CONTRIBUTOR | Can claim and complete micro-tasks |
| ARTIST | Specialized creative contributor |
| STUNT_PERFORMER | Motion capture / stunt tasks |
| VIEWER | Watch films, vote in community |
| SCREENWRITER | Submit and manage screenplays |
| CREATOR | Content creator (videos, social media) |

### Levels & Progression
- ROOKIE → PRO → EXPERT → VIP
- Points-based progression via task completion
- Reputation system with score and badges
- Reputation events: deadline met, quality rating, collabs, etc.

---

## 2. Film Production Pipeline

### Film Management (Admin)
- Create films with auto-generated phases
- Set genre, catalog, status, budget, public visibility
- Track progress (totalTasks, completedTasks, progressPct)
- Cover image, synopsis, description
- **AI Task Generator**: Admin can auto-generate genre-specific tasks via Film Decomposer
  - 13 base tasks + genre-specific tasks (Sci-Fi, Action, Drama, Horror, etc.)
  - Budget-aware pricing, assigned to correct production phases

### Production Phases (auto-generated per film)
1. SCRIPT
2. STORYBOARD
3. DESIGN
4. ANIMATION
5. VFX
6. SOUND
7. EDITING
8. COLOR
9. FINAL

Each phase has: status (LOCKED/ACTIVE/COMPLETED), order, dependencies

### Micro-Tasks
- **Types**: PROMPT_WRITING, IMAGE_GEN, VIDEO_REVIEW, STUNT_CAPTURE, DANCE_CAPTURE, DIALOGUE_EDIT, COLOR_GRADE, SOUND_DESIGN, CONTINUITY_CHECK, QA_REVIEW, CHARACTER_DESIGN, ENV_DESIGN, MOTION_REF, COMPOSITING, TRANSLATION, SUBTITLE
- **Difficulty**: EASY (50EUR), MEDIUM (100EUR), HARD (100EUR), EXPERT (500EUR)
- **Lifecycle**: AVAILABLE → CLAIMED → SUBMITTED → VALIDATED/REJECTED
- AI score + feedback on submission
- Human validation by admin after AI review
- Time-based task reassignment possible
- Comments system per task

---

## 3. Community & Blockchain Voting

### Scenario Proposals
- Users submit story ideas (title, logline, synopsis, genre)
- **Status flow**: SUBMITTED → SHORTLISTED → VOTING → WINNER → ARCHIVED
- Admin shortlists proposals for voting phase
- Premium subscribers only can vote
- Prize pool distributed to winner via Lumens
- All votes recorded on blockchain (SHA-256 proof)

### Trailer Contests
- Admin creates contests (title, prize pool, dates)
- Users submit video trailer entries
- **Status flow**: UPCOMING → OPEN → VOTING → CLOSED
- Any user can vote on entries
- Vote tally determines winners
- Prize distribution: 1st=60%, 2nd=25%, 3rd=15%
- All votes + results recorded on blockchain

### Blockchain Proof System
- SHA-256 hash-based proofs for all on-chain events
- Events: VOTE_CAST, VOTE_TALLY, PRIZE_DISTRIBUTED, CONTEST_CLOSED, CONTENT_REGISTERED
- Stored in BlockchainEvent table
- Ready for Polygon/Base smart contract integration
- Chain configurable via BLOCKCHAIN_NETWORK env var

---

## 4. Tokenization & Investment

### Film Token Offerings
- Create token offerings per film
- Soft cap / hard cap fundraising
- Token price, total tokens, projected ROI
- **Status**: DRAFT → PENDING_LEGAL → OPEN → FUNDED → CLOSED → SUSPENDED
- Legal structures: IL_EXEMPT, IL_PROSPECTUS, IL_SANDBOX
- Risk levels: LOW, MEDIUM, HIGH, VERY_HIGH

### Token Purchase
- KYC verification required (kycRequired flag)
- Accredited-only option
- Anti-whale limits (maxTokensPerUser)
- Lockup periods (lockedUntil date)
- Purchase tracking with status

### Secondary Market
- Token transfers between users
- Price per token tracking
- Transaction hash recording

### Governance
- Token holders create proposals
- Types: CASTING, SCRIPT_CHANGE, BUDGET_REALLOC, DISTRIBUTION, PARTNERSHIP, OTHER
- Voting with token weight
- Quorum requirement (default 30%)
- Results: PASSED, REJECTED, CANCELLED

### Revenue & Dividends
- Film revenue tracking (STREAMING, THEATRICAL, MERCH, LICENSING, SYNDICATION)
- Dividend distribution by period
- Token holders receive proportional share

---

## 5. Streaming Platform

### Catalog
- Film submission to streaming catalog
- **Status**: PENDING → APPROVED → REJECTED → LIVE
- View tracking (watch duration, completion %)
- Revenue share percentage per film
- Tags for discovery

### Contracts
- Revenue share terms
- Exclusivity options
- **Status**: PENDING → SIGNED → EXPIRED

### Payouts
- Monthly creator payouts based on views
- Amount in EUR, status tracking

---

## 6. Creator Content System

### Creator Profiles
- Stage name, niche, description
- Style: FACE, NOFACE, HYBRID
- Voice type, automation level
- Social media links

### AI Video Generation
- Script-based video generation
- **Status**: DRAFT → GENERATING → READY → PUBLISHED
- Token cost tracking

### Multi-Platform Publishing
- Platforms: TIKTOK, INSTAGRAM, YOUTUBE, FACEBOOK, X
- Scheduled publishing
- Social account management (handle, access token, followers)

---

## 7. Collaboration System

### Collab Requests
- Types: SHOUTOUT, CO_CREATE, GUEST, AD_EXCHANGE
- Escrow token system
- **Status**: PENDING → ACCEPTED → COMPLETED → CANCELLED

### Video Orders
- Client → Creator workflow
- Briefing with requirements
- **Status**: OPEN → CLAIMED → IN_PROGRESS → REVIEW → DELIVERED → DISPUTED
- Price in tokens

---

## 8. AI Actors & Bonus Content

### AI Actors
- Name, slug, avatar, bio
- Style: VERSATILE, DRAMATIC, COMEDY, ACTION
- Personality traits array
- Film cast roles (LEAD, SUPPORTING, CAMEO)
- Similar actors discovery

### Bonus Content
- Types: INTERVIEW, DELETED_SCENE, BTS, MAKING_OF
- Can be premium-only
- Linked to film or catalog film
- Optional actor association

---

## 9. Admin Panel

### Film Management
- Create/edit films with all details
- Manage phases and their dependencies
- Create/assign tasks per phase

### Task Submission Review
- View AI score and feedback
- Validate or reject with human feedback
- Configurable AI confidence threshold

### AI Integration (Claude Haiku 4.5)
- **AI Synopsis Generator**: "Generer avec l'IA" button in scenario submission form
  - Auto-generates logline + synopsis from title + genre
  - User can edit generated content before submitting
- **AI Scenario Analysis**: auto-analyzes scenarios on submission (async, non-blocking)
  - Score (0-100), analysis text, 3 suggestions
  - Results displayed on scenario detail page (green/yellow/red score badge)
- **AI Task Review**: evaluates task submissions with contextual scoring
  - Score, feedback, verdict (AI_APPROVED / AI_FLAGGED)
  - Falls back to mock when API unavailable

### Contest Management
- Create/edit contests
- Shortlist proposals for voting
- Tally votes and select winners
- Distribute prizes (recorded on-chain)

### Platform Settings
- AI confidence threshold (default 70%)
- Max concurrent tasks per user
- Bitcoin payments enable/disable
- Maintenance mode toggle
- Lumen pricing and reward per task
- Email notifications enable/disable

### Admin Todos
- Priority: LOW, MEDIUM, HIGH, URGENT
- Due dates, completion tracking

### Analytics
- User engagement metrics
- Task completion stats
- Revenue reports
- Dashboard with charts (area, bar, donut, line, sparkline)

---

## 10. Payments & Currency

### Payment Methods
- Stripe (credit card)
- Lightning Bitcoin
- On-chain Bitcoin
- Lumen (virtual currency)

### Lumen System
- Internal virtual currency
- Earn via task completion
- Spend on platform features
- Transaction history tracking
- Balance displayed in header

---

## 11. Notifications
- In-app notification system
- Unread count in header bell icon
- Mark as read functionality
- API endpoint for real-time count

---

## 12. Public Pages
- **Cinema** (`/cinema`) — Main landing with stats, films, services
- **Films** (`/films`) — Browse all public films
- **Film Detail** (`/films/[slug]`) — Full film info, interactive timeline, tasks, tokenization, JSON-LD SEO
- **Streaming** (`/streaming`) — Browse streaming catalog
- **Actors** (`/actors`) — Browse AI actors
- **Actor Profile** (`/actors/[slug]`) — Actor details, filmography
- **Community Hub** (`/community`) — Scenarios & contests
- **About** (`/about`) — Company info, team, philosophy, pipeline, business model
- **Invest** (`/invest`) — Investor landing page, metrics, advantages, comparison table, timeline
- **Roadmap** (`/roadmap`) — Product roadmap
- **Leaderboard** (`/leaderboard`) — User rankings
- **Public Profiles** (`/users/[id]`) — Creator profile, stats, skills, contributions, scenarios
- **Legal** — Terms, privacy, cookies

---

## 13. Public Funding Tracking
- French grants: subvention, avance, prêt, crédit d'impôt
- Organism and eligibility tracking
- Step-by-step application process
- Document requirements per step

---

## 14. Screenplays
- Screenplay submission
- AI scoring and feedback
- Modification tolerance tracking
- Status management

---

## 15. Netflix-Style Homepage (2026-02-24)

### Hero Banner
- Full-viewport auto-rotating film carousel (65-92vh responsive)
- Animated progress bar per slide with auto-advance (8s)
- Pause on hover, manual navigation arrows + dot navigation
- Cinematic multi-layer gradient overlays (left, bottom, top vignette)
- Film grain texture overlay
- Genre badge with gold accent line
- Action buttons: "Decouvrir" (gold gradient) + "Plus d'infos" (frosted glass)
- Smooth crossfade animation with framer-motion

### Film Rows
- Horizontal scrolling film card carousel
- Card features: 2:3 aspect ratio posters, rounded-xl, ring border, hover glow
- Status badges (colored by status) always visible
- Hover overlay: play button (gold gradient), title, genre, progress bar
- Scroll arrows appear on row hover
- Categories: Top 10, Notre Selection, En Production, Streaming, Genres, En Dev

### Top 10 Row
- Large overlapping numbered rankings (90-150px)
- Gold text-stroke numbers with drop shadow
- Poster overlaps number with negative margin
- Play button and film info on hover

### Creator Bar
- 4 interactive cards: Ecrire, Voter, Concours, Produire
- Background images with dark overlay + gradient per type
- Icon, title, description, CTA arrow on hover
- Top accent line + bottom border glow on hover
- Staggered animation on scroll into view

### Screenwriter CTA Section (NEW)
- "100 Scenaristes. Un Film." recruitment banner
- Benefits grid: Ecrivez, Communaute, Production, Blockchain
- Stats bar: 100 places, 1 film produit, royalties on-chain infini
- Motion animations on scroll
- CTA: "Candidater maintenant" linking to /register?role=SCREENWRITER

### Netflix Header
- Fixed, transparent → solid on scroll with backdrop blur
- Logo + 6 navigation links (Accueil, Films, Streaming, Communaute, Acteurs, Classement)
- Search icon, notifications, Lumens balance, user dropdown
- Mobile hamburger menu with slide-down animation
- Gold accent on active link

### Premium Footer
- 12-column grid layout (Brand, Plateforme, Contribuer, Legal)
- Lucide icons in navigation links
- Gold accent top line
- "Powered by Next.js, Claude AI, Blockchain" bar
- Cities: Paris, Tel Aviv, Hollywood

---

## 16. Consistent Design System

### Spacing
- All sections: `px-8 md:px-16 lg:px-20` (consistent horizontal padding)
- Section gaps: `mb-12 md:mb-16`
- Content max-width enforced via max-w-2xl on hero text

### Typography
- Headlines: Playfair Display, font-black, tracking-tight
- Body: Inter, text-white/45-90 for contrast hierarchy
- Sizes: 10px (labels) → 13px (body) → 2xl-5rem (hero titles)

### Colors
- Background: #0A0A0A (near-black)
- Gold primary: #D4AF37 (accent), #F0D060 (light), #8B6914 (dark)
- Status: Green (#10B981), Blue (#60A5FA), Purple (#A78BFA), Gray (#6B7280)
- Text: white with opacity scale (15-90%)

### Effects
- Card hover: scale 1.06, ring-[#D4AF37]/30, shadow
- Gradient buttons: linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37)
- Frosted glass: backdrop-blur-xl + bg-white/8
- Transitions: 300-500ms, ease [0.25, 0.1, 0.25, 1]

---

## 17. SEO & Structured Data
- **Metadata**: Dynamic titles, descriptions, OpenGraph, Twitter Cards per page
- **Sitemap**: Dynamic XML sitemap with static + film pages (`src/app/sitemap.ts`)
- **Robots.txt**: Allows public pages, blocks /admin/, /dashboard/, /api/ (`src/app/robots.ts`)
- **JSON-LD**: Organization schema on homepage, Movie schema on film detail pages
- **OpenGraph images**: Film cover images in og:image for social sharing

---

## 18. Deployment & Infrastructure
- **Docker multi-stage build**: deps → builder → runner (node:20-alpine)
- **Build-safe Prisma**: Lazy Proxy singleton, never connects at build time
- **Dockerfile**: Dummy DATABASE_URL during build, real env at runtime
- **Coolify**: Self-hosted on Hetzner (188.245.182.200), Traefik reverse proxy
- **force-dynamic**: All 52 Prisma-using pages marked for runtime rendering
- **Standalone output**: Next.js standalone mode for Docker deployment
- **Healthcheck**: curl-based Docker healthcheck on port 3000

---

## 19. Search System
- **Search Overlay** (`src/components/search-overlay.tsx`): Ctrl+K keyboard shortcut
- **Expandable search bar** in Netflix header (replaces static icon)
- **Real-time results** with 300ms debounce across 3 categories:
  - Films (title, genre, description) — public only
  - Tasks (title, description) — available only
  - Users (displayName, email) — all users
- **Server action** (`src/app/actions/search.ts`): Prisma parallel queries
- **Navigation**: Click any result to navigate to detail page

---

## 20. Screenwriter Dashboard
- **Dedicated page** (`/dashboard/screenwriter`): Full scenario management
- **Stats grid**: Total scenarios, total votes, average AI score, winners count
- **Voting alert**: Gold banner when scenarios are in active voting phase
- **Scenario list**: Status badges, AI scores, vote counts, creation dates, loglines
- **Status tracking**: SUBMITTED → SHORTLISTED → VOTING → WINNER → ARCHIVED
- **Tips section**: Best practices for writing good scenarios
- **Dashboard link**: Banner on main dashboard for SCREENWRITER and ADMIN roles

---

## 21. Film Production Timeline
- **Interactive component** (`src/components/film-timeline.tsx`)
- **Desktop horizontal bar**: Phase dots on progress track with status colors
- **Expandable vertical list**: Click phases to see tasks with prices and status
- **Task status dots**: Green (validated), gold (available), blue (claimed)
- **Phase indicators**: Completed (green checkmark), Active (gold pulse), Locked (gray lock)
- **Replaces** static phase display on film detail pages

---

## 22. Badge & Achievement System
- **13 badges** across 4 categories (`src/lib/achievements.ts`)
- **Contribution**: Premiere Lumiere (1st task), Marathonien (10), Centurion (100), Polyvalent (5 types)
- **Quality**: Perfectionniste (95%+ AI x3), Regulier (10 on-time), Zero Rejet (20 no rejections)
- **Community**: Scenariste (1st scenario), Scenariste Star (winner), Votant (5 votes), Parrain (3 referrals)
- **Special**: Early Adopter (first 100 users), Investisseur (token purchase)
- **Auto-award** triggers integrated in admin.ts, community.ts, referral.ts
- **BadgeShowcase component** (`src/components/badge-showcase.tsx`) — compact row or full grid
- **Displayed** on private profile page and public user profiles
- **Notifications** sent when a badge is earned

---

## 23. Referral System
- **Server actions** in `src/app/actions/referral.ts`
- `getReferralCode()` — Generates unique code (LUM-XXXXXX-XXXXX)
- `applyReferralCode()` — Links new user to referrer (PENDING status)
- `completeReferral()` — Awards 30 Lumens to referrer + 10 to referred user
- `getReferralStats()` — Returns referral count, completed count, total earnings
- **Dashboard page** at `/dashboard/referral` with:
  - How-it-works section (3 steps)
  - Copyable referral code and share link
  - Stats grid (total, active, Lumens earned)
  - Referral list with status indicators
- **Dashboard banner** linking to referral page on main dashboard
- **Lumen transactions** created for both parties
- **Notifications** sent to both referrer and referred

---

## 24. Level Progress Visualization
- **LevelProgress component** (`src/components/level-progress.tsx`)
- **4 levels**: ROOKIE (0 pts) → PRO (500) → EXPERT (2500) → VIP (10000)
- **Progress bar** showing current position within level range
- **Distance indicator** showing points needed for next level
- **Milestone markers** for all 4 levels
- **Compact mode** for inline use (just bar + labels)
- **Full mode** with detailed card view
- **Integrated** in private profile page (light theme) and public profiles (dark theme)

---

## 25. AI Task Description Enrichment
- **Server action** `enrichTaskDescriptionAction` in `src/app/actions/ai.ts`
- **Admin-only** — Uses Claude Haiku 4.5 to enhance task descriptions
- **Generates**: description, instructions, deliverables, quality criteria
- **Context-aware**: Uses task title, type, film genre, film title
- **JSON output** structured for direct use in task creation forms

---

## 26. Task Recommendation Engine
- **Server action** `getRecommendedTasks()` in `src/app/actions/recommendations.ts`
- **Skill-to-task-type mapping**: 16 user skills mapped to matching task types
  - e.g. "Image Generation" → IMAGE_GEN, CHARACTER_DESIGN, ENV_DESIGN
  - e.g. "QA / Review" → QA_REVIEW, CONTINUITY_CHECK, VIDEO_REVIEW
- **Difficulty filtering** by user level:
  - ROOKIE: EASY, MEDIUM | PRO: EASY, MEDIUM, HARD | EXPERT/VIP: MEDIUM, HARD, EXPERT
- **Scoring algorithm**: skill match (+10), previously completed type (+5), pay rate (+1 per 50€)
- **Returns** top 6 recommendations with: title, type, difficulty, price, film info, match score
- **Dashboard integration**: "Recommande pour vous" section with gold MATCH badges on skill-matched tasks
- **Fallback**: Shows nothing gracefully if no tasks available

---

## 27. Lumen Analytics
- **Stats cards** on Lumens page (`/lumens`) below balance card
- **4 metrics computed** from transaction history:
  - Total earned (green) — sum of positive transactions
  - Total spent (red) — sum of negative transactions
  - Task rewards (gold) — TASK_REWARD type transactions
  - Bonuses (purple) — BONUS type transactions
- **Color-coded cards** with matching icons (TrendingUp, TrendingDown, Sparkles, Coins)
- **Only shown** when user has at least one transaction

---

## 28. Notification Type Filters
- **URL-based filtering** on notifications page (`/notifications?type=TASK_VALIDATED`)
- **Filter pills**: Toutes, Validees, Rejetees, Paiements, Niveaux, Systeme
- **Active filter** highlighted with gold accent (`bg-[#D4AF37]/10 text-[#D4AF37]`)
- **Inactive filters** in subtle gray with hover state
- **Grouped by date**: Aujourd'hui, Hier, Plus ancien — groups with 0 items hidden

---

## 29. Leaderboard → Public Profiles Link
- **Clickable ranking rows** on leaderboard page (`/leaderboard`)
- Each row links to the user's public profile (`/users/{id}`)
- **Gold hover effect** on rows (`hover:border-[#D4AF37]/20`)
- **Top 3 podium** remains static cards; ranks 4+ are interactive links

---

## 30. Task Dependencies (DAG)
- **Dependency validation** in `claimTaskAction` (`src/app/actions/tasks.ts`)
- Tasks with `dependsOnIds` can only be claimed when all dependencies are VALIDATED
- **Phase gate**: task's phase must be ACTIVE (not LOCKED) to allow claiming
- **Enables**: sequential production pipeline where tasks unlock in order
- **Backward-compatible**: tasks with empty `dependsOnIds` array work as before

---

## 31. Automated Cron Maintenance
- **API endpoint** `GET /api/cron?key=CRON_SECRET` (`src/app/api/cron/route.ts`)
- **3 automated tasks**:
  1. **Expired task release**: CLAIMED tasks past 48h deadline → reset to AVAILABLE + notify user
  2. **Contest auto-close**: VOTING contests past endDate with autoClose=true
  3. **Phase auto-complete**: when ALL tasks in an ACTIVE phase are VALIDATED → complete phase, unlock next, update film progress
- **Secured** with CRON_SECRET env var
- **Returns** JSON with counts of each action taken
- Callable by Coolify cron, external service, or manually

---

## 32. Admin Payments CSV Export
- **API endpoint** `GET /api/admin/export-payments` — admin-only
- **CSV columns**: Date, Utilisateur, Email, Film, Tache, Montant EUR, Methode, Statut, Date Paiement, ID
- **Proper escaping**: quotes in fields handled with double-quote CSV convention
- **Dynamic filename**: `lumiere-paiements-YYYY-MM-DD.csv`
- **Export button** added to admin payments page with Download icon

---

## 33. Contributor Earnings Dashboard
- **Page** at `/dashboard/earnings` (`src/app/(dashboard)/dashboard/earnings/page.tsx`)
- **Stats cards**: total earned, pending amount, completed payments count, Lumen balance
- **Monthly revenue chart**: bar graph of last 6 months with gold gradient
- **Payment history list**: each payment with task info, film, amount, date, status badge
- **Status labels**: Paye (green), En attente (yellow), En cours (blue), Echoue (red)
- **Empty state**: CTA linking to task marketplace
- **Dashboard banner**: earnings link on main dashboard with green gradient

---

## 34. Monthly Themed Contests
- **12 monthly themes** defined in `src/app/actions/community.ts`:
  - Jan: Nouveau Depart | Fev: Amour & Connexion | Mar: Femmes de Cinema
  - Avr: Nature & Environnement | Mai: Travail & Passion | Jun: Musique & Rythme
  - Jul: Aventure Estivale | Aou: Science-Fiction | Sep: Rentree des Createurs
  - Oct: Frissons & Mystere | Nov: Memoire & Heritage | Dec: Lumiere & Espoir
- **`createMonthlyContestAction`**: admin action, 1-click contest creation
- **Duplicate prevention**: checks if contest already exists for current month
- **Default config**: 500 EUR prize pool, 60/25/15% distribution, auto-close enabled
- **Integrated** with existing trailer contest system (entries, votes, prize distribution)

---

## 35. Redis Cache & Performance
- **`getCached()`** from `src/lib/redis.ts` applied to high-traffic public pages:
  - Films hero stats (filmsCount, tasksCount, contributorsCount) — 5 min TTL
  - Leaderboard top 50 users — 2 min TTL
  - Leaderboard global stats (users, tasks, paid) — 5 min TTL
  - Community stats (votes, scenarios, contests, entries) — 3 min TTL
- **Graceful degradation**: if Redis unavailable, falls back to direct Prisma query
- **No user impact**: cache-miss still returns fresh data, just slightly slower
- **Significant load reduction** on PostgreSQL for frequently-accessed public pages
