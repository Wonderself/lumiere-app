import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { prisma } from '@/lib/prisma'
import {
  ArrowRight,
  Star,
  Users,
  Film,
  CheckCircle,
  ChevronRight,
  Zap,
  Shield,
  Sparkles,
  Play,
  Palette,
  Camera,
  Mic,
  Wand2,
  Layers,
  Globe,
  Award,
  Eye,
} from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'

async function getStats() {
  try {
    const [filmsCount, tasksCount, usersCount, availableTasks] = await Promise.all([
      prisma.film.count({ where: { isPublic: true } }),
      prisma.task.count({ where: { status: 'VALIDATED' } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.task.count({ where: { status: 'AVAILABLE' } }),
    ])
    return { filmsCount, tasksCount, usersCount, availableTasks }
  } catch {
    return { filmsCount: 5, tasksCount: 200, usersCount: 50, availableTasks: 30 }
  }
}

async function getPublicFilms() {
  try {
    return await prisma.film.findMany({
      where: { isPublic: true },
      orderBy: { progressPct: 'desc' },
      take: 3,
      include: { _count: { select: { tasks: true } } },
    })
  } catch {
    return []
  }
}

const steps = [
  {
    number: '01',
    icon: Film,
    title: 'Choisissez une Tâche',
    description: 'Parcourez le catalogue de tâches créatives par film, type, ou niveau de difficulté. Prompt writing, design, audio, VFX, cascade...',
  },
  {
    number: '02',
    icon: Star,
    title: 'Réalisez & Soumettez',
    description: "Acceptez la tâche et livrez votre travail dans les 48h. L'IA évalue votre soumission instantanément avec un retour détaillé.",
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Soyez Payé Instantanément',
    description: 'Tâche validée = paiement immédiat. 50€, 100€ ou 500€ par tâche selon la difficulté. Stripe ou Bitcoin Lightning.',
  },
]

const services = [
  {
    icon: Play,
    title: 'Bandes-Annonces IA',
    description: 'Création de trailers cinématiques générés par intelligence artificielle, avec montage professionnel et sound design.',
  },
  {
    icon: Palette,
    title: 'Affiches de Film',
    description: 'Design d\'affiches de qualité studio, du concept à la finalisation. Styles multiples : réaliste, animation, artistique.',
  },
  {
    icon: Camera,
    title: 'Votre Visage dans le Film',
    description: 'Intégration de votre visage dans nos productions grâce à la technologie IA. Devenez acteur de notre univers cinématique.',
  },
  {
    icon: Eye,
    title: 'Plateforme de Streaming',
    description: 'Accédez à notre catalogue de films IA finalisés. Regardez, votez, et participez aux concours communautaires.',
  },
]

const genres = [
  { name: 'Animation 3D & Stop-Motion', desc: 'Qualité studio d\'animation mondial' },
  { name: 'Horreur & Thriller', desc: 'Profondeur psychologique et texture' },
  { name: 'Films Historiques IA', desc: 'Recréation réaliste d\'époques passées' },
  { name: 'Science-Fiction', desc: 'Univers futuristes immersifs' },
  { name: 'Restauration de Films', desc: 'Redonner vie aux classiques du cinéma' },
  { name: 'Hybride Live + IA', desc: 'Acteurs réels dans des environnements IA' },
]

const features = [
  { icon: Zap, title: 'Validation IA Instantanée', description: 'Chaque soumission est évaluée par l\'IA en temps réel. Feedback immédiat, paiement rapide.' },
  { icon: Shield, title: 'Paiements Sécurisés', description: 'Stripe, Lightning Bitcoin — choisissez votre mode de paiement. Funds en escrow jusqu\'à validation.' },
  { icon: Users, title: 'Communauté Créative', description: 'Montez en niveau, gagnez des badges, apparaissez au générique des films. Du ROOKIE au VIP.' },
  { icon: Sparkles, title: 'IA qui Dirige', description: '"We don\'t prompt. We direct AI." Notre workflow maison s\'améliore chaque jour grâce à notre système propriétaire.' },
  { icon: Globe, title: 'Paris · Tel Aviv · Hollywood', description: 'Un studio tri-continental avec l\'agilité de la Silicon Valley et la rigueur du système studio.' },
  { icon: Award, title: 'IP & Equity', description: 'Partenariat avec Éditions Ruppin : accès prioritaire aux biographies et récits historiques pour le book-to-screen.' },
]

export default async function HomePage() {
  const [stats, films] = await Promise.all([getStats(), getPublicFilms()])

  return (
    <div className="relative overflow-hidden film-grain">
      <Header />

      {/* Background decorative */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
        {/* Hero background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/cinema-clapperboard-clouds-hero.png"
            alt="Lumière Brothers Pictures - Le studio de demain"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-sm text-[#D4AF37] mb-8 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Cinema & Creative Studio — Paris · Tel Aviv · Hollywood</span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 max-w-5xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Le Studio de{' '}
          <span className="text-gold-gradient">Demain.</span>
          <br />
          <span className="text-white/90">Ouvert </span>
          <span className="text-gold-gradient">Aujourd&apos;hui.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
          Contribuez à des films IA révolutionnaires. Choisissez vos tâches créatives,
          livrez votre talent, et soyez payé instantanément. De l&apos;horreur à l&apos;animation,
          du biopic au thriller — nous dirigeons l&apos;IA, nous ne promptons pas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/register">
            <Button size="xl" className="group text-base px-8 py-4">
              Rejoindre l&apos;Aventure
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/films">
            <Button size="xl" variant="outline" className="text-base px-8 py-4">
              Découvrir les Films
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-3xl w-full">
          {[
            { label: 'Films en Production', value: stats.filmsCount > 0 ? stats.filmsCount : '5+' },
            { label: 'Tâches Validées', value: stats.tasksCount > 0 ? stats.tasksCount : '200+' },
            { label: 'Contributeurs Actifs', value: stats.usersCount > 0 ? stats.usersCount : '50+' },
            { label: 'Tâches Disponibles', value: stats.availableTasks > 0 ? stats.availableTasks : '30+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ ABOUT TEASER — Vision ═══════════ */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 gradient-radial-gold opacity-50" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Notre Vision</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                La disruption, ce n&apos;est pas détruire le passé.
                <br />
                <span className="text-gold-gradient">C&apos;est l&apos;upgrader.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Lumière Brothers Pictures fusionne l&apos;expertise Prime Time de TF1 et Lagardère
                avec la puissance de l&apos;IA de nouvelle génération. Nous ne promptons pas.
                Nous dirigeons l&apos;IA.
              </p>
              <p className="text-white/40 leading-relaxed mb-8">
                Fondé par Emmanuel Smadja (ex-TF1, Lagardère, Shine) et Eric Haldezos
                (réalisateur IA primé, festivals internationaux), notre studio crée des films
                allant de l&apos;horreur à l&apos;animation familiale grâce à un workflow propriétaire
                qui s&apos;améliore chaque jour.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F0D060] transition-colors font-medium">
                En savoir plus sur notre histoire <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/human-meets-ai-creative-collision.png"
                alt="L'humain rencontre l'IA - Vision créative Lumière Brothers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Le Processus</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Comment ça Marche
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">Simple, rapide, et rémunérateur. En 3 étapes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-[#D4AF37]/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 group-hover:bg-[#D4AF37]/15 transition-colors">
                    <step.icon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <span className="text-6xl font-bold text-white/[0.04]" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NOS SERVICES ═══════════ */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Services</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Le Studio aux <span className="text-gold-gradient">Possibilités Infinies</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">Du trailer à l&apos;affiche, du face-swap au streaming.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="glass rounded-2xl p-8 hover:border-[#D4AF37]/25 transition-all duration-300 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-white/50 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GENRE VERSATILITY ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/genre-versatility-meeting-characters.png"
                alt="Production multi-genre IA - De l'animation à l'horreur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 to-transparent" />
            </div>
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Genre-Agnostic</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                De l&apos;Horreur Glaçante au{' '}
                <span className="text-gold-gradient">Divertissement Familial</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Notre workflow maison propriétaire nous permet de créer dans tous les genres.
                Un système d&apos;amélioration continue &quot;sauce secrète&quot; qui progresse chaque jour.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {genres.map((genre) => (
                  <div key={genre.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/15 transition-colors">
                    <h4 className="text-sm font-semibold mb-1">{genre.name}</h4>
                    <p className="text-xs text-white/40">{genre.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FILMS EN PRODUCTION ═══════════ */}
      {films.length > 0 && (
        <section className="py-24 px-4 bg-white/[0.01]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-2">Pipeline</p>
                <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Films en Production
                </h2>
              </div>
              <Link href="/films" className="hidden md:flex items-center gap-2 text-[#D4AF37] hover:text-[#F0D060] transition-colors text-sm font-medium">
                Voir tous les films <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {films.map((film) => (
                <Link key={film.id} href={`/films/${film.slug}`}>
                  <div className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-300">
                    <div className="relative h-48 bg-gradient-to-br from-[#D4AF37]/10 to-purple-900/20">
                      {film.coverImageUrl ? (
                        <img src={film.coverImageUrl} alt={`Film IA ${film.title} - Lumière Brothers`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-16 w-16 text-[#D4AF37]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs text-white/60 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
                          {FILM_STATUS_LABELS[film.status]}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[#D4AF37] transition-colors">{film.title}</h3>
                      {film.description && <p className="text-sm text-white/40 mb-4 line-clamp-2">{film.description}</p>}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Progression</span>
                          <span className="text-[#D4AF37] font-medium">{Math.round(film.progressPct)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060] rounded-full transition-all duration-1000" style={{ width: `${film.progressPct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-white/30">{film._count.tasks} tâches</span>
                        <span className="text-xs text-[#D4AF37] flex items-center gap-1 font-medium">
                          Contribuer <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ WORKFLOW MAISON ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Workflow Propriétaire</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Des Micro-Tâches pour{' '}
                <span className="text-gold-gradient">Chaque Talent</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Notre système décompose chaque film en centaines de micro-tâches créatives.
                Chaque tâche est ultra-guidée, détaillée étape par étape, et accessible à tous les niveaux.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Wand2, label: 'Prompt Writing & Direction IA', price: '50€' },
                  { icon: Palette, label: 'Design de Personnages & Environnements', price: '100€' },
                  { icon: Camera, label: 'Motion Capture & Cascades', price: '500€' },
                  { icon: Mic, label: 'Sound Design & Voix Off', price: '100€' },
                  { icon: Layers, label: 'Compositing & VFX', price: '500€' },
                ].map((task) => (
                  <div key={task.label} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <task.icon className="h-5 w-5 text-[#D4AF37]" />
                      <span className="text-sm font-medium">{task.label}</span>
                    </div>
                    <span className="text-sm text-[#D4AF37] font-bold">{task.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/studio-workflow-maison-desk.png"
                alt="Workflow Maison - Studio de production IA Lumière Brothers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES GRID ═══════════ */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Pourquoi Nous</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              L&apos;Avantage <span className="text-gold-gradient">Lumière</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-7 hover:border-[#D4AF37]/20 transition-all duration-300 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5 group-hover:bg-[#D4AF37]/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EDITIONS RUPPIN PARTNERSHIP ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/editions-ruppin-library-partnership.png"
                alt="Éditions Ruppin - Partenariat book-to-screen Lumière Brothers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Partenariat Stratégique</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Éditions Ruppin :{' '}
                <span className="text-gold-gradient">Du Livre à l&apos;Écran</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Nous détenons 33% d&apos;Éditions Ruppin, une maison d&apos;édition que nous transformons
                en startup tech &quot;Book-to-Screen&quot; grâce à nos outils IA propriétaires.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'First-Look Deal', desc: 'Accès prioritaire à chaque biographie et récit historique avant le marché.' },
                  { title: 'IP Co-Détenue', desc: 'Nous ne faisons pas qu\'adapter des histoires. Nous co-détenons les droits.' },
                  { title: 'Écosystème Scalable', desc: 'Transformation d\'une maison d\'édition traditionnelle en pipeline cinéma IA.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/30 italic">
                &quot;Nous contrôlons l&apos;histoire du premier mot imprimé au dernier pixel.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICE TIERS ═══════════ */}
      <section className="py-24 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Tarification</p>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Des Tâches pour <span className="text-gold-gradient">Chaque Niveau</span>
          </h2>
          <p className="text-white/50 mb-12">Plus la tâche est complexe, plus la récompense est élevée.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { level: 'Débutant', price: '50€', desc: 'Prompt writing, revue qualité, traduction, sous-titres', color: 'from-emerald-500/10 to-transparent' },
              { level: 'Avancé', price: '100€', desc: 'Design, animation, sound design, colorimétrie', color: 'from-blue-500/10 to-transparent' },
              { level: 'Expert', price: '500€', desc: 'VFX, cascades, direction artistique, compositing', color: 'from-[#D4AF37]/10 to-transparent', featured: true },
            ].map((tier) => (
              <div
                key={tier.level}
                className={`rounded-2xl border p-8 relative bg-gradient-to-b ${tier.color} ${
                  tier.featured ? 'border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20' : 'border-white/5'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-[#D4AF37] text-black font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Premium
                  </div>
                )}
                <div className={`text-5xl font-bold mb-2 ${tier.featured ? 'text-[#D4AF37]' : 'text-white'}`} style={{ fontFamily: 'var(--font-playfair)' }}>
                  {tier.price}
                </div>
                <div className="text-sm text-white/40 mb-1">par tâche</div>
                <div className="font-semibold mb-4 text-white/80">{tier.level}</div>
                <div className="text-sm text-white/40 leading-relaxed">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-32 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />
        <div className="relative container mx-auto max-w-3xl">
          <Image
            src="/images/lumiere-brothers-logo-cinema-dark.png"
            alt="Lumière Brothers Pictures Logo"
            width={200}
            height={100}
            className="mx-auto mb-8 opacity-40"
          />
          <h2 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Prêt à Entrer dans la
            <br />
            <span className="text-gold-gradient">Lumière ?</span>
          </h2>
          <p className="text-xl text-white/50 mb-10">
            Rejoignez la communauté des créateurs qui façonnent le cinéma de demain.
            <br />
            <span className="text-white/30">10 concepts actifs. 0 obstacles logistiques.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="group text-base px-8 py-4">
                Créer mon Compte Gratuit
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="xl" variant="outline" className="text-base px-8 py-4">
                Découvrir Notre Histoire
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
