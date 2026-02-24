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
- Replaced `force-dynamic` with `revalidate` on key pages
- Added Redis caching for stats queries
- Optimized next.config.ts (image formats, package imports, compression)
- Added `display: 'swap'` to font loading
- Created documentation: PROJECT_HISTORY.md, FEATURES.md, FILM_PIPELINE.md

---

## Key Decisions
1. **Standalone output** — Required for deployment (Docker/Railway)
2. **JWT strategy** — Stateless auth, no server-side sessions needed
3. **Hash-based blockchain** — Proof system works offline, ready for real contracts
4. **Redis graceful degradation** — App works without Redis, just slower
5. **Israeli legal framework** — Tokenization follows IL securities law
6. **Prisma adapter-pg** — Direct PostgreSQL adapter for better performance
7. **noImplicitAny: true** — Strict TypeScript for code quality

---

## Important Files
- `prisma/schema.prisma` — Full database schema (70+ models)
- `src/lib/auth.ts` — Authentication configuration
- `src/lib/blockchain.ts` — Blockchain proof system
- `src/lib/redis.ts` — Redis caching layer
- `src/app/actions/` — 19 server action files
- `next.config.ts` — Build & optimization configuration
