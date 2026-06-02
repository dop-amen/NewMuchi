import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import MessengerFloat from '@/components/MessengerFloat'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'MuchiBari - Premium Leather Goods',
  description: 'Handcrafted leather sandals and accessories. Quality craftsmanship meets timeless style.',
  keywords: ['leather sandals', 'leather goods', 'handcrafted', 'premium footwear', 'Bangladesh'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
  <MessengerFloat />
</body>
    </html>
  )
}
