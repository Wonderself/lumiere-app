import { NetflixHeader } from '@/components/netflix/netflix-header'
import { Footer } from '@/components/layout/footer'

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tv-theme">
      <NetflixHeader />
      {children}
      <Footer />
    </div>
  )
}
