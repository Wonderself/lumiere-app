# Lumiere App — Complete Feature Inventory

> **Ce fichier documente TOUTES les fonctionnalités du site.**
> **Doit être mis à jour à chaque ajout/modification de fonctionnalité.**
> **Ne JAMAIS supprimer une fonctionnalité sans la documenter ici.**

---

## 1. Authentication & User Management

### Registration & Login
- Email/password registration with role selection
- Credential-based login via NextAuth 5
- JWT stateless sessions
- Password reset via token (1h expiry, email link)
- Profile updates (name, bio, skills, languages, wallet address)

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
- **About** (`/about`) — Company info
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
