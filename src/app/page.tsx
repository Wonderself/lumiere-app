import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Film,
  Palette,
  Sparkles,
  Globe,
  Users,
  Zap,
  Camera,
  Star,
  CheckCircle,
  Play,
  Mic,
  Wand2,
  TrendingUp,
  Shield,
  Award,
} from 'lucide-react'

export const metadata = {
  title: 'Lumiere Brothers Pictures — Cinema & Creators Studio IA',
  description:
    'Studio IA tri-continental. Production de films IA, micro-taches creatives, outils pour createurs. Paris, Tel Aviv, Hollywood.',
}

/* ─── Instagram gradient palette ─── */
const IG = {
  purple: '#833AB4',
  pink: '#E1306C',
  orange: '#F77737',
  yellow: '#FCAF45',
  gold: '#D4AF37',
}

export default function HubLandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* ═══════════════════════════════════════════
          NAVIGATION BAR
          ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-2xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/lumiere-brothers-logo-cinema-dark.png"
              alt="Lumiere Brothers Pictures"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#about" className="text-white/50 hover:text-white transition-colors">
              Qui sommes-nous
            </a>
            <a href="#platforms" className="text-white/50 hover:text-white transition-colors">
              Nos Plateformes
            </a>
            <a href="#pricing" className="text-white/50 hover:text-white transition-colors">
              Tarification
            </a>
            <a href="#team" className="text-white/50 hover:text-white transition-colors">
              L&apos;Equipe
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="text-sm px-5 py-2 rounded-full font-medium text-black transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO SECTION — Full viewport
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20"
            style={{ background: IG.purple }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
            style={{ background: IG.pink }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10"
            style={{ background: IG.orange }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm mb-10 backdrop-blur-sm"
            style={{
              borderColor: 'rgba(131, 58, 180, 0.3)',
              background: 'rgba(131, 58, 180, 0.1)',
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: IG.yellow }} />
            <span className="text-white/70">
              Cinema & Creative Studio — Paris &middot; Tel Aviv &middot; Hollywood
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="text-white">Le Studio de</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Demain.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-12 leading-relaxed">
            Lumiere Brothers Pictures fusionne le meilleur du cinema traditionnel avec la
            puissance de l&apos;intelligence artificielle. Deux plateformes, une vision.
          </p>

          {/* Two CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="#platforms"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Decouvrir nos Plateformes
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              Notre Histoire
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { label: 'Films en Production', value: '5+', icon: Film },
              { label: 'Micro-Taches', value: '200+', icon: Star },
              { label: 'Createurs Actifs', value: '50+', icon: Users },
              { label: 'Continents', value: '3', icon: Globe },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-white/20" />
                <div
                  className="text-3xl md:text-4xl font-bold mb-1 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/35 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/20 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT SECTION — Qui sommes-nous
          ═══════════════════════════════════════════ */}
      <section id="about" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                }}
              >
                Qui sommes-nous
              </p>
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                We don&apos;t prompt.
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                  }}
                >
                  We direct AI.
                </span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-6">
                Lumiere Brothers Pictures est un studio cinematographique IA de nouvelle generation,
                fonde par des veterans de TF1, Lagardere et Shine. Nous ne generons pas du contenu.
                Nous dirigeons l&apos;IA comme un realisateur dirige ses acteurs.
              </p>
              <p className="text-white/35 leading-relaxed mb-8">
                Avec un reseau financier ancre dans le CPA #1 de France et un pont vers Hollywood,
                nous transformons les histoires en experiences cinematographiques a l&apos;echelle
                mondiale.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Production IA', 'Micro-Taches', 'Streaming', 'Book-to-Screen', 'Tokenisation'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full text-xs font-medium border border-white/10 text-white/50 hover:border-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl blur-3xl opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                }}
              />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/human-meets-ai-creative-collision.png"
                  alt="L'humain rencontre l'IA - Vision creative Lumiere Brothers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THREE PILLARS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.pink}, ${IG.orange})`,
              }}
            >
              Notre Ecosysteme
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Un Studio. Deux Mondes.
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Cinema pour les films. Creators pour les outils. Un seul compte, des possibilites
              infinies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Film,
                title: 'Produire',
                desc: 'Des films IA complets — de l\'horreur a l\'animation, du biopic au thriller. Chaque production est decoupee en micro-taches accessibles a tous.',
                gradient: `${IG.purple}, ${IG.pink}`,
              },
              {
                icon: Palette,
                title: 'Creer',
                desc: 'Outils de creation IA pour video, audio, design, branding. Generez du contenu professionnel guide etape par etape.',
                gradient: `${IG.pink}, ${IG.orange}`,
              },
              {
                icon: TrendingUp,
                title: 'Gagner',
                desc: 'Realisez des micro-taches, soyez paye instantanement. De 50 EUR a 500 EUR par tache. Seulement 20% de commission sur les tokens.',
                gradient: `${IG.orange}, ${IG.yellow}`,
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-white/10 transition-all duration-500"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.gradient})`,
                    filter: 'blur(40px)',
                    opacity: 0,
                  }}
                />
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.gradient})`,
                    opacity: 0.15,
                  }}
                >
                  <pillar.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORMS SECTION — Choose your path
          ═══════════════════════════════════════════ */}
      <section id="platforms" className="py-32 px-6 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${IG.purple}, transparent 60%), radial-gradient(ellipse at 70% 50%, ${IG.orange}, transparent 60%)`,
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
              }}
            >
              Choisissez votre Univers
            </p>
            <h2
              className="text-4xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Deux Plateformes, Une Vision
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ─── Cinema Card ─── */}
            <Link href="/cinema" className="group block">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-[0_0_60px_rgba(212,175,55,0.1)]">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/cinema-clapperboard-clouds-hero.png"
                    alt="Lumiere Cinema - Films IA"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D4AF37] text-black">
                      Cinema
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3
                    className="text-2xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    Lumiere Cinema
                  </h3>
                  <p className="text-white/40 leading-relaxed mb-6 text-sm">
                    Production collaborative de films IA. Contribuez a des productions
                    cinematographiques en realisant des micro-taches creatives payees. Streaming,
                    bandes-annonces, votre visage dans le film.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: Film, label: 'Films IA' },
                      { icon: Play, label: 'Streaming' },
                      { icon: Camera, label: 'Face-Swap' },
                      { icon: Star, label: 'Micro-Taches' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-xs text-white/35 p-2 rounded-lg bg-white/[0.02]"
                      >
                        <item.icon className="h-3.5 w-3.5 text-[#D4AF37]" />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm group-hover:gap-3 transition-all">
                    Entrer dans le Cinema
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Dark theme indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F0D060]" />
              </div>
            </Link>

            {/* ─── Creators Card ─── */}
            <a
              href={process.env.NEXT_PUBLIC_CREATORS_URL || 'http://localhost:3001'}
              className="group block"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(131,58,180,0.1)]">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/images/ai-film-production-team-meeting.png"
                    alt="Lumiere Creators - Outils IA pour createurs"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-black"
                      style={{
                        background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                      }}
                    >
                      Creators
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3
                    className="text-2xl font-bold mb-3 transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    <span
                      className="group-hover:bg-clip-text group-hover:text-transparent transition-all"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                      }}
                    >
                      Lumiere Creators
                    </span>
                  </h3>
                  <p className="text-white/40 leading-relaxed mb-6 text-sm">
                    Outils de creation IA guides etape par etape. Video, design, audio, branding.
                    Marketplace de micro-taches style MALT. Gagnez de l&apos;argent en realisant des
                    services IA pour des clients.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: Wand2, label: 'Video IA' },
                      { icon: Palette, label: 'Design' },
                      { icon: Mic, label: 'Audio' },
                      { icon: TrendingUp, label: 'Revenus' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-xs text-white/35 p-2 rounded-lg bg-white/[0.02]"
                      >
                        <item.icon className="h-3.5 w-3.5" style={{ color: IG.pink }} />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                    }}
                  >
                    Explorer les Outils Createurs
                    <ArrowRight className="h-4 w-4 text-[#E1306C]" />
                  </div>
                </div>

                {/* Gradient theme indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
                  }}
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SHOWCASE — What we create
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Nos Creations
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Du Concept au Grand Ecran
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Animation, horreur, science-fiction, restauration, hybride live/IA — chaque genre est
              notre terrain de jeu.
            </p>
          </div>

          {/* Image grid like videoinu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                src: '/images/genre-versatility-meeting-characters.png',
                alt: 'Polyvalence des genres - personnages IA',
                label: 'Animation 3D',
              },
              {
                src: '/images/studio-workflow-maison-desk.png',
                alt: 'Workflow maison - production IA',
                label: 'Workflow Studio',
              },
              {
                src: '/images/book-to-screen-film-reels-ip.png',
                alt: 'Book-to-screen - IP cinema',
                label: 'Book-to-Screen',
              },
              {
                src: '/images/ai-film-production-team-meeting.png',
                alt: 'Equipe de production IA',
                label: 'Production IA',
              },
            ].map((img) => (
              <div key={img.label} className="group relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Second row — wider images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                src: '/images/editions-ruppin-library-partnership.png',
                alt: 'Editions Ruppin - Partenariat book-to-screen',
                label: 'Editions Ruppin',
              },
              {
                src: '/images/lumiere-team-startup-office.png',
                alt: 'Equipe Lumiere Brothers',
                label: 'Notre Equipe',
              },
              {
                src: '/images/lumiere-office-contact-touch.png',
                alt: 'Bureau Lumiere Brothers',
                label: 'Nos Bureaux',
              },
            ].map((img) => (
              <div
                key={img.label}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING — 20% Token Advantage
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-32 px-6 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${IG.pink}, transparent 60%)`,
          }}
        />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.pink}, ${IG.orange})`,
              }}
            >
              Tarification Revolutionnaire
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              75% Moins Cher que les Concurrents
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Pas d&apos;abonnement mensuel couteux. Nous ne prenons que 20% de commission sur les
              tokens. Vous gardez 80% de vos revenus.
            </p>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Competitors */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Les Autres</h3>
                  <p className="text-xs text-white/30">Modele classique</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  'Abonnement mensuel 29-99 EUR/mois',
                  'Tokens limites par plan',
                  'Fonctionnalites verrouillees',
                  'Pas de revenus pour les createurs',
                  'Support premium payant',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/35">
                    <div className="h-5 w-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <span className="text-red-400 text-xs">x</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <span className="text-3xl font-bold text-white/20 line-through">99 EUR</span>
                <span className="text-sm text-white/20 block mt-1">par mois</span>
              </div>
            </div>

            {/* Lumiere */}
            <div
              className="rounded-2xl border p-8 relative overflow-hidden"
              style={{ borderColor: 'rgba(131, 58, 180, 0.3)' }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                      opacity: 0.2,
                    }}
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Lumiere Brothers</h3>
                    <p className="text-xs text-white/30">Modele token</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    'Aucun abonnement — Payez uniquement ce que vous utilisez',
                    'Seulement 20% de commission sur les tokens',
                    'Toutes les fonctionnalites incluses',
                    'Gagnez de l\'argent en realisant des taches',
                    'Support communautaire gratuit + IA',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/50">
                      <div
                        className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})` }}
                      >
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <span
                    className="text-5xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange})`,
                      fontFamily: 'var(--font-playfair)',
                    }}
                  >
                    20%
                  </span>
                  <span className="text-sm text-white/40 block mt-1">
                    de commission sur les tokens uniquement
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token tiers */}
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                tokens: '100',
                price: '10 EUR',
                desc: 'Ideal pour tester',
                gradient: `${IG.purple}, ${IG.pink}`,
              },
              {
                name: 'Pro',
                tokens: '500',
                price: '45 EUR',
                desc: 'Pour les createurs reguliers',
                gradient: `${IG.pink}, ${IG.orange}`,
                featured: true,
              },
              {
                name: 'Studio',
                tokens: '2000',
                price: '150 EUR',
                desc: 'Pour les equipes et studios',
                gradient: `${IG.orange}, ${IG.yellow}`,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 text-center relative ${
                  tier.featured ? 'border-white/15' : 'border-white/5'
                } bg-white/[0.02]`}
              >
                {tier.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-black"
                    style={{
                      background: `linear-gradient(135deg, ${tier.gradient})`,
                    }}
                  >
                    Populaire
                  </div>
                )}
                <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-3">
                  {tier.name}
                </h4>
                <div
                  className="text-4xl font-bold mb-1 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${tier.gradient})`,
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  {tier.tokens}
                </div>
                <p className="text-xs text-white/30 mb-3">tokens</p>
                <p className="text-lg font-bold text-white mb-1">{tier.price}</p>
                <p className="text-xs text-white/30">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM SECTION
          ═══════════════════════════════════════════ */}
      <section id="team" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/lumiere-team-startup-office.png"
                alt="Equipe Lumiere Brothers Pictures"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 to-transparent" />
            </div>
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                }}
              >
                L&apos;Equipe
              </p>
              <h2
                className="text-4xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                The Dreams Team
              </h2>

              <div className="space-y-8">
                {/* Emmanuel */}
                <div className="flex gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                      opacity: 0.15,
                    }}
                  >
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Emmanuel Smadja</h3>
                    <p
                      className="text-sm font-medium mb-2 bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink})`,
                      }}
                    >
                      CEO & Co-Fondateur
                    </p>
                    <p className="text-sm text-white/35 leading-relaxed">
                      Ex-TF1, Lagardere, Shine Group. Expertise en production audiovisuelle Prime
                      Time, financement et distribution. CPA #1 de France, FinTech Advisory Board.
                    </p>
                  </div>
                </div>

                {/* Eric */}
                <div className="flex gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${IG.pink}, ${IG.orange})`,
                      opacity: 0.15,
                    }}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Eric Haldezos</h3>
                    <p
                      className="text-sm font-medium mb-2 bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${IG.pink}, ${IG.orange})`,
                      }}
                    >
                      CCO & Co-Fondateur
                    </p>
                    <p className="text-sm text-white/35 leading-relaxed">
                      Realisateur IA prime aux festivals internationaux. Pionnier de la direction
                      artistique par IA. Expert en workflow proprietaire cinema IA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Globe, label: '3 Continents' },
                  { icon: Award, label: 'Festivals Prime' },
                  { icon: Shield, label: 'CPA #1 France' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 text-xs text-white/30 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                  >
                    <badge.icon className="h-3.5 w-3.5" style={{ color: IG.yellow }} />
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PARTNERSHIP — Editions Ruppin
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${IG.orange}, ${IG.yellow})`,
                }}
              >
                Partenariat Strategique
              </p>
              <h2
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Editions Ruppin : Du Livre a l&apos;Ecran
              </h2>
              <p className="text-white/40 leading-relaxed mb-6">
                Nous detenons 33% d&apos;Editions Ruppin, que nous transformons en startup tech
                &quot;Book-to-Screen&quot;. Acces prioritaire a chaque biographie et recit
                historique pour en faire des films IA.
              </p>
              <div className="space-y-3">
                {[
                  'First-Look Deal sur toutes les publications',
                  'IP Co-Detenue — droits cinematographiques inclus',
                  'Pipeline : Heritage, Hybrid, Pulse',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/45">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: IG.yellow }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/editions-ruppin-library-partnership.png"
                alt="Editions Ruppin - Partenariat Lumiere Brothers"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA FINAL
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${IG.purple}, transparent 60%)`,
          }}
        />

        <div className="relative z-10 container mx-auto max-w-3xl">
          <Image
            src="/images/lumiere-brothers-logo-cinema-dark.png"
            alt="Lumiere Brothers Pictures"
            width={200}
            height={100}
            className="mx-auto mb-8 opacity-30"
          />
          <h2
            className="text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pret a Entrer dans la
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Lumiere ?
            </span>
          </h2>
          <p className="text-xl text-white/40 mb-10">
            Rejoignez la communaute qui invente le cinema et la creation de demain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-black transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${IG.purple}, ${IG.pink}, ${IG.orange}, ${IG.yellow})`,
              }}
            >
              Creer mon Compte Gratuit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              Decouvrir Notre Histoire
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <Image
                src="/images/lumiere-brothers-logo-cinema-dark.png"
                alt="Lumiere Brothers Pictures"
                width={180}
                height={50}
                className="h-10 w-auto object-contain"
              />
              <p className="text-sm text-white/35 leading-relaxed max-w-sm">
                Cinema & Creative Studio. Le studio aux possibilites infinies. Nous dirigeons
                l&apos;IA pour creer le cinema de demain.
              </p>
              <p className="text-xs text-white/20">Paris &middot; Tel Aviv &middot; Hollywood</p>
            </div>

            {/* Cinema */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Cinema
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/films"
                    className="text-sm text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    Films
                  </Link>
                </li>
                <li>
                  <Link
                    href="/streaming"
                    className="text-sm text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    Streaming
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    className="text-sm text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    Taches
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="text-sm text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    Classement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Creators */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Creators
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_CREATORS_URL || 'http://localhost:3001'}
                    className="text-sm text-white/30 hover:text-[#E1306C] transition-colors"
                  >
                    Outils IA
                  </a>
                </li>
                <li>
                  <a
                    href={(process.env.NEXT_PUBLIC_CREATORS_URL || 'http://localhost:3001') + '/tasks'}
                    className="text-sm text-white/30 hover:text-[#E1306C] transition-colors"
                  >
                    Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href={(process.env.NEXT_PUBLIC_CREATORS_URL || 'http://localhost:3001') + '/about'}
                    className="text-sm text-white/30 hover:text-[#E1306C] transition-colors"
                  >
                    A Propos
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    CGU
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    Confidentialite
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/15">
              &copy; 2026 Lumiere Brothers Pictures. Tous droits reserves.
            </p>
            <p className="text-xs text-white/15">
              Construit avec passion a Paris, Tel Aviv & Hollywood
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
