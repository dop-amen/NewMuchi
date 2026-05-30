import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/data'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/images/logo.png" alt="MuchiBari" width={140} height={40}
              className="h-10 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              প্রিমিয়াম লেদার প্রোডাক্টের জন্য বিশ্বস্ত ঠিকানা। হাতে তৈরি, মানসম্মত এবং দীর্ঘস্থায়ী।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/shop?category=casual-shoes', label: 'Casual Shoes' },
                { href: '/shop?category=formal-shoes', label: 'Formal Shoes' },
                { href: '/about', label: 'About Us' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-primary-foreground transition-colors">{WHATSAPP_NUMBER}</a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@muchibari.com" className="hover:text-primary-foreground transition-colors">contact@muchibari.com</a>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://facebook.com/muchibari', Icon: Facebook, label: 'Facebook' },
                { href: 'https://instagram.com/muchibari', Icon: Instagram, label: 'Instagram' },
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
          <p>&copy; {new Date().getFullYear()} MuchiBari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}