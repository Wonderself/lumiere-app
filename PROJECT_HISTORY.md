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

---

## Important Files
- `prisma/schema.prisma` — Full database schema (70+ models, 23 BlockchainEventType values)
- `src/lib/auth.ts` — Authentication configuration
- `src/lib/blockchain.ts` — Blockchain proof system + generic `recordEvent()`
- `src/lib/redis.ts` — Redis caching layer
- `src/lib/film-decomposer.ts` — Auto-generates tasks/budget/timeline from genre
- `src/lib/reputation.ts` — Weighted reputation scoring system
- `src/app/actions/admin.ts` — Film, task, phase, review management + reassignment + cleanup
- `src/app/actions/community.ts` — Scenarios, contests + auto-film from winner
- `src/app/actions/tasks.ts` — Task claim, submit, abandon + blockchain events
- `src/app/actions/tokenization.ts` — Token purchase, sale, governance, dividends + blockchain events
- `next.config.ts` — Build & optimization configuration
