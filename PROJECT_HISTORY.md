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
- `src/components/netflix/` — Netflix-style UI components (header, hero, film rows, creator bar, screenwriter CTA)
- `SLATE_DECK.md` — Full project pipeline with 20 projects details
