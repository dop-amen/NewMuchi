'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, UserCircle, Menu, X, Home, ShoppingBag, MessageCircle, ShoppingCart, LogIn } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/data'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

const categories = [
  'Casual Shoes', 'Oxford Shoes', 'Loafer Shoes', 'Formal Shoes',
  'Boots', 'Ladies Shoes', 'Winter Collection', 'Flat Sandals', 'Belts'
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger */}
            <button onClick={() => setDrawerOpen(true)} className="p-2 text-foreground">
              <Menu className="w-6 h-6" />
            </button>

            {/* Center: Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/images/logo.png"
                alt="MuchiBari"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Right: Call + Profile */}
            <div className="flex items-center gap-3">
              <a href={`tel:${WHATSAPP_NUMBER}`} className="p-2 text-primary">
                <Phone className="w-5 h-5" />
              </a>
              {user ? (
                <button onClick={handleLogout} className="p-2 text-foreground/60 hover:text-red-500 transition-colors">
                  <UserCircle className="w-6 h-6" />
                </button>
              ) : (
                <Link href="/auth/login" className="p-2 text-foreground/60 hover:text-primary transition-colors">
                  <UserCircle className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          {/* Drawer */}
          <div className="relative bg-white w-72 h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg text-[#5C3317]">Categories</span>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              <Link href="/" onClick={() => setDrawerOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-[#FAF5EF] text-foreground font-medium transition-colors">
                Home
              </Link>
              <Link href="/shop" onClick={() => setDrawerOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-[#FAF5EF] text-foreground font-medium transition-colors">
                Shop
              </Link>
              <div className="border-t my-2" />
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setDrawerOpen(false)}
                  className="py-3 px-4 rounded-lg hover:bg-[#FAF5EF] text-foreground/80 transition-colors">
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg md:hidden">
  
  <div className="grid grid-cols-5 h-16 items-center">
    <Link href="/shop" className="flex flex-col items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary transition-colors">
      <ShoppingBag className="w-5 h-5" />
      <span>Shop</span>
    </Link>
    
    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary transition-colors">
      <MessageCircle className="w-5 h-5" />
      <span>Message</span>
    </a>
    
    <Link href="/" className="flex flex-col items-center justify-center text-xs relative">
      {/* Absolute positioning wrapper keeps the layout box intact while allowing the button to float up */}
      <div className="absolute -top-10 flex flex-col items-center">
        <div className="bg-primary text-white rounded-full p-3 shadow-lg">
          <Home className="w-5 h-5" />
        </div>
        <span className="text-xs text-foreground/60 mt-1">Home</span>
      </div>
    </Link>
    
    <Link href="/cart" className="flex flex-col items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary transition-colors">
      <ShoppingCart className="w-5 h-5" />
      <span>Cart</span>
    </Link>
    
    {user ? (
      <Link href="/profile" className="flex flex-col items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary transition-colors">
        <UserCircle className="w-5 h-5" />
        <span>Profile</span>
      </Link>
    ) : (
      <Link href="/auth/login" className="flex flex-col items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary transition-colors">
        <LogIn className="w-5 h-5" />
        <span>Login</span>
      </Link>
    )}
  </div>
</nav>
    </>
  )
}