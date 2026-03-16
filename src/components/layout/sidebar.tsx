'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Star,
  User,
  CreditCard,
  Trophy,
  Film,
  Settings,
  Users,
  ClipboardCheck,
  BarChart3,
  Sun,
  Bell,
  FileText,
  Landmark,
  Wallet,
  TrendingUp,
  Heart,
  Clapperboard,
  Wand2,
  Play,
  Shield,
  DollarSign,
  AlertTriangle,
  Menu,
  X,
  Coins,
  Vote,
  Scale,
  Bot,
  UserCircle2,
  Scroll,
  Home,
  Compass,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useState, useEffect } from 'react'

const LEVEL_LABELS_MAP: Record<string, string> = {
  ROOKIE: 'Rookie',
  PRO: 'Pro',
  EXPERT: 'Expert',
  VIP: 'VIP',
}

type NavLink = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: string
}

type NavSection = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  dotColor: string
  links: NavLink[]
}

// ======= MAIN USER NAVIGATION (4 sections cinema) =======
const mainNavSections: NavSection[] = [
  {
    title: 'Home',
    icon: Home,
    dotColor: 'bg-[#E50914]',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/streaming', label: 'Streaming', icon: Play },
      { href: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Cinema',
    icon: Clapperboard,
    dotColor: 'bg-[#8B5CF6]',
    links: [
      { href: '/trailer-studio', label: 'Studio Bande-Annonce', icon: Wand2, badge: 'NEW' },
      { href: '/tasks', label: 'Micro-tâches', icon: Star },
      { href: '/films', label: 'Films', icon: Film },
      { href: '/screenplays', label: 'Scénarios', icon: FileText },
    ],
  },
  {
    title: 'Découvrir',
    icon: Compass,
    dotColor: 'bg-[#F43F5E]',
    links: [
      { href: '/community', label: 'Communauté', icon: Heart, exact: true },
      { href: '/community/contests', label: 'Concours', icon: Trophy },
      { href: '/community/scenarios', label: 'Votes Scénarios', icon: Scroll },
      { href: '/actors', label: 'Acteurs IA', icon: UserCircle2 },
      { href: '/leaderboard', label: 'Classement', icon: Trophy },
    ],
  },
  {
    title: 'Mon Compte',
    icon: User,
    dotColor: 'bg-[#10B981]',
    links: [
      { href: '/profile', label: 'Profil', icon: User },
      { href: '/credits', label: 'Crédits IA', icon: Coins, badge: 'NEW' },
      { href: '/profile/payments', label: 'Paiements', icon: CreditCard },
      { href: '/lumens', label: 'Mes Tokens', icon: Sun },
      { href: '/tokenization', label: 'Investir', icon: Coins, exact: true },
      { href: '/tokenization/portfolio', label: 'Portfolio', icon: Wallet },
      { href: '/tokenization/governance', label: 'Gouvernance', icon: Vote },
    ],
  },
]

// ======= ADMIN NAVIGATION =======
const adminNavSections: NavSection[] = [
  {
    title: 'Administration',
    icon: BarChart3,
    dotColor: 'bg-orange-400',
    links: [
      { href: '/admin', label: 'Vue Globale', icon: BarChart3, exact: true },
      { href: '/admin/interventions', label: 'Interventions', icon: AlertTriangle },
      { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },
  {
    title: 'Contenu',
    icon: Film,
    dotColor: 'bg-[#E50914]',
    links: [
      { href: '/admin/films', label: 'Films Studio', icon: Film },
      { href: '/admin/tasks', label: 'Tâches', icon: Star },
      { href: '/admin/screenplays', label: 'Scénarios', icon: FileText },
      { href: '/admin/catalog', label: 'Catalogue Streaming', icon: Play },
    ],
  },
  {
    title: 'Univers Film',
    icon: Clapperboard,
    dotColor: 'bg-rose-400',
    links: [
      { href: '/admin/actors', label: 'Acteurs IA', icon: UserCircle2 },
      { href: '/admin/bonus-content', label: 'Bonus Content', icon: Clapperboard },
      { href: '/admin/contests', label: 'Concours', icon: Trophy },
    ],
  },
  {
    title: 'Utilisateurs & Finance',
    icon: Users,
    dotColor: 'bg-green-400',
    links: [
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/reputation', label: 'Réputation', icon: Shield },
      { href: '/admin/payments', label: 'Paiements', icon: Wallet },
      { href: '/admin/payouts', label: 'Payouts', icon: DollarSign },
      { href: '/admin/reviews', label: 'Reviews IA', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Tokenization & Legal',
    icon: Coins,
    dotColor: 'bg-amber-400',
    links: [
      { href: '/admin/tokenization', label: 'Tokens Films', icon: Coins },
      { href: '/admin/legal', label: 'Conformité Légale', icon: Scale },
      { href: '/admin/ai-automation', label: 'Automatisation IA', icon: Bot },
      { href: '/admin/film-tokenizer', label: 'Tokenizer Films', icon: Wand2 },
    ],
  },
  {
    title: 'Système',
    icon: Settings,
    dotColor: 'bg-gray-400',
    links: [
      { href: '/admin/pilotage', label: 'Pilotage & Subventions', icon: Landmark, badge: 'NEW' },
      { href: '/admin/funding', label: 'Aides Publiques', icon: Landmark },
      { href: '/admin/settings', label: 'Paramètres', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAdminPage = pathname.startsWith('/admin')
  const userLevel = (session?.user as { level?: string })?.level
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const sections = isAdminPage && isAdmin ? adminNavSections : mainNavSections

  const sidebarContent = (
    <>
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 px-3 pt-1 pb-2">
              <span className={cn('w-1.5 h-1.5 rounded-full', section.dotColor)} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {section.title}
              </p>
            </div>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group',
                      isActive
                        ? 'bg-[#E50914]/10 text-[#E50914] font-medium'
                        : 'text-white/60 hover:text-[#E50914] hover:bg-white/[0.05]'
                    )}
                  >
                    <link.icon className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-[#E50914]' : 'text-white/50 group-hover:text-[#E50914]'
                    )} />
                    <span className="flex-1">{link.label}</span>
                    {link.badge && (
                      <Badge className="text-[9px] px-1.5 py-0 h-4 bg-[#E50914]/15 text-[#E50914] border-[#E50914]/20">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {isAdminPage && isAdmin && (
        <div className="px-3 pb-3">
          <Separator className="mb-3 bg-white/10" />
          <div className="flex items-center gap-2 px-3 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em]">
              Utilisateur
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-[#E50914] hover:bg-white/[0.05] transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      )}

      {session?.user && (
        <div className="p-3 border-t border-white/10">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs bg-[#E50914]/10 text-[#E50914]">
                {getInitials(session.user.name || session.user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-[#E50914] transition-colors">
                {session.user.name || 'Utilisateur'}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-[#E50914]/20 text-[#E50914]/70">
                  {LEVEL_LABELS_MAP[userLevel || 'ROOKIE'] || 'Rookie'}
                </Badge>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[72px] left-3 z-40 h-10 w-10 rounded-lg bg-[#111]/90 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors backdrop-blur-sm shadow-sm"
        aria-label="Ouvrir le menu latéral"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-[#0A0A0A] border-r border-white/10 flex flex-col transition-transform duration-300 shadow-xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          <span className="text-sm font-bold text-white font-[family-name:var(--font-playfair)]">CINEGEN</span>
          <button onClick={() => setMobileOpen(false)} className="h-8 w-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/50">
            <X className="h-4 w-4" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/10 bg-[#0A0A0A] min-h-[calc(100vh-64px)] flex-col">
        {sidebarContent}
      </aside>
    </>
  )
}
