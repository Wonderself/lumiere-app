import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/[0.04] blur-[180px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#D4AF37]/[0.03] blur-[150px]" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#F0D060]/[0.02] blur-[120px]" />
        {/* Subtle film grain overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* Auth Header */}
      <div className="p-6 sm:p-8 relative z-10">
        <Link href="/" className="group flex items-center gap-2.5 w-fit transition-opacity duration-500 hover:opacity-80">
          <div className="relative">
            <Clapperboard className="h-7 w-7 text-[#D4AF37] transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="text-lg font-bold text-white/90 tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
            LUMIÈRE
          </span>
        </Link>
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="relative z-10 px-8 pb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <p className="text-center text-xs text-white/20 mt-4">
          &copy; {new Date().getFullYear()} Lumière Brothers Pictures
        </p>
      </div>
    </div>
  )
}
