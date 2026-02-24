import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Film,
  Vote,
  Play,
  UserPlus,
  ListChecks,
  Send,
  Gem,
  Star,
  Clock,
  Eye,
  Crown,
  Check,
  Clapperboard,
  Tv,
  Trophy,
} from 'lucide-react'
import { LandingMobileMenu } from '@/components/layout/landing-mobile-menu'

export const metadata = {
  title: 'Lumiere Cinema — Creez. Votez. Regardez.',
  description:
    'La premiere plateforme de cinema collaboratif propulsee par l\'IA. Micro-taches, streaming, production de films IA. Paris, Tel Aviv, Hollywood.',
}

/* ─── Color tokens ─── */
const GOLD = '#D4AF37'
const GOLD_LIGHT = '#F0D060'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ═══════════════════════════════════════════
          NAVIGATION — Fixed header (landing only)
          ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/lumiere-brothers-logo-cinema-dark.webp"
              alt="Lumiere Cinema"
              width={120}
              height={34}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Films', href: '/films' },
              { label: 'Streaming', href: '#streaming' },
              { label: 'Taches', href: '/tasks' },
              { label: 'Classement', href: '/leaderboard' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors hidden sm:block"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-xs font-medium px-4 py-2 rounded-md text-black transition-all hover:opacity-90 hidden sm:block"
              style={{ background: GOLD }}
            >
              S&apos;inscrire
            </Link>
            <LandingMobileMenu />
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          1. HERO — Short, punchy, cinema backdrop
          ═══════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background image with heavy overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80"
            alt="Cinema camera"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]" />
        </div>

        {/* Subtle gold radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[150px] opacity-[0.06] pointer-events-none"
          style={{ background: GOLD }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-5 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="text-gold-gradient">Creez. Votez.</span>
            <br />
            <span className="text-gold-gradient">Regardez.</span>
          </h1>

          <p className="text-sm sm:text-base text-white/45 max-w-lg mx-auto mb-8 leading-relaxed">
            La premiere plateforme de cinema collaboratif propulsee par l&apos;IA.
            Participez a la creation de films, votez sur les projets, et regardez le resultat en streaming.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-black transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
            >
              Commencer Gratuitement
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="#pillars"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              Decouvrir
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. STATS BAR — Compact horizontal row
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.06] py-5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: '12', label: 'Films', suffix: '' },
            { value: '2,847', label: 'Taches', suffix: '' },
            { value: '1,200+', label: 'Contributeurs', suffix: '' },
            { value: '45,000', label: 'Distribues', suffix: ' EUR' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg sm:text-xl font-bold" style={{ color: GOLD }}>
                {stat.suffix === ' EUR' ? `€${stat.value}` : stat.value}
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. THREE PILLARS — Cards with Unsplash images
          ═══════════════════════════════════════════ */}
      <section id="pillars" className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Trois Piliers
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Un Ecosysteme <span className="text-shimmer">Complet</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pillar: Creez */}
            <div className="group glass rounded-xl overflow-hidden hover:border-[#D4AF37]/20 transition-all">
              <div className="relative h-36 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"
                  alt="Production de films"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="h-7 w-7 rounded-md bg-[#D4AF37]/20 flex items-center justify-center">
                    <Clapperboard className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Creez vos Films
                </h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">
                  Participez a la production de films IA via des micro-taches creatives :
                  prompts, images, revues, montage, son.
                </p>
                <Link
                  href="/tasks"
                  className="text-xs font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  style={{ color: GOLD }}
                >
                  Explorer les taches <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Pillar: Votez */}
            <div className="group glass rounded-xl overflow-hidden hover:border-[#D4AF37]/20 transition-all">
              <div className="relative h-36 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80"
                  alt="Salle de cinema"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="h-7 w-7 rounded-md bg-[#D4AF37]/20 flex items-center justify-center">
                    <Vote className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Votez sur les Projets
                </h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">
                  Votez sur les scenarios, participez aux concours, influencez
                  les decisions de la communaute.
                </p>
                <Link
                  href="/films"
                  className="text-xs font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  style={{ color: GOLD }}
                >
                  Voir les films <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Pillar: Regardez */}
            <div className="group glass rounded-xl overflow-hidden hover:border-[#D4AF37]/20 transition-all sm:col-span-2 lg:col-span-1">
              <div className="relative h-36 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=800&q=80"
                  alt="Streaming"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="h-7 w-7 rounded-md bg-[#D4AF37]/20 flex items-center justify-center">
                    <Tv className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Regardez en Streaming
                </h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">
                  Regardez les films IA termines, les bandes-annonces exclusives
                  et le contenu bonus de la communaute.
                </p>
                <Link
                  href="/films"
                  className="text-xs font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  style={{ color: GOLD }}
                >
                  Decouvrir le catalogue <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. HOW IT WORKS — 4 steps, minimal
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Comment ca marche
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Quatre Etapes <span className="text-shimmer">Simples</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                icon: UserPlus,
                title: 'Inscrivez-vous',
                desc: 'Creez votre compte gratuitement en 30 secondes.',
              },
              {
                step: '02',
                icon: ListChecks,
                title: 'Choisissez une tache',
                desc: 'Parcourez les micro-taches disponibles selon vos competences.',
              },
              {
                step: '03',
                icon: Send,
                title: 'Realisez et soumettez',
                desc: 'Completez la tache et soumettez votre travail pour validation.',
              },
              {
                step: '04',
                icon: Gem,
                title: 'Gagnez des Lumens',
                desc: 'Recevez des points, des euros et montez en niveau.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#D4AF37]/15 hover:bg-white/[0.04] transition-all"
              >
                <div
                  className="text-2xl font-bold mb-3 opacity-80"
                  style={{ color: GOLD, fontFamily: 'var(--font-playfair)' }}
                >
                  {item.step}
                </div>
                <item.icon className="h-5 w-5 mx-auto mb-2.5 text-white/25" />
                <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                <p className="text-[11px] text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. MICRO-TACHES PREVIEW — 3 sample cards
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Micro-taches
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Taches <span className="text-shimmer">Disponibles</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'Ecriture de prompt — Scene de poursuite',
                film: 'Neon Requiem',
                difficulty: 2,
                price: 50,
                status: 'Disponible',
                statusColor: '#10B981',
              },
              {
                title: 'Generation image — Decor futuriste Tokyo',
                film: 'Blade of Dawn',
                difficulty: 3,
                price: 100,
                status: 'Disponible',
                statusColor: '#10B981',
              },
              {
                title: 'Revue video — Continuite scene 12',
                film: 'Les Ombres de Montmartre',
                difficulty: 1,
                price: 50,
                status: 'En cours',
                statusColor: '#F59E0B',
              },
            ].map((task) => (
              <div
                key={task.title}
                className="glass rounded-lg p-4 hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${task.statusColor}15`,
                      color: task.statusColor,
                    }}
                  >
                    {task.status}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-2.5 w-2.5"
                        fill={i < task.difficulty ? GOLD : 'transparent'}
                        stroke={i < task.difficulty ? GOLD : 'rgba(255,255,255,0.15)'}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-semibold mb-1.5 leading-snug">{task.title}</h4>
                <div className="flex items-center gap-1.5 mb-3">
                  <Film className="h-2.5 w-2.5 text-white/20" />
                  <span className="text-[10px] text-white/30">{task.film}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: GOLD }}>
                    {task.price} EUR
                  </span>
                  <Clock className="h-3 w-3 text-white/15" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all"
              style={{ color: GOLD }}
            >
              Voir toutes les taches <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. STREAMING — Film poster cards
          ═══════════════════════════════════════════ */}
      <section id="streaming" className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
                Streaming
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                A l&apos;Affiche
              </h2>
            </div>
            <Link
              href="/films"
              className="text-xs font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all hidden sm:flex"
              style={{ color: GOLD }}
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Neon Requiem',
                genre: 'Sci-Fi',
                views: '12.4k',
                img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
              },
              {
                title: 'Les Ombres de Montmartre',
                genre: 'Thriller',
                views: '8.9k',
                img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
              },
              {
                title: 'Blade of Dawn',
                genre: 'Action',
                views: '15.2k',
                img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80',
              },
              {
                title: 'Chroniques Bibliques',
                genre: 'Historique',
                views: '6.1k',
                img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
              },
            ].map((film) => (
              <div
                key={film.title}
                className="group relative rounded-lg overflow-hidden border border-white/[0.06] bg-[#111] hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={film.img}
                    alt={film.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-black ml-0.5" fill="black" />
                    </div>
                  </div>

                  {/* Genre badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/70">
                      {film.genre}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-semibold truncate mb-1">{film.title}</h4>
                  <div className="flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5 text-white/20" />
                    <span className="text-[10px] text-white/25">{film.views} vues</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 sm:hidden">
            <Link
              href="/films"
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: GOLD }}
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. PRICING — 3 compact tiers
          ═══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
              Tarifs
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Choisissez votre <span className="text-shimmer">Niveau</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {/* Free */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/10 transition-all">
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                Gratuit
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-playfair)', color: GOLD }}
              >
                0 EUR
              </div>
              <p className="text-[10px] text-white/25 mb-5">Pour toujours</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Acces aux taches de base',
                  'Profil contributeur',
                  'Streaming gratuit (ads)',
                  'Classement communautaire',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-white/40">
                    <Check className="h-3 w-3 shrink-0 mt-0.5" style={{ color: GOLD }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center text-xs font-medium py-2 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
              >
                Commencer
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-xl border p-5 relative overflow-hidden transition-all" style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}>
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})` }}
              />
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[10px] uppercase tracking-widest" style={{ color: GOLD }}>
                  Pro
                </div>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded text-black"
                  style={{ background: GOLD }}
                >
                  Populaire
                </span>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-playfair)', color: GOLD }}
              >
                19 EUR
              </div>
              <p className="text-[10px] text-white/25 mb-5">par mois</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Taches prioritaires',
                  'Gains x2 sur les Lumens',
                  'Streaming sans pub',
                  'Badge Pro sur le profil',
                  'Acces aux concours VIP',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-white/50">
                    <Check className="h-3 w-3 shrink-0 mt-0.5" style={{ color: GOLD }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center text-xs font-semibold py-2 rounded-md text-black transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
              >
                Devenir Pro
              </Link>
            </div>

            {/* VIP */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[10px] uppercase tracking-widest text-white/30">
                  VIP
                </div>
                <Crown className="h-3 w-3 text-[#D4AF37]/50" />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-playfair)', color: GOLD }}
              >
                49 EUR
              </div>
              <p className="text-[10px] text-white/25 mb-5">par mois</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Tout Pro inclus',
                  'Acces exclusif aux films',
                  'Vote de gouvernance',
                  'Red carpet virtuel',
                  'Support prioritaire',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-white/40">
                    <Check className="h-3 w-3 shrink-0 mt-0.5" style={{ color: GOLD }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center text-xs font-medium py-2 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
              >
                Rejoindre le VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. CTA FINAL — Short closing
          ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/[0.06] relative overflow-hidden">
        {/* Subtle gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none"
          style={{ background: GOLD }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Trophy className="h-8 w-8 mx-auto mb-4" style={{ color: `${GOLD}50` }} />
          <h2
            className="text-2xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Rejoignez la Revolution
            <br />
            <span className="text-shimmer">du Cinema IA</span>
          </h2>
          <p className="text-sm text-white/35 mb-8 max-w-md mx-auto">
            Des milliers de contributeurs creent deja les films de demain.
            Votre talent peut faire la difference.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-black transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
          >
            Commencer Gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <Image
                src="/images/lumiere-brothers-logo-cinema-dark.webp"
                alt="Lumiere Cinema"
                width={120}
                height={34}
                className="h-6 w-auto object-contain mb-3"
              />
              <p className="text-[10px] text-white/20 leading-relaxed mb-2">
                Le studio de cinema IA collaboratif.
              </p>
              <p className="text-[10px] text-white/15">
                Paris &middot; Tel Aviv &middot; Hollywood
              </p>
            </div>

            {/* Plateforme */}
            <div>
              <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-4">
                Plateforme
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'Films', href: '/films' },
                  { label: 'Streaming', href: '/streaming' },
                  { label: 'Taches', href: '/tasks' },
                  { label: 'A Propos', href: '/about' },
                  { label: 'Roadmap', href: '/roadmap' },
                ].map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-white/20 hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Communaute */}
            <div>
              <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-4">
                Communaute
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'Classement', href: '/leaderboard' },
                  { label: 'Concours', href: '/community/contests' },
                  { label: 'Communaute', href: '/community' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-white/20 hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'CGU', href: '/legal/terms' },
                  { label: 'Confidentialite', href: '/legal/privacy' },
                  { label: 'Cookies', href: '/legal/cookies' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-white/20 hover:text-white/40 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/15">
              &copy; 2026 Lumiere Brothers Pictures. Tous droits reserves.
            </p>
            <p className="text-[10px] text-white/15">
              Paris &middot; Tel Aviv &middot; Hollywood
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
