import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/data'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function Footer() {
  const supabase = await createSupabaseServer()
  const { data: categories } = await supabase.from('categories').select('name, slug').limit(3)

  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/images/logoWhite.png" alt="Muchi Bari" width={140} height={40}
              className="h-10 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              প্রিমিয়াম লেদার প্রোডাক্টের জন্য বিশ্বস্ত ঠিকানা। হাতে তৈরি, মানসম্মত এবং দীর্ঘস্থায়ী।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shop All
                </Link>
              </li>
              {(categories ?? []).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/shop?category=${cat.slug}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
  <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
  <ul className="space-y-3">
    <li className="flex items-center gap-2 text-primary-foreground/80">
      <Phone className="w-4 h-4 flex-shrink-0" />
      <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-primary-foreground transition-colors">
        {WHATSAPP_NUMBER}
      </a>
    </li>
    <li className="flex items-center gap-2 text-primary-foreground/80">
      <Mail className="w-4 h-4 flex-shrink-0" />
      <a href="mailto:muchibari01@gmail.com" className="hover:text-primary-foreground transition-colors">
        muchibari01@gmail.com
      </a>
    </li>
    <li className="flex items-start gap-2 text-primary-foreground/80">
      <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
      <a 
        href="https://maps.app.goo.gl/QqttAYo4ZUp91rMd9"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary-foreground transition-colors text-left"
      >
        <span>44/1 Sher-E-Bangla Road, Leather Market, Hazaribag Dhaka- 1209, Dhaka, Bangladesh</span>
      </a>
    </li>
  </ul>
</div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://www.facebook.com/people/Muchi-Bari/61577390296585/', Icon: Facebook, label: 'Facebook' },
                { href: 'https://www.instagram.com/muchi_bari/', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.youtube.com/@muchibari-q4s', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Muchi Bari. All rights reserved.</p>
          <p>Designed and developed by <a href="https://www.facebook.com/webinagency/" className="hover:text-primary-foreground transition-colors">WEBIN</a></p>
        </div>
      </div>
    </footer>
  )
}