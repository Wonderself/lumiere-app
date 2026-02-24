import { NetflixHeader } from '@/components/netflix/netflix-header'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NetflixHeader />
      <main className="min-h-[calc(100vh-64px)] pt-16 md:pt-[68px]">{children}</main>
      <Footer />
    </>
  )
}
