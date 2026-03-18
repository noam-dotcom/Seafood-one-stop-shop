import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'SeaHub — Global Seafood Industry Platform',
  description: 'The Bloomberg + Alibaba + LinkedIn of the seafood world. Buy, sell, trade, and access real-time seafood market intelligence.',
  keywords: ['seafood', 'fish', 'marketplace', 'B2B', 'seafood prices', 'fish trading', 'aquaculture'],
  openGraph: {
    title: 'SeaHub — Global Seafood Industry Platform',
    description: 'Professional seafood trading marketplace with real-time price intelligence, AI-powered insights, and verified suppliers worldwide.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
