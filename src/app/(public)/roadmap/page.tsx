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
      { id: 'v7-3', title: 'Sécurité', description: 'Middleware auth, validation Zod, protection routes admin', status: 'done', difficulty: 'medium', note: 'Middleware + password min 8' },
      { id: 'v7-4', title: 'Cache & performance', description: 'Redis ISR, images optimisées, Lighthouse 90+', status: 'done', difficulty: 'easy', note: 'Redis getCached sur films, leaderboard, community (2-5 min TTL)' },
      { id: 'v7-5', title: 'Monitoring Sentry', description: 'Error tracking, alertes, dashboard performance', status: 'done', difficulty: 'trivial', note: 'instrumentation.ts + global-error.tsx + dynamic import conditionnel' },
      { id: 'v7-6', title: 'Pages légales RGPD', description: 'CGU, confidentialité, cookies — conformes RGPD/CNIL', status: 'done', difficulty: 'trivial', note: '3 pages légales complètes' },
      { id: 'v7-7', title: 'DNS & domaine custom', description: 'lumiere.film configuré avec Vercel/Cloudflare', status: 'todo', difficulty: 'easy', note: 'Guide fourni' },
      { id: 'v7-8', title: 'Notifications temps réel (SSE)', description: 'EventSource push, hook useNotifications, toast live', status: 'done', difficulty: 'easy', note: '/api/notifications/stream + useNotifications hook + auto-reconnect' },
      { id: 'v7-9', title: 'Smart contracts (interfaces)', description: 'Types TypeScript pour Polygon/Base ERC-20/ERC-721/Governance', status: 'done', difficulty: 'medium', note: 'smart-contracts.ts: 4 contrats, 4 ABIs, config multi-chain' },
      { id: 'v7-10', title: 'Documentation technique', description: 'SECURITY.md, DEPLOYMENT.md, CONTRIBUTING.md', status: 'done', difficulty: 'trivial', note: '3 guides complets pour sécurité, déploiement et contribution' },
    ],
  },
  {
    id: 'v8',
    name: 'Scale & Intelligence',
    version: 'V8',
    description: 'IA avancée, mobile, internationalisation, analytics. La plateforme devient mondiale.',
    status: 'todo',
    emoji: '🌍',
    items: [
      { id: 'v8-1', title: 'App mobile (PWA)', description: 'Progressive Web App installable, notifications push, mode offline', status: 'todo', difficulty: 'medium' },
      { id: 'v8-2', title: 'Internationalisation (i18n)', description: 'FR, EN, HE, AR — contenu et UI traduits dynamiquement', status: 'todo', difficulty: 'medium' },
      { id: 'v8-3', title: 'IA Generative (images/video)', description: 'Génération d\'affiches, storyboards, previsualisations par IA', status: 'todo', difficulty: 'guided' },
      { id: 'v8-4', title: 'Analytics avancées', description: 'Dashboard analytics admin avec graphiques, cohortes, prédictions', status: 'todo', difficulty: 'medium' },
      { id: 'v8-5', title: 'Whisper sous-titres auto', description: 'Transcription automatique audio → sous-titres multi-langues', status: 'todo', difficulty: 'guided' },
      { id: 'v8-6', title: 'CDN vidéo mondial', description: 'Distribution vidéo multi-région via Cloudflare Stream ou Mux', status: 'todo', difficulty: 'medium' },
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
      { id: 'v10-1', title: 'API publique REST/GraphQL', description: 'API documentée pour intégrations tierces et partenaires', status: 'todo', difficulty: 'medium' },
      { id: 'v10-2', title: 'Marketplace créatifs', description: 'Vente d\'assets (musique, SFX, 3D) entre créateurs', status: 'todo', difficulty: 'guided' },
      { id: 'v10-3', title: 'Partenariats studios', description: 'Intégration avec studios partenaires pour co-productions', status: 'todo', difficulty: 'guided' },
      { id: 'v10-4', title: 'App native iOS/Android', description: 'Application mobile native avec streaming optimisé', status: 'todo', difficulty: 'guided' },
    ],
  },
]

const STATUS_CONFIG = {
  done: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Terminé' },
  in_progress: { icon: Clock, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', label: 'En cours' },
  todo: { icon: Circle, color: 'text-white/30', bg: 'bg-white/5 border-white/10', label: 'À faire' },
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
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Roadmap{' '}
            <span className="text-shimmer">
              Lumiere Cinema
            </span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            10 phases pour construire le studio de cinema IA le plus ambitieux au monde.
            Chaque etape est concrete, realiste, et nous rapproche du lancement.
          </p>

          {/* Progress */}
          <div className="inline-flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>{progressPercent}%</div>
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
                        className={`group flex items-start gap-3.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-500 hover-lift ${itemConfig.bg}`}
                      >
                        <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 transition-transform duration-500 group-hover:scale-110 ${itemConfig.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <p className={`text-sm font-medium ${item.status === 'done' ? 'text-white/50 line-through decoration-white/20' : 'text-white/90'}`}>
                              {item.title}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${diffConfig.color}`}>
                              {diffConfig.text} {diffConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-white/30 leading-relaxed">{item.description}</p>
                          {item.note && (
                            <p className="text-xs text-[#D4AF37]/50 mt-1.5 flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3" /> {item.note}
                            </p>
                          )}
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
              style={{ fontFamily: 'var(--font-playfair)' }}
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
