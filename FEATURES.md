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
- **Film Detail** (`/films/[slug]`) — Full film info, phases, tasks, tokenization
- **Streaming** (`/streaming`) — Browse streaming catalog
- **Actors** (`/actors`) — Browse AI actors
- **Actor Profile** (`/actors/[slug]`) — Actor details, filmography
- **Community Hub** (`/community`) — Scenarios & contests
- **About** (`/about`) — Company info, team, philosophy, pipeline, business model
- **Invest** (`/invest`) — Investor landing page, metrics, advantages, comparison table, timeline
- **Roadmap** (`/roadmap`) — Product roadmap
- **Leaderboard** (`/leaderboard`) — User rankings
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
