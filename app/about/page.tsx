import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, Award, Users, Heart, Truck, Headphones } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/data'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-primary-foreground">
            About Muchi Bari
          </h1>
          <p className="mt-4 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            আমাদের সম্পর্কে জানুন
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&h=800&fit=crop"
                alt="Leather craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-secondary font-semibold">Our Story</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
                Crafting Excellence Since Day One
              </h2>
              <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Muchi Bari, customer satisfaction is at the heart of everything we do. We believe that our greatest achievement is not just creating premium leather products, but earning the trust and happiness of every customer we serve.
                </p>
                <p>
                  Our vision is to deliver exceptional craftsmanship, uncompromising quality, and lasting comfort through every product we create. By combining authentic materials with skilled workmanship, we strive to build a brand that customers can rely on with confidence.
                </p>
                <p>
                  Each pair of sandals, each belt, each wallet that leaves our workshop carries with 
                  it hours of dedicated handwork, attention to detail, and a promise of quality that 
                  we stand behind.
                </p>
                <p>
                  At Muchi Bari, your satisfaction is our success, and your trust is our inspiration to keep improving every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Section */}

<section className="py-16 lg:py-24 bg-muted">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="order-2 lg:order-1">
        <span className="text-base text-secondary font-semibold">The Founder</span>
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
          Engr. Md. Shah Alam
        </h2>

        <div className="mt-4 space-y-1">
          <p className="text-lg font-semibold text-secondary">Founder & Managing Partner</p>
          <p className="text-base text-foreground/70">BSc in Leather Engineering, ILET, University of Dhaka</p>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <p className="text-base font-semibold text-foreground">Managing Partner</p>
            <p className="text-lg font-bold text-secondary">Glorious Trade International</p>
            <ul className="mt-1 space-y-0.5 text-base text-foreground/70 list-disc list-inside ml-1">
              <li>Sole Agent, Alcover, Spain</li>
              <li>All kinds of L/R Chemical Indentor & Importer</li>
            </ul>
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Proprietor</p>
            <p className="text-lg font-bold text-secondary">S. Alam Corporation</p>
            <ul className="mt-1 space-y-0.5 text-base text-foreground/70 list-disc list-inside ml-1">
              <li>Leather Buying, 1st Class Contractor, Supplier & Importer</li>
            </ul>
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Senior Joint Secretary</p>
            <p className="text-lg font-bold text-secondary ml-1">LEATHER ENGINEERS & TECHNOLOGISTS SOCIETY, Bangladesh</p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2 relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden">
        <img
          src="/founder.jpeg"
          alt="Engr. Md. Shah Alam"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  </div>

  <section className="py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="order-1 relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden">
        <img
          src="/ceo.jpg"
          alt="Md. Shakib Alam"
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="order-2">
        <span className="text-base text-secondary font-semibold">The Managing Director</span>
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
          Md. Shakib Alam
        </h2>

        <div className="mt-4 space-y-1">
          <p className="text-lg font-semibold text-secondary">Partner & Head of Sales and Marketing</p>
          <p className="text-base text-foreground/70">BSS in Economics, Dhaka College</p>
        </div>
      </div>
    </div>
  </div>
</section>
</section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold">Our Values</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mt-2">
              What We Stand For
            </h2>
            
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mt-4">Premium Quality</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Only the finest leather and materials make it into our products.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mt-4">Handcrafted with Love</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Every piece is made by skilled artisans with years of experience.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mt-4">100% Authentic</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                We guarantee genuine leather in every product we sell.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose Us?
            </h2>
            <p className="mt-2 text-muted-foreground">কেন আমাদের বেছে নেবেন?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <Truck className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold">সারাদেশে ডেলিভারি</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nationwide delivery within 3-5 business days.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold">মানের নিশ্চয়তা</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quality guaranteed or your money back.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <Award className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold">১০০% আসল লেদার</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Only genuine leather in all our products.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <Headphones className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold">২৪/৭ সাপোর্ট</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Always here to help via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground">
            Ready to Experience Quality?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Browse our collection and find your perfect leather companion. 
            Order easily via WhatsApp!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={getWhatsAppLink('Hi, I want to place an order')} target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
