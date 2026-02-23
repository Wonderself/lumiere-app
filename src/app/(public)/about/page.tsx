import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Film,
  Users,
  Layers,
  Cpu,
  Shield,
  Sparkles,
  Globe,
  BookOpen,
  Building2,
  Award,
  ArrowRight,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Landmark,
  Lightbulb,
  Clapperboard,
  MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À Propos — Lumière Brothers Pictures',
  description:
    'Découvrez Lumière Brothers Pictures : le studio de cinéma IA fondé par Emmanuel Smadja (TF1, Lagardère) et Eric Haldezos (réalisateur primé). Paris · Tel Aviv · Hollywood.',
}

const pipeline = [
  { name: 'Project Heritage', desc: 'Biopics sourcés directement du catalogue d\'Éditions Ruppin', icon: BookOpen },
  { name: 'Project Hybrid', desc: 'Drames live-action enrichis par des environnements IA', icon: Layers },
  { name: 'Project Pulse', desc: 'Films de genre high-concept (Thriller/Sci-Fi)', icon: Sparkles },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium mb-8">
            <Clapperboard className="h-3.5 w-3.5" />
            Cinema & Creative Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            <span className="text-gold-gradient">The Dreams Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto leading-relaxed mb-4">
            Une fusion de pedigree majeur et d&apos;IA de nouvelle génération.
          </p>
          <p className="text-lg text-white/30 max-w-2xl mx-auto">
            &quot;La disruption, ce n&apos;est pas détruire le passé. C&apos;est l&apos;upgrader.&quot;
          </p>
        </div>
      </section>

      {/* ═══════════ L'EQUIPE FONDATRICE ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/lumiere-team-startup-office.png"
                alt="L'équipe fondatrice de Lumière Brothers Pictures"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            </div>
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Les Fondateurs</p>
              <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
                L&apos;Expertise <span className="text-gold-gradient">Prime Time</span> à l&apos;Ère de l&apos;IA
              </h2>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Emmanuel Smadja</h3>
                      <p className="text-sm text-[#D4AF37]">CEO</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Production Executive pour les programmes Tier-1 (TF1)</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Expérience grands groupes : Lagardère, Shine/DMLSTV</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Expertise TV haut budget & événements live</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Eric Haldezos</h3>
                      <p className="text-sm text-[#D4AF37]">CCO</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Réalisateur de films IA primé</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Spécialiste innovation documentaire</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Reconnaissance festivals internationaux</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />Expérience lourde en production TV</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-white/30 text-sm italic">
                &quot;We bring Prime Time rigor to the AI era.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PHILOSOPHIE & GENRES ═══════════ */}
      <section className="py-20 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Notre Philosophie</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                <span className="text-gold-gradient">&quot;We don&apos;t prompt. We direct AI.&quot;</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Production Genre-Agnostique : notre workflow maison propriétaire s&apos;améliore
                chaque jour grâce à un système d&apos;amélioration continue &quot;sauce secrète&quot;.
                Nous pouvons créer du film d&apos;horreur glaçant au divertissement familial animé.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Animation 3D & Stop-Motion',
                  'Horreur & Thriller Psychologique',
                  'Films Historiques IA',
                  'Science-Fiction Futuriste',
                  'Restauration de Films Classiques',
                  'Hybride Live-Action + IA',
                ].map((genre) => (
                  <div key={genre} className="flex items-center gap-2 text-sm text-white/50">
                    <Film className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                    {genre}
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm text-white/30 italic">
                &quot;Let&apos;s start to ART.&quot;
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/genre-versatility-meeting-characters.png"
                alt="Versatilité des genres - Personnages de différents genres de film IA"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EDITIONS RUPPIN ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/editions-ruppin-library-partnership.png"
                alt="Éditions Ruppin - Bibliothèque et partenariat book-to-screen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">L&apos;Atout Stratégique</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                IP & Equity :{' '}
                <span className="text-gold-gradient">Éditions Ruppin</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Participation de 33% dans Éditions Ruppin, une maison d&apos;édition que nous
                transformons en startup tech &quot;Book-to-Screen&quot; scalable grâce à nos outils IA propriétaires.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <BookOpen className="h-5 w-5 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">First-Look Deal</h4>
                    <p className="text-sm text-white/40">Accès prioritaire à chaque biographie et récit historique avant le marché.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <Shield className="h-5 w-5 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">IP Co-Détenue</h4>
                    <p className="text-sm text-white/40">Nous ne faisons pas qu&apos;adapter des histoires — nous co-détenons les droits.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <TrendingUp className="h-5 w-5 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Écosystème Scalable</h4>
                    <p className="text-sm text-white/40">Transformation d&apos;une maison d&apos;édition traditionnelle en pipeline cinéma IA à grande échelle.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/30 italic">
                &quot;Nous contrôlons l&apos;histoire du premier mot imprimé au dernier pixel.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INFRASTRUCTURE ═══════════ */}
      <section className="py-20 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">L&apos;Infrastructure</p>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Un Backbone de <span className="text-gold-gradient">Qualité Industrielle</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              L&apos;agilité de la Silicon Valley rencontre la rigueur du système studio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                <Landmark className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Le Bouclier Financier</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-3">Europe/Israël</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />Cabinet CPA #1 en France (crédits d&apos;impôt & subventions médias)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />Advisory Board dirigé par le CMO d&apos;un leader mondial FinTech</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                <Globe className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Le Pont Hollywood</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-3">USA</p>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />Partenaire d&apos;expansion stratégique à Los Angeles</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />Liaison dédiée au scouting de talents et deals de co-production US</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-5">
                <Building2 className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3 Continents</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-3">Réseau mondial</p>
              <div className="space-y-3">
                {[
                  { city: 'Paris', role: 'QG Créatif & Production' },
                  { city: 'Tel Aviv', role: 'R&D Tech & IA' },
                  { city: 'Hollywood', role: 'Distribution & Talents' },
                ].map((loc) => (
                  <div key={loc.city} className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span className="font-medium">{loc.city}</span>
                    <span className="text-white/30">— {loc.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PIPELINE ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-4">Le Pipeline</p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Projets en <span className="text-gold-gradient">Développement</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Un double moteur de croissance : Studio Services (cash-flow via commerciaux haut de gamme pour marques & agences)
                et Original Pictures (richesse long terme via propriété et licence d&apos;IP).
              </p>
              <div className="space-y-4 mb-8">
                {pipeline.map((project) => (
                  <div key={project.name} className="flex gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/15 transition-colors">
                    <project.icon className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{project.name}</h4>
                      <p className="text-sm text-white/40">{project.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15">
                <Lightbulb className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <p className="text-sm text-white/60"><strong className="text-[#D4AF37]">10 concepts actifs.</strong> 0 obstacles logistiques.</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/book-to-screen-film-reels-ip.png"
                alt="Pipeline de production - Du livre au film IA"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ BUSINESS MODEL ═══════════ */}
      <section className="py-20 px-4 bg-white/[0.01]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">Le Modèle</p>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Double Moteur de <span className="text-gold-gradient">Croissance</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-gold rounded-2xl p-8">
              <Cpu className="h-8 w-8 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Studio Services</h3>
              <p className="text-white/50 leading-relaxed mb-4">Génération de cash-flow via commerciaux haut de gamme pour marques & agences.</p>
              <p className="text-sm text-white/30">Revenue stream #1 — Court terme</p>
            </div>
            <div className="glass-gold rounded-2xl p-8">
              <Film className="h-8 w-8 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Original Pictures</h3>
              <p className="text-white/50 leading-relaxed mb-4">Richesse long terme via propriété d&apos;IP et licensing des films originaux.</p>
              <p className="text-sm text-white/30">Revenue stream #2 — Long terme</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TECHNOLOGIE ═══════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-3">La Technologie</p>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Notre Stack Technique
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Cpu, title: 'IA Claude', desc: 'Évaluation des soumissions, feedback intelligent, scoring automatique de chaque contribution.' },
              { icon: Shield, title: 'Provenance SHA-256', desc: 'Chaque contribution hashée et horodatée pour la traçabilité et la preuve de paternité.' },
              { icon: Sparkles, title: 'Pipeline Automatisé', desc: 'De la soumission à la distribution : transcoding, sous-titrage multi-langues, assemblage final.' },
              { icon: Users, title: 'Micro-Tâches Collaboratives', desc: 'Chaque film découpé en centaines de tâches guidées, accessibles à tous les niveaux.' },
            ].map((tech) => (
              <div key={tech.title} className="flex gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/15 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <tech.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{tech.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT / CTA ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="/images/lumiere-office-contact-touch.png"
                alt="Contactez Lumière Brothers Pictures"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Le Studio de Demain.{' '}
                <span className="text-gold-gradient">Ouvert Aujourd&apos;hui.</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <p className="text-sm text-white/60"><strong className="text-white">Investisseurs :</strong> Rejoignez la scalabilité du modèle &quot;Studio Hybride&quot;.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <p className="text-sm text-white/60"><strong className="text-white">Partenaires :</strong> Racontons vos histoires avec les outils de la prochaine génération.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <p className="text-sm text-white/60"><strong className="text-white">Créateurs :</strong> Votre talent a sa place dans le cinéma de demain.</p>
                </div>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold transition-colors"
              >
                Rejoindre Lumière
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
