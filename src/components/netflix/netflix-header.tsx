'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Film,
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
  Play,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'

export function NetflixHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  // Track scroll for header transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/films', label: 'Films' },
    { href: '/streaming', label: 'Streaming' },
    { href: '/community', label: 'Communaute' },
    { href: '/actors', label: 'Acteurs' },
    { href: '/leaderboard', label: 'Classement' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-[#0A0A0A]/80 to-transparent'
      )}
    >
      <div className="flex h-16 md:h-[68px] items-center justify-between px-4 md:px-12">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Logo - bigger */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/lumiere-brothers-logo-cinema-dark.webp"
              alt="Lumiere Brothers Pictures"
              width={180}
              height={50}
              className="h-8 md:h-10 w-auto object-contain hover:brightness-110 transition-all"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/60 hover:text-white/90'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            {session?.user && (
              <Link
                href="/tasks"
                className={cn(
                  'px-3 py-1.5 rounded text-[13px] font-medium transition-all duration-200 flex items-center gap-1',
                  pathname.startsWith('/tasks')
                    ? 'text-[#D4AF37] font-bold'
                    : 'text-white/60 hover:text-white/90'
                )}
              >
                <Sparkles className="h-3 w-3" />
                Taches
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center gap-3">
          {/* Search icon */}
          <button className="hidden md:flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Search className="h-4 w-4 text-white/60" />
          </button>

          {session?.user ? (
            <div className="hidden lg:flex items-center gap-2">
              <NotificationBell />
              <Link href="/lumens" className="flex items-center gap-1.5 px-2.5 py-1 rounded text-sm text-white/50 hover:text-[#D4AF37] transition-all">
                <Sun className="h-4 w-4 text-[#D4AF37]" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded px-1 py-1 hover:bg-white/5 transition-all outline-none">
                    <Avatar className="h-8 w-8 rounded">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-xs rounded bg-[#D4AF37]/20 text-[#D4AF37]">{getInitials(userName)}</AvatarFallback>
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
                      <User className="h-4 w-4" /> Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <CreditCard className="h-4 w-4" /> Paiements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <Sun className="h-4 w-4" /> Mes Lumens
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                        <FileText className="h-4 w-4" /> Mes Scenarios
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                          <Settings className="h-4 w-4" /> Administration
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Se deconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white px-3 py-1.5 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-5 py-2 rounded text-black hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)' }}
              >
                S&apos;inscrire
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-white/60 hover:text-white p-2 rounded transition-all"
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
            className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-xl overflow-hidden border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all',
                    (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {session?.user && (
                <Link
                  href="/tasks"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Sparkles className="h-4 w-4" /> Taches
                </Link>
              )}
              <div className="h-px bg-white/5 my-2" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-3 py-3 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full transition-all"
                  >
                    <LogOut className="h-4 w-4" /> Se deconnecter
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm text-white/60 border border-white/10 rounded-lg py-2.5 hover:bg-white/5 transition-all">
                    Connexion
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-black rounded-lg py-2.5" style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)' }}>
                    S&apos;inscrire
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
