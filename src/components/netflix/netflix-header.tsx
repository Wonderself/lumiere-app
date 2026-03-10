'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Sun,
  CreditCard,
  FileText,
  ChevronDown,
  Sparkles,
  Info,
  MapPin,
  Tag,
  Code2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'
import { SearchOverlay } from '@/components/search-overlay'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'

export function NetflixHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mobileLinks = [
    { href: '/', label: 'Home' },
    { href: '/films', label: 'Films' },
    { href: '/invest', label: 'Invest' },
    { href: '/community', label: 'Community' },
  ]

  const secondaryLinks = [
    { href: '/tasks', label: 'Create', icon: Sparkles },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/actors', label: 'Actors', icon: Users },
    { href: '/about', label: 'About', icon: Info },
    { href: '/pricing', label: 'Pricing', icon: Tag },
    { href: '/leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { href: '/roadmap', label: 'Roadmap', icon: MapPin },
    { href: '/developers', label: 'Developers', icon: Code2 },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      )}
    >
      <div className="flex h-14 md:h-[56px] items-center justify-between px-5 md:px-10 lg:px-16 mt-1">
        {/* Left: Logo only */}
        <Link href="/" className="flex items-center shrink-0 group relative">
          {/* Ambient glow behind logo */}
          <div
            className="absolute -inset-3 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%)' }}
          />
          <span className="relative text-xl md:text-2xl font-black tracking-[0.15em] text-white group-hover:tracking-[0.2em] transition-all duration-500">
            CINE<span
              className="text-[#E50914] relative"
              style={{ animation: 'logoGlowPulse 4s ease-in-out infinite' }}
            >GEN</span>
          </span>
          {/* Underline accent */}
          <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] overflow-hidden">
            <div
              className="h-full w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{ background: 'linear-gradient(90deg, transparent, #E50914, #FF2D2D, #E50914, transparent)' }}
            />
          </div>
        </Link>

        {/* Right: Discrete pillars + Search + Lang + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Discrete pillar links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link href="/films" className="text-[11px] text-white/30 hover:text-white/70 px-2 py-1 rounded transition-colors duration-300">Films</Link>
            <span className="text-white/10 text-[8px]">/</span>
            <Link href="/invest" className="text-[11px] text-white/30 hover:text-white/70 px-2 py-1 rounded transition-colors duration-300">Invest</Link>
            <span className="text-white/10 text-[8px]">/</span>
            <Link href="/community" className="text-[11px] text-white/30 hover:text-white/70 px-2 py-1 rounded transition-colors duration-300">Community</Link>
          </div>

          <div className="hidden md:block w-px h-4 bg-white/[0.06]" />

          <SearchOverlay />
          <LocaleSwitcher />

          {session?.user ? (
            <div className="hidden md:flex items-center gap-1.5">
              <NotificationBell />
              <Link href="/lumens" className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-white/50 hover:text-[#E50914] transition-all" aria-label="My Lumens">
                <Sun className="h-3.5 w-3.5 text-[#E50914]" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded px-1 py-1 hover:bg-white/5 transition-all outline-none" aria-label="Profile menu">
                    <Avatar className="h-7 w-7 rounded">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-[10px] rounded bg-[#E50914]/20 text-[#E50914]">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-white/30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-white/40">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <CreditCard className="h-4 w-4" /> Payments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <Sun className="h-4 w-4" /> Lumens
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                        <FileText className="h-4 w-4" /> Screenplays
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                          <Settings className="h-4 w-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-[12px] font-medium text-white/60 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="relative text-[12px] font-bold px-5 py-2 rounded-lg text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)' }}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white p-1.5 rounded transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl overflow-hidden border-t border-white/5"
          >
            <div className="px-5 py-4 space-y-1.5 max-h-[80vh] overflow-y-auto">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                      ? 'text-[#E50914] bg-[#E50914]/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-white/5 my-1.5" />
              <p className="px-3 text-[10px] uppercase tracking-widest text-white/20 font-medium">More</p>
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                    (pathname === link.href || pathname.startsWith(link.href + '/'))
                      ? 'text-[#E50914] bg-[#E50914]/10'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <link.icon className="h-4 w-4" /> {link.label}
                </Link>
              ))}

              <div className="h-px bg-white/5 my-1.5" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full transition-all"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm text-white/60 border border-white/10 rounded-full py-2.5 hover:bg-white/5 transition-all">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-white rounded-full py-2.5" style={{ background: 'linear-gradient(135deg, #E50914, #B20710)' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  )
}
