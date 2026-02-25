import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light-theme">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden bg-[#F8F9FA] px-8 py-10 pl-16 sm:px-12 sm:py-12 sm:pl-16 lg:px-16 lg:py-14 lg:pl-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
