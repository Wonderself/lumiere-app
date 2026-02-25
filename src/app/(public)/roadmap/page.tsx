import { CheckCircle, Clock, Circle, ChevronRight, Rocket, Sparkles, Zap, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap — Lumière Cinema',
  description: 'Plan de développement de Lumière Cinema — du studio IA au streaming mondial. Chaque étape nous rapproche du futur du cinéma.',
}

type RoadmapItem = {
  id: string
  title: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  difficulty: 'trivial' | 'easy' | 'medium' | 'guided'
  note?: string
}

type Phase = {
  id: string
  name: string
  version: string
  description: string
  status: 'done' | 'in_progress' | 'todo'
  emoji: string
  items: RoadmapItem[]
}

const roadmap: Phase[] = [
  {
    id: 'v1',
    name: 'Fondations',
    version: 'V1',
    description: 'Infrastructure, authentification, UI complète, panel admin. Le socle est solide.',
    status: 'done',
    emoji: '🏗️',
    items: [
      { id: 'v1-1', title: 'Next.js 16 + TypeScript + Tailwind', description: 'App Router, design system cinéma, composants UI', status: 'done', difficulty: 'trivial' },
      { id: 'v1-2', title: 'Base de données PostgreSQL + Prisma 7', description: 'Modèles complets : Users, Films, Tasks, Submissions, Payments', status: 'done', difficulty: 'easy' },
      { id: 'v1-3', title: 'Authentification NextAuth v5', description: 'Login/register, JWT, protection des routes, rôles', status: 'done', difficulty: 'easy' },
      { id: 'v1-4', title: 'Landing Page cinéma', description: 'Hero immersif, stats live, services, genres, pricing', status: 'done', difficulty: 'easy' },
      { id: 'v1-5', title: 'Catalogue Films + détails', description: 'Grille filtrable, pages détail avec phases et progression', status: 'done', difficulty: 'easy' },
      { id: 'v1-6', title: 'Inscription & connexion', description: 'Formulaires avec rôle, compétences, langues', status: 'done', difficulty: 'easy' },
      { id: 'v1-7', title: 'Dashboard contributeur', description: 'Stats, tâches en cours, recommandations personnalisées', status: 'done', difficulty: 'easy' },
      { id: 'v1-8', title: 'Marketplace de tâches', description: 'Liste filtrée, détail, claim, soumission', status: 'done', difficulty: 'easy' },
      { id: 'v1-9', title: 'Panel Admin complet', description: 'CRUD films/tâches/users, queue de review, settings', status: 'done', difficulty: 'medium' },
      { id: 'v1-10', title: 'Pages publiques', description: 'À propos, roadmap, leaderboard, streaming, legal', status: 'done', difficulty: 'easy' },
      { id: 'v1-11', title: 'Docker + Seed + Dev tools', description: 'PostgreSQL, Redis, données de démo, Prisma Studio', status: 'done', difficulty: 'trivial' },
    ],
  },
  {
    id: 'v2',
    name: 'IA & Validation',
    version: 'V2',
    description: 'L\'intelligence artificielle entre en jeu : validation automatique, génération de tâches, emails.',
    status: 'done',
    emoji: '🤖',
    items: [
      { id: 'v2-1', title: 'Validation IA des soumissions', description: 'Claude analyse chaque livrable, donne un score et un feedback détaillé', status: 'done', difficulty: 'medium', note: 'Claude Haiku 4.5 intégré' },
      { id: 'v2-2', title: 'Génération auto de tâches', description: 'L\'admin entre un synopsis → l\'IA découpe en micro-tâches par genre', status: 'done', difficulty: 'medium', note: 'Film Decomposer + UI admin' },
      { id: 'v2-3', title: 'Upload fichiers', description: 'Upload de fichiers lourds avec barre de progression', status: 'done', difficulty: 'medium', note: 'S3 presigned URLs + FileUpload component + dev fallback local' },
      { id: 'v2-4', title: 'Dépendances de tâches (DAG)', description: 'Déverrouillage automatique selon l\'ordre de production', status: 'done', difficulty: 'medium', note: 'Validation deps + phase ACTIVE check dans claimTask' },
      { id: 'v2-5', title: 'Timer 48h + auto-release', description: 'Si non soumis dans les délais, la tâche redevient disponible', status: 'done', difficulty: 'easy', note: 'API /api/cron + auto-complete phases + notifications' },
      { id: 'v2-6', title: 'Emails transactionnels', description: 'Bienvenue, validation, paiement, rappels — beaux et clairs', status: 'done', difficulty: 'easy', note: 'Resend + 6 templates HTML (welcome, reset, task, payment, deal, digest)' },
      { id: 'v2-7', title: 'Recherche full-text', description: 'Recherche instantanee films, taches et createurs (Ctrl+K)', status: 'done', difficulty: 'easy', note: 'SearchOverlay + server action' },
      { id: 'v2-8', title: 'Enrichissement IA des taches', description: 'Claude genere description, instructions et criteres de qualite', status: 'done', difficulty: 'easy', note: 'enrichTaskDescriptionAction dans ai.ts' },
    ],
  },
  {
    id: 'v3',
    name: 'Paiements',
    version: 'V3',
    description: 'Les contributeurs sont payés. Stripe, co-production, transparence totale.',
    status: 'done',
    emoji: '💰',
    items: [
      { id: 'v3-1', title: 'Stripe Connect', description: 'Paiement automatique aux contributeurs après validation', status: 'done', difficulty: 'medium', note: 'Checkout + Connect onboarding + webhook + auto-payout sur validation' },
      { id: 'v3-2', title: 'Page de co-production', description: 'Investir dans un film, recevoir des perks et % revenus', status: 'done', difficulty: 'medium', note: 'Tokenization: marketplace, portfolio, governance, dividendes' },
      { id: 'v3-3', title: 'Admin paiements & export', description: 'Vue globale, historique, export CSV pour comptabilité', status: 'done', difficulty: 'easy', note: 'Export CSV /api/admin/export-payments' },
      { id: 'v3-4', title: 'Dashboard revenus contributeur', description: 'Historique des gains, prévisions, demande de retrait', status: 'done', difficulty: 'easy', note: '/dashboard/earnings avec graphique mensuel' },
    ],
  },
  {
    id: 'v4',
    name: 'Streaming & Distribution',
    version: 'V4',
    description: 'Les films sont visibles. Player vidéo, catalogue, abonnements.',
    status: 'done',
    emoji: '🎬',
    items: [
      { id: 'v4-1', title: 'Player vidéo HLS', description: 'Streaming adaptatif multi-qualité, sous-titres, PiP', status: 'done', difficulty: 'medium', note: 'VideoPlayer component avec controles, raccourcis clavier, sous-titres' },
      { id: 'v4-2', title: 'Transcoding automatique', description: '360p/720p/1080p/4K — pipeline FFmpeg', status: 'done', difficulty: 'guided', note: 'transcoding.ts: 4 profils HLS (360p→4K), FFmpeg cmd builder, master playlist' },
      { id: 'v4-3', title: 'Catalogue streaming', description: 'Films released, filtres, page film avec player intégré', status: 'done', difficulty: 'easy', note: 'Page /streaming avec recherche, genres, featured hero' },
      { id: 'v4-4', title: 'Abonnements', description: 'Gratuit / Basic 4.99€ / Premium 9.99€ via Stripe', status: 'done', difficulty: 'medium', note: 'Page pricing + subscriptions.ts (3 plans, Stripe-ready, qualité 720p/1080p/4K)' },
      { id: 'v4-5', title: 'Sous-titres multi-langues', description: 'Upload .srt/.vtt, conversion SRT→VTT, 12 langues', status: 'done', difficulty: 'easy', note: 'subtitles.ts: validation, conversion, 12 langues (fr/en/es/de/it/pt/ar/zh/ja/ko/ru/he)' },
      { id: 'v4-6', title: 'Soumission de films', description: 'Les créateurs soumettent, l\'IA évalue, la communauté vote', status: 'done', difficulty: 'medium', note: '/streaming/submit avec contrat auto + evaluation IA' },
    ],
  },
  {
    id: 'v5',
    name: 'Gamification',
    version: 'V5',
    description: 'Points, badges, classements, concours. La communauté s\'anime.',
    status: 'done',
    emoji: '🏆',
    items: [
      { id: 'v5-1', title: 'Points & niveaux automatiques', description: 'ROOKIE → PRO → EXPERT → VIP, barre de progression visuelle', status: 'done', difficulty: 'easy', note: 'LevelProgress component + profil + dashboard' },
      { id: 'v5-2', title: 'Badges & achievements', description: '13 badges : Première Lumière, Marathonien, Perfectionniste...', status: 'done', difficulty: 'easy', note: 'achievements.ts + BadgeShowcase + auto-award' },
      { id: 'v5-3', title: 'Profils publics', description: 'Page publique createur avec stats, badges, niveau, contributions', status: 'done', difficulty: 'easy', note: '/users/[id] avec badges + level progress' },
      { id: 'v5-4', title: 'Concours mensuels', description: 'Thèmes, votes communautaires, récompenses automatiques', status: 'done', difficulty: 'medium', note: '12 themes mensuels + createMonthlyContestAction' },
      { id: 'v5-5', title: 'Parrainage', description: 'Liens uniques, bonus 30+10 Lumens, page dashboard', status: 'done', difficulty: 'easy', note: 'referral.ts + /dashboard/referral' },
      { id: 'v5-6', title: 'Recommandations de taches', description: 'Algorithme skill-matching, taches recommandees sur le dashboard', status: 'done', difficulty: 'easy', note: 'recommendations.ts + dashboard' },
      { id: 'v5-7', title: 'Analytics Lumens', description: 'Statistiques earned/spent/rewards/bonus sur la page Lumens', status: 'done', difficulty: 'trivial', note: 'Inline stats cards' },
      { id: 'v5-8', title: 'Filtres notifications', description: 'Filtrage par type (validees, rejetees, paiements, systeme)', status: 'done', difficulty: 'trivial', note: 'URL-based filters' },
    ],
  },
  {
    id: 'v6',
    name: 'Scénarios & IP',
    version: 'V6',
    description: 'Soumission de scénarios, évaluation IA, deals de co-production.',
    status: 'done',
    emoji: '📝',
    items: [
      { id: 'v6-1', title: 'Soumission de scénarios', description: 'Formulaire complet avec synopsis IA, logline, genre, public', status: 'done', difficulty: 'easy', note: 'Générateur IA intégré' },
      { id: 'v6-2', title: 'Évaluation IA', description: 'Score IA, analyse détaillée, suggestions d\'amélioration', status: 'done', difficulty: 'medium', note: 'Claude Haiku auto-évalue' },
      { id: 'v6-3', title: 'Deal automatisé', description: 'Contrat, % revenus, crédit au générique', status: 'done', difficulty: 'easy', note: 'generateScreenplayDeal + contrat Markdown complet + email auto' },
      { id: 'v6-4', title: 'Pipeline Éditions Ruppin', description: 'Book-to-screen : adaptation automatique des IP partenaires', status: 'done', difficulty: 'medium', note: 'book-to-screen.ts: scoring adaptation, outline 3 actes, création scénario auto' },
    ],
  },
  {
    id: 'v7',
    name: 'Lancement Production',
    version: 'V7',
    description: 'Sécurité, SEO, performance, déploiement. Le site est live pour le monde.',
    status: 'in_progress',
    emoji: '🚀',
    items: [
      { id: 'v7-1', title: 'Déploiement Production', description: 'Docker + Coolify sur Hetzner, HTTPS via Traefik, CI/CD', status: 'in_progress', difficulty: 'trivial', note: 'Coolify + Hetzner configuré' },
      { id: 'v7-2', title: 'SEO complet', description: 'Metadata dynamique, sitemap XML, robots.txt, JSON-LD Movie schema', status: 'done', difficulty: 'easy', note: 'OpenGraph + Twitter Cards + JSON-LD' },
      { id: 'v7-3', title: 'Sécurité', description: 'Middleware auth, validation Zod, protection routes admin, rate limiting, security headers', status: 'done', difficulty: 'medium', note: 'Rate limiting (login/register/reset) + CSP + HSTS + X-Frame-Options + X-Content-Type-Options' },
      { id: 'v7-4', title: 'Cache & performance', description: 'Redis ISR, images optimisées, Lighthouse 90+', status: 'done', difficulty: 'easy', note: 'Redis getCached sur films, leaderboard, community (2-5 min TTL)' },
      { id: 'v7-5', title: 'Monitoring Sentry', description: 'Error tracking, alertes, dashboard performance', status: 'done', difficulty: 'trivial', note: 'instrumentation.ts + global-error.tsx + dynamic import conditionnel' },
      { id: 'v7-6', title: 'Pages légales RGPD', description: 'CGU, confidentialité, cookies — conformes RGPD/CNIL', status: 'done', difficulty: 'trivial', note: '3 pages légales complètes' },
      { id: 'v7-7', title: 'DNS & domaine custom', description: 'lumiere.film configuré avec Vercel/Cloudflare', status: 'todo', difficulty: 'easy', note: 'Guide fourni' },
      { id: 'v7-8', title: 'Notifications temps réel (SSE)', description: 'EventSource push, hook useNotifications, toast live', status: 'done', difficulty: 'easy', note: '/api/notifications/stream + useNotifications hook + auto-reconnect' },
      { id: 'v7-9', title: 'Smart contracts (interfaces)', description: 'Types TypeScript pour Polygon/Base ERC-20/ERC-721/Governance', status: 'done', difficulty: 'medium', note: 'smart-contracts.ts: 4 contrats, 4 ABIs, config multi-chain' },
      { id: 'v7-10', title: 'Documentation technique', description: 'SECURITY.md, DEPLOYMENT.md, CONTRIBUTING.md', status: 'done', difficulty: 'trivial', note: '3 guides complets pour sécurité, déploiement et contribution' },
      { id: 'v7-11', title: 'Audit visuel complet', description: 'Responsive mobile, padding, bordures, typography, boutons cohérents', status: 'done', difficulty: 'medium', note: '60+ corrections sur 12 fichiers' },
      { id: 'v7-12', title: 'Tests unitaires (Vitest)', description: '85 tests couvrant utils, reputation, invoices, film-decomposer, rate-limiter', status: 'done', difficulty: 'medium', note: 'Vitest + 5 suites de tests, 85/85 passing' },
      { id: 'v7-13', title: 'CI/CD GitHub Actions', description: 'Pipeline automatique: TypeScript check, tests, build sur chaque push/PR', status: 'done', difficulty: 'easy', note: '.github/workflows/ci.yml — 3 jobs: lint, test, build' },
      { id: 'v7-14', title: 'Rate Limiting', description: 'Protection brute-force sur login (5/15min), register (3/h), password reset (3/15min)', status: 'done', difficulty: 'easy', note: 'In-memory sliding window, IP-based, auto-cleanup' },
      { id: 'v7-15', title: 'Security Headers', description: 'CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy', status: 'done', difficulty: 'easy', note: 'Applied via proxy.ts on every response' },
    ],
  },
  {
    id: 'v8',
    name: 'Scale & Intelligence',
    version: 'V8',
    description: 'IA avancée, mobile, internationalisation, analytics. La plateforme devient mondiale.',
    status: 'in_progress',
    emoji: '🌍',
    items: [
      { id: 'v8-1', title: 'App mobile (PWA)', description: 'Progressive Web App installable, service worker, mode offline', status: 'done', difficulty: 'medium', note: 'Manifest + SW + meta tags' },
      { id: 'v8-2', title: 'Internationalisation (i18n)', description: 'FR, EN, HE, AR — contenu et UI traduits dynamiquement', status: 'done', difficulty: 'medium', note: 'next-intl + FR/EN + switcher + header traduit' },
      { id: 'v8-3', title: 'IA Generative (images/video)', description: 'Génération d\'affiches, storyboards, previsualisations par IA', status: 'todo', difficulty: 'guided' },
      { id: 'v8-4', title: 'Analytics avancées', description: 'Dashboard analytics admin avec graphiques, cohortes, prédictions', status: 'done', difficulty: 'medium', note: 'KPI cards + charts + top contributors + pipeline' },
      { id: 'v8-5', title: 'Whisper sous-titres auto', description: 'Transcription automatique audio → sous-titres multi-langues', status: 'todo', difficulty: 'guided' },
      { id: 'v8-6', title: 'CDN vidéo + HLS streaming', description: 'Distribution vidéo multi-région via Cloudflare Stream ou Mux, HLS adaptive bitrate', status: 'done', difficulty: 'medium', note: 'cdn.ts (Cloudflare/Mux/self-hosted) + transcoding.ts (4 profils HLS) + signed URLs' },
      { id: 'v8-7', title: 'Loading states & 404', description: 'Squelettes de chargement (spinner gold), page 404 cinéma', status: 'done', difficulty: 'trivial', note: 'loading.tsx (root + public + dashboard) + not-found.tsx' },
      { id: 'v8-8', title: 'Email verification', description: 'Vérification email à l\'inscription, token + action resendVerification', status: 'done', difficulty: 'easy', note: 'isVerified check + resendVerificationAction dans auth.ts' },
      { id: 'v8-9', title: 'Annulation abonnement', description: 'Bouton annulation dans le profil, cancelSubscriptionAction complète', status: 'done', difficulty: 'easy', note: '/dashboard/subscription — plan actuel, annulation, upgrade, dates' },
      { id: 'v8-10', title: 'Historique de visionnage', description: 'Continue watching, historique des films vus, progression sauvegardée', status: 'done', difficulty: 'easy', note: 'watch-history.ts — recordProgress, getContinueWatching, getHistory via FilmView' },
      { id: 'v8-11', title: 'Watchlist / Ma Liste', description: 'Ajouter/retirer des films de sa liste personnelle, section dédiée', status: 'done', difficulty: 'easy', note: 'watchlist.ts — add/remove/get/isInWatchlist via tags utilisateur' },
      { id: 'v8-12', title: 'Consentement cookies (RGPD)', description: 'Bannière cookie conforme RGPD avec granularité par catégorie', status: 'done', difficulty: 'easy', note: 'CookieBanner + CookieConsent components dans layout.tsx' },
      { id: 'v8-13', title: 'Health check API', description: 'Endpoint /api/health pour monitoring, uptime, et orchestrateurs', status: 'done', difficulty: 'trivial', note: '/api/health — DB + Redis checks, latency, uptime' },
    ],
  },
  {
    id: 'v9',
    name: 'Blockchain Live',
    version: 'V9',
    description: 'Smart contracts déployés, tokens réels, gouvernance on-chain, NFT contributeurs.',
    status: 'todo',
    emoji: '⛓️',
    items: [
      { id: 'v9-1', title: 'Deploy smart contracts', description: 'ERC-20 FilmToken + ERC-721 ContributionNFT sur Polygon/Base', status: 'todo', difficulty: 'guided' },
      { id: 'v9-2', title: 'Wallet Connect', description: 'Connexion MetaMask/WalletConnect pour acheter tokens et voter', status: 'todo', difficulty: 'medium' },
      { id: 'v9-3', title: 'NFT contributeur', description: 'Mint automatique d\'un NFT preuve-de-contribution à chaque tâche validée', status: 'todo', difficulty: 'medium' },
      { id: 'v9-4', title: 'Gouvernance on-chain', description: 'Votes token-weighted pour décisions de production (casting, script, budget)', status: 'todo', difficulty: 'guided' },
      { id: 'v9-5', title: 'Dividendes automatiques', description: 'Distribution automatique des revenus aux détenteurs de tokens', status: 'todo', difficulty: 'guided' },
    ],
  },
  {
    id: 'v10',
    name: 'Ecosystem',
    version: 'V10',
    description: 'API publique, marketplace tiers, partenariats studios, expansion internationale.',
    status: 'todo',
    emoji: '🔮',
    items: [
      { id: 'v10-1', title: 'API publique REST/GraphQL', description: 'API documentée pour intégrations tierces et partenaires', status: 'done', difficulty: 'medium', note: '/api/v1/ + page /developers avec docs interactives' },
      { id: 'v10-2', title: 'Marketplace créatifs', description: 'Vente d\'assets (musique, SFX, 3D) entre créateurs', status: 'todo', difficulty: 'guided' },
      { id: 'v10-3', title: 'Partenariats studios', description: 'Intégration avec studios partenaires pour co-productions', status: 'todo', difficulty: 'guided' },
      { id: 'v10-4', title: 'App native iOS/Android', description: 'Application mobile native avec streaming optimisé', status: 'todo', difficulty: 'guided' },
      { id: 'v10-5', title: 'Avis & notations films', description: 'Notes étoiles (1-5) et critiques textuelles par les spectateurs', status: 'done', difficulty: 'easy', note: 'reviews.ts + FilmReviews component avec étoiles et formulaire' },
      { id: 'v10-6', title: 'Partage social', description: 'Boutons de partage (Twitter, Facebook, copie lien) sur les films et profils', status: 'done', difficulty: 'trivial', note: 'SocialShare component — copie lien, X, Facebook, WhatsApp' },
    ],
  },
  {
    id: 'v11',
    name: 'Infrastructure Vidéo',
    version: 'V11',
    description: 'Pipeline vidéo complet : transcoding, CDN, DRM, thumbnails. Le streaming passe à l\'échelle.',
    status: 'in_progress',
    emoji: '📡',
    items: [
      { id: 'v11-1', title: 'File d\'attente transcoding', description: 'Gestion des jobs FFmpeg avec statut, priorité, retry et webhooks', status: 'done', difficulty: 'medium', note: 'transcoding-queue.ts — CRUD jobs, stats, priority, cleanup' },
      { id: 'v11-2', title: 'Génération auto de thumbnails', description: 'Extraction de vignettes à intervalles réguliers pour preview et timeline', status: 'done', difficulty: 'easy', note: 'thumbnails.ts — FFmpeg commands, sprite sheets, progress parsing' },
      { id: 'v11-3', title: 'CDN vidéo (Cloudflare/Mux)', description: 'Distribution vidéo multi-région avec cache edge et protection hotlink', status: 'done', difficulty: 'guided', note: 'cdn.ts — multi-provider (Cloudflare/Mux/self-hosted), signed URLs' },
      { id: 'v11-4', title: 'Protection DRM', description: 'Widevine / FairPlay pour protéger le contenu premium des abonnés', status: 'todo', difficulty: 'guided' },
      { id: 'v11-5', title: 'Configuration bitrate adaptatif', description: 'Interface admin pour configurer les profils qualité par film', status: 'done', difficulty: 'easy', note: 'bitrate-config.ts — get/set profils par film via tags CatalogFilm' },
    ],
  },
  {
    id: 'v12',
    name: 'Conformité & Sécurité',
    version: 'V12',
    description: 'RGPD complet, audit trail, 2FA, gestion des sessions. La plateforme est conforme et sécurisée.',
    status: 'in_progress',
    emoji: '🔒',
    items: [
      { id: 'v12-1', title: 'Authentification deux facteurs (2FA)', description: 'TOTP via app authenticator (Google Auth, Authy) pour les comptes sensibles', status: 'todo', difficulty: 'medium' },
      { id: 'v12-2', title: 'Suppression de compte (Art. 17)', description: 'Droit à l\'effacement : suppression complète des données personnelles', status: 'done', difficulty: 'easy', note: 'account.ts — requestAccountDeletionAction, anonymisation des données' },
      { id: 'v12-3', title: 'Export données personnelles (Art. 20)', description: 'Téléchargement JSON de toutes les données de l\'utilisateur', status: 'done', difficulty: 'easy', note: 'account.ts — exportPersonalDataAction, JSON complet' },
      { id: 'v12-4', title: 'Gestion des sessions', description: 'Voir et révoquer les sessions actives depuis le profil', status: 'done', difficulty: 'medium', note: 'sessions.ts — record/get/revoke/revokeAll + parsing userAgent' },
      { id: 'v12-5', title: 'Journal d\'audit admin', description: 'Log de toutes les actions admin (création, validation, suppression) avec horodatage', status: 'done', difficulty: 'medium', note: 'audit.ts — logAuditEvent + getAuditLog paginé + stats' },
    ],
  },
  {
    id: 'v13',
    name: 'Social & Engagement',
    version: 'V13',
    description: 'Commentaires, génériques, playlists, créateurs en vedette. La communauté s\'enrichit.',
    status: 'done',
    emoji: '💬',
    items: [
      { id: 'v13-1', title: 'Commentaires sur les films', description: 'Discussion par film avec réponses, likes et modération', status: 'done', difficulty: 'medium', note: 'comments.ts — add/edit/delete/like + replies threadées + soft delete' },
      { id: 'v13-2', title: 'Générique / crédits d\'équipe', description: 'Page crédits interactive par film listant tous les contributeurs et rôles', status: 'done', difficulty: 'easy', note: 'credits.ts — getFilmCredits groupé par phase + scénariste gagnant' },
      { id: 'v13-3', title: 'Collections & playlists', description: 'Créer des playlists thématiques de films partagées ou personnelles', status: 'done', difficulty: 'medium', note: 'playlists.ts — CRUD + add/remove films + public/privé + max 50/200' },
      { id: 'v13-4', title: 'Créateur à la une', description: 'Mise en avant hebdomadaire d\'un créateur avec interview et stats', status: 'done', difficulty: 'easy', note: 'featured-creator.ts — get/set/autoSelect top contributeur de la semaine' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Termine', badge: 'bg-green-500/15 text-green-400 border-green-500/20' },
  in_progress: { icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', label: 'En cours', badge: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/20' },
  todo: { icon: Circle, color: 'text-white/30', bg: 'bg-white/5 border-white/10', label: 'A faire', badge: 'bg-white/5 text-white/30 border-white/10' },
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; text: string }> = {
  trivial: { label: 'Très facile', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: '⚡' },
  easy: { label: 'Facile', color: 'bg-green-500/10 text-green-400 border-green-500/20', text: '✓' },
  medium: { label: 'Moyen', color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20', text: '⭐' },
  guided: { label: 'Guidé', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', text: '📘' },
}

export default function RoadmapPage() {
  const totalItems = roadmap.flatMap((p) => p.items).length
  const doneItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'done').length
  const inProgressItems = roadmap.flatMap((p) => p.items).filter((i) => i.status === 'in_progress').length
  const progressPercent = Math.round((doneItems / totalItems) * 100)

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/[0.03] blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15 text-[#D4AF37] text-xs sm:text-sm font-medium mb-7">
            <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Plan de Developpement
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
          >
            Roadmap{' '}
            <span className="text-shimmer">
              Lumiere Cinema
            </span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            13 phases pour construire le studio de cinema IA le plus ambitieux au monde.
            Chaque etape est concrete, realiste, et nous rapproche du lancement.
          </p>

          {/* Progress */}
          <div className="inline-flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-bold text-[#D4AF37] font-playfair">{progressPercent}%</div>
              <div className="text-left">
                <div className="text-sm text-white/50">{doneItems} / {totalItems} completes</div>
                <div className="text-xs text-white/25">Phase {roadmap.findIndex(p => p.status === 'in_progress') + 1} en cours</div>
              </div>
            </div>
            <div className="w-full max-w-72 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex gap-6 text-xs text-white/30">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> {doneItems} termines</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> {inProgressItems} en cours</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/15" /> {totalItems - doneItems - inProgressItems} a venir</span>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-16">
          {roadmap.map((phase, phaseIndex) => {
            const phaseConfig = STATUS_CONFIG[phase.status]
            const phaseDone = phase.items.filter((i) => i.status === 'done').length
            const phaseProgress = (phaseDone / phase.items.length) * 100

            return (
              <div key={phase.id} className="relative">
                {/* Connecting line between phases */}
                {phaseIndex < roadmap.length - 1 && (
                  <div className="absolute left-6 top-full h-16 w-px bg-gradient-to-b from-white/[0.06] to-transparent hidden sm:block" />
                )}

                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border text-sm font-semibold backdrop-blur-sm ${phaseConfig.bg} ${phaseConfig.color}`}>
                    <span className="text-base">{phase.emoji}</span>
                    {phase.version} — {phase.name}
                    {phase.status === 'done' && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                  <span className="text-sm text-white/30 font-medium tabular-nums">{phaseDone}/{phase.items.length}</span>
                </div>

                <p className="text-white/40 text-sm mb-5 ml-1 leading-relaxed">{phase.description}</p>

                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-7">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      phase.status === 'done' ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                      phase.status === 'in_progress' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0D060]' :
                      'bg-white/[0.06]'
                    }`}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>

                {/* Items */}
                <div className="grid sm:grid-cols-2 gap-3 stagger-children">
                  {phase.items.map((item) => {
                    const itemConfig = STATUS_CONFIG[item.status]
                    const diffConfig = DIFFICULTY_CONFIG[item.difficulty]

                    return (
                      <div
                        key={item.id}
                        className={`group relative flex items-start gap-3.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-500 hover-lift ${itemConfig.bg}`}
                      >
                        <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 transition-transform duration-500 group-hover:scale-110 ${itemConfig.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <p className={`text-sm font-medium ${item.status === 'done' ? 'text-green-400/70' : item.status === 'in_progress' ? 'text-white/90' : 'text-white/60'}`}>
                              {item.title}
                            </p>
                            {/* Status badge - always shown */}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${itemConfig.badge}`}>
                              {item.status === 'done' ? '✓ Fait' : item.status === 'in_progress' ? '⏳ En cours' : '○ A faire'}
                            </span>
                          </div>
                          <p className="text-xs text-white/30 leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${diffConfig.color}`}>
                              {diffConfig.text} {diffConfig.label}
                            </span>
                            {item.note && (
                              <p className="text-[11px] text-[#D4AF37]/50 flex items-center gap-1">
                                <Sparkles className="h-3 w-3 shrink-0" /> {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Section separator */}
        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />

        {/* Encouraging footer */}
        <div className="relative p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] text-center overflow-hidden backdrop-blur-sm">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#D4AF37]/[0.04] blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
              <PartyPopper className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold mb-4 text-white"
            >
              Le futur du cinema se construit{' '}
              <span className="text-shimmer">maintenant</span>
            </h3>
            <p className="text-white/40 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              La majorite des fonctionnalites sont faciles a moyennes. Avec Claude IA comme assistant de developpement,
              chaque etape est documentee et guidee. Le MVP complet (V1→V3) peut etre atteint rapidement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold transition-all duration-500 text-sm shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 hover:scale-[1.02]"
              >
                <Zap className="h-4 w-4" />
                Rejoindre l&apos;Aventure
              </Link>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/[0.08] hover:border-[#D4AF37]/30 text-white/50 hover:text-white font-semibold transition-all duration-500 text-sm hover:bg-white/[0.02]"
              >
                Explorer les Taches
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
