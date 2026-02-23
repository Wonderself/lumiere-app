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
    status: 'in_progress',
    emoji: '🤖',
    items: [
      { id: 'v2-1', title: 'Validation IA des soumissions', description: 'Claude analyse chaque livrable, donne un score et un feedback détaillé', status: 'in_progress', difficulty: 'medium', note: 'API Claude déjà intégrée' },
      { id: 'v2-2', title: 'Génération auto de tâches', description: 'L\'admin entre un synopsis → l\'IA découpe en micro-tâches', status: 'todo', difficulty: 'medium', note: 'Prompt engineering' },
      { id: 'v2-3', title: 'Upload fichiers', description: 'Upload de fichiers lourds avec barre de progression', status: 'todo', difficulty: 'medium', note: 'S3 + presigned URLs' },
      { id: 'v2-4', title: 'Dépendances de tâches (DAG)', description: 'Déverrouillage automatique selon l\'ordre de production', status: 'todo', difficulty: 'medium' },
      { id: 'v2-5', title: 'Timer 48h + auto-release', description: 'Si non soumis dans les délais, la tâche redevient disponible', status: 'todo', difficulty: 'easy', note: 'BullMQ + cron' },
      { id: 'v2-6', title: 'Emails transactionnels', description: 'Bienvenue, validation, paiement, rappels — beaux et clairs', status: 'todo', difficulty: 'easy', note: 'Resend + react-email' },
      { id: 'v2-7', title: 'Recherche full-text', description: 'Chercher films et tâches instantanément', status: 'todo', difficulty: 'easy', note: 'MeiliSearch, setup en 5 min' },
    ],
  },
  {
    id: 'v3',
    name: 'Paiements',
    version: 'V3',
    description: 'Les contributeurs sont payés. Stripe, co-production, transparence totale.',
    status: 'todo',
    emoji: '💰',
    items: [
      { id: 'v3-1', title: 'Stripe Connect', description: 'Paiement automatique aux contributeurs après validation', status: 'todo', difficulty: 'medium', note: 'Guide Stripe pas à pas disponible' },
      { id: 'v3-2', title: 'Page de co-production', description: 'Investir dans un film, recevoir des perks et % revenus', status: 'todo', difficulty: 'medium' },
      { id: 'v3-3', title: 'Admin paiements & export', description: 'Vue globale, historique, export CSV pour comptabilité', status: 'todo', difficulty: 'easy' },
      { id: 'v3-4', title: 'Dashboard revenus contributeur', description: 'Historique des gains, prévisions, demande de retrait', status: 'todo', difficulty: 'easy' },
    ],
  },
  {
    id: 'v4',
    name: 'Streaming & Distribution',
    version: 'V4',
    description: 'Les films sont visibles. Player vidéo, catalogue, abonnements.',
    status: 'todo',
    emoji: '🎬',
    items: [
      { id: 'v4-1', title: 'Player vidéo HLS', description: 'Streaming adaptatif multi-qualité, sous-titres, PiP', status: 'todo', difficulty: 'medium', note: 'Video.js, bien documenté' },
      { id: 'v4-2', title: 'Transcoding automatique', description: '360p/720p/1080p/4K — pipeline FFmpeg', status: 'todo', difficulty: 'guided', note: 'Guide étape par étape fourni' },
      { id: 'v4-3', title: 'Catalogue streaming', description: 'Films released, filtres, page film avec player intégré', status: 'todo', difficulty: 'easy' },
      { id: 'v4-4', title: 'Abonnements', description: 'Gratuit / Basic 2€ / Premium 5€ via Stripe', status: 'todo', difficulty: 'medium', note: 'Réutilise Stripe V3' },
      { id: 'v4-5', title: 'Sous-titres multi-langues', description: 'Upload .srt/.vtt ou génération automatique Whisper', status: 'todo', difficulty: 'easy' },
      { id: 'v4-6', title: 'Soumission de films', description: 'Les créateurs soumettent, l\'IA évalue, la communauté vote', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v5',
    name: 'Gamification',
    version: 'V5',
    description: 'Points, badges, classements, concours. La communauté s\'anime.',
    status: 'todo',
    emoji: '🏆',
    items: [
      { id: 'v5-1', title: 'Points & niveaux automatiques', description: 'ROOKIE → PRO → EXPERT → VIP, progression naturelle', status: 'todo', difficulty: 'easy' },
      { id: 'v5-2', title: 'Badges & achievements', description: '13 badges : Première Lumière, Marathonien, Perfectionniste...', status: 'todo', difficulty: 'easy' },
      { id: 'v5-3', title: 'Profils publics', description: 'Portfolio, filmographie, badges, partage social', status: 'todo', difficulty: 'easy' },
      { id: 'v5-4', title: 'Concours mensuels', description: 'Thèmes, votes communautaires, récompenses automatiques', status: 'todo', difficulty: 'medium' },
      { id: 'v5-5', title: 'Parrainage', description: 'Liens uniques, bonus parrain et filleul', status: 'todo', difficulty: 'easy' },
    ],
  },
  {
    id: 'v6',
    name: 'Scénarios & IP',
    version: 'V6',
    description: 'Soumission de scénarios, évaluation IA, deals de co-production.',
    status: 'todo',
    emoji: '📝',
    items: [
      { id: 'v6-1', title: 'Soumission de scénarios', description: 'Wizard 4 étapes : infos, upload, tolérance IA, confirmation', status: 'todo', difficulty: 'easy' },
      { id: 'v6-2', title: 'Évaluation IA', description: 'Score sur 5 critères, radar chart visuel, feedback constructif', status: 'todo', difficulty: 'medium' },
      { id: 'v6-3', title: 'Deal automatisé', description: 'Contrat, % revenus, crédit au générique', status: 'todo', difficulty: 'easy' },
      { id: 'v6-4', title: 'Pipeline Éditions Ruppin', description: 'Book-to-screen : adaptation automatique des IP partenaires', status: 'todo', difficulty: 'medium' },
    ],
  },
  {
    id: 'v7',
    name: 'Lancement Production',
    version: 'V7',
    description: 'Sécurité, SEO, performance, déploiement. Le site est live pour le monde.',
    status: 'todo',
    emoji: '🚀',
    items: [
      { id: 'v7-1', title: 'Déploiement Vercel', description: 'HTTPS automatique, CDN mondial, preview branches', status: 'todo', difficulty: 'trivial', note: '3 clics + guide' },
      { id: 'v7-2', title: 'SEO complet', description: 'Metadata dynamique, sitemap, robots.txt, JSON-LD', status: 'todo', difficulty: 'easy' },
      { id: 'v7-3', title: 'Sécurité', description: 'Rate limiting, validation Zod, CSP headers, audit', status: 'todo', difficulty: 'medium' },
      { id: 'v7-4', title: 'Cache & performance', description: 'Redis ISR, images optimisées, Lighthouse 90+', status: 'todo', difficulty: 'easy' },
      { id: 'v7-5', title: 'Monitoring Sentry', description: 'Error tracking, alertes, dashboard performance', status: 'todo', difficulty: 'trivial', note: 'SDK en 2 lignes' },
      { id: 'v7-6', title: 'Pages légales RGPD', description: 'CGU, confidentialité, cookies — FR + EN', status: 'todo', difficulty: 'trivial' },
      { id: 'v7-7', title: 'DNS & domaine custom', description: 'lumiere.film configuré avec Vercel/Cloudflare', status: 'todo', difficulty: 'easy', note: 'Guide fourni' },
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
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Plan de Développement
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Roadmap{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Lumière Cinema
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
            7 phases pour construire le studio de cinéma IA le plus ambitieux au monde.
            Chaque étape est concrète, réaliste, et nous rapproche du lancement.
          </p>

          {/* Progress */}
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-[#D4AF37]">{progressPercent}%</div>
              <div className="text-left">
                <div className="text-sm text-white/60">{doneItems} / {totalItems} complétés</div>
                <div className="text-xs text-white/30">Phase {roadmap.findIndex(p => p.status === 'in_progress') + 1} en cours</div>
              </div>
            </div>
            <div className="w-72 h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex gap-6 text-xs text-white/40">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> {doneItems} terminés</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> {inProgressItems} en cours</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20" /> {totalItems - doneItems - inProgressItems} à venir</span>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-12">
          {roadmap.map((phase) => {
            const phaseConfig = STATUS_CONFIG[phase.status]
            const phaseDone = phase.items.filter((i) => i.status === 'done').length
            const phaseProgress = (phaseDone / phase.items.length) * 100

            return (
              <div key={phase.id}>
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${phaseConfig.bg} ${phaseConfig.color}`}>
                    <span>{phase.emoji}</span>
                    {phase.version} — {phase.name}
                    {phase.status === 'done' && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-sm text-white/30">{phaseDone}/{phase.items.length}</span>
                </div>

                <p className="text-white/40 text-sm mb-4 ml-1">{phase.description}</p>

                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      phase.status === 'done' ? 'bg-green-500' :
                      phase.status === 'in_progress' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0D060]' :
                      'bg-white/10'
                    }`}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>

                {/* Items */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {phase.items.map((item) => {
                    const itemConfig = STATUS_CONFIG[item.status]
                    const diffConfig = DIFFICULTY_CONFIG[item.difficulty]

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${itemConfig.bg}`}
                      >
                        <itemConfig.icon className={`h-5 w-5 mt-0.5 shrink-0 ${itemConfig.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className={`text-sm font-medium ${item.status === 'done' ? 'text-white/60 line-through' : 'text-white'}`}>
                              {item.title}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${diffConfig.color}`}>
                              {diffConfig.text} {diffConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-white/30 leading-relaxed">{item.description}</p>
                          {item.note && (
                            <p className="text-xs text-[#D4AF37]/60 mt-1 flex items-center gap-1">
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

        {/* Encouraging footer */}
        <div className="mt-16 p-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center">
          <PartyPopper className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
          <h3
            className="text-xl font-bold mb-3 text-white"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Le futur du cinéma se construit maintenant
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-xl mx-auto">
            La majorité des fonctionnalités sont faciles à moyennes. Avec Claude IA comme assistant de développement,
            chaque étape est documentée et guidée. Le MVP complet (V1→V3) peut être atteint rapidement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold transition-colors text-sm"
            >
              <Zap className="h-4 w-4" />
              Rejoindre l&apos;Aventure
            </Link>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-[#D4AF37]/30 text-white/60 hover:text-white font-semibold transition-all text-sm"
            >
              Explorer les Tâches
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
