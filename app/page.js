'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Hook to detect when element enters viewport
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, inView] = useInView()
  const directions = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
    none: '',
  }
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directions[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  const WHATSAPP = '+94713722344'

  useEffect(() => {
    // Hero entrance animation
    setTimeout(() => setHeroVisible(true), 100)

    // Navbar scroll effect
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_available', true).order('created_at')
      .then(({ data }) => setProducts(data || []))
    supabase.from('reviews').select('*')
      .then(({ data }) => setReviews(data || []))
  }, [])

  const waLink = (name, price) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I'd love to order the ${name} cheesecake (Rs. ${price?.toLocaleString()}). Is it available?`)}`

  return (
    <div className="bg-[#fcf8f7] text-[#1c1b1b] antialiased scroll-smooth">

      {/* NAV — shrinks and gets shadow on scroll */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'py-4 bg-gradient-to-b from-black/60 via-black/30 to-transparent'
      }`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16">
          
          {/* UPDATED LOGO: Much stronger dark drop-shadow */}
          <a href="#" className="flex items-center transition-all duration-500">
            <img 
              src="/logo.png" 
              alt="The Cheesecake House" 
              className={`w-auto object-contain transition-all duration-500 ${
                scrolled 
                  ? 'h-10 md:h-12 drop-shadow-none' 
                  : 'h-16 md:h-24 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]'
              }`}
            />
          </a>

          <div className="hidden md:flex gap-8 items-center">
            {[['#menu','Menu'],['#reviews','Reviews'],['#contact','Contact']].map(([href,label]) => (
              <a key={href} href={href}
                className={`text-sm font-semibold tracking-wide transition-colors relative group ${
                  scrolled 
                    ? 'text-[#454742] hover:text-[#735c00]' 
                    : 'text-white hover:text-[#f7f3f2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                }`}>
                {label}
                <span className={`absolute -bottom-0.5 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-[#735c00]' : 'bg-white'}`} />
              </a>
            ))}
            <a href="#menu"
              className="bg-[#735c00] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[#5a4700] hover:scale-105 hover:shadow-lg active:scale-95 shadow-md">
              Order Now
            </a>
          </div>
          <button className={`md:hidden transition-transform duration-200 active:scale-90 ${scrolled ? 'text-[#454742]' : 'text-white drop-shadow-md'}`}
            onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white px-6 pb-4 flex flex-col gap-4 border-t border-[#e5e2e1]">
            {[['#menu','Menu'],['#reviews','Reviews'],['#contact','Contact']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#454742] hover:text-[#735c00] transition-colors pt-4">{label}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO — fades in on load */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://ptojaktjqhxmlbryefzc.supabase.co/storage/v1/object/public/images/hero%20image.png"
            alt="Cheesecake"
            className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${heroVisible ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcf8f7] via-[#fcf8f7]/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
          <div className={`transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block mb-4 px-4 py-1 border border-[#735c00] rounded-full text-xs font-bold tracking-widest uppercase text-[#735c00]">
              Baked Fresh Daily
            </span>
          </div>
          <div className={`transition-all duration-1000 ease-out delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#1c1b1b] mb-6 leading-tight">
              Handcrafted cheesecakes, baked with love.
            </h1>
          </div>
          <div className={`transition-all duration-1000 ease-out delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg text-[#454742] mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              We bake our melt-in-your-mouth cheesecakes fresh every day using only the best ingredients. Grab a slice (or a whole cake) for pickup or local delivery.
            </p>
          </div>
          <div className={`transition-all duration-1000 ease-out delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="#menu"
              className="inline-flex items-center gap-2 bg-[#735c00] text-white px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#5a4700] hover:scale-105 hover:shadow-xl hover:shadow-[#735c00]/30 active:scale-95 group">
              See Our Flavors
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-6 h-10 border-2 border-[#735c00]/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#735c00]/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="menu" className="py-24 bg-[#f7f3f2]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <FadeIn className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b1b] mb-4">Our Signature Flavors</h2>
            <p className="text-[#454742] max-w-xl mx-auto">From classic New York to sweet Lotus Biscoff, find your new favorite slice.</p>
            <div className="w-16 h-1 bg-[#735c00] rounded-full mx-auto mt-6" />
          </FadeIn>

          {products.length === 0 ? (
            <div className="text-center text-[#454742] py-20">
              <div className="text-5xl mb-4 animate-pulse">🍰</div>
              <p className="text-lg font-semibold">Whipping up the menu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <FadeIn key={p.id} delay={i * 100} direction="up">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group cursor-pointer hover:-translate-y-2">
                    <div className="aspect-square overflow-hidden relative">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        : <div className="w-full h-full bg-[#f1edec] flex items-center justify-center text-6xl
                            group-hover:scale-110 transition-transform duration-500">🍰</div>
                      }
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                      {p.label && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#735c00] text-xs font-bold px-3 py-1 rounded-full border border-[#735c00]/20 shadow-sm">
                          {p.label}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1 items-center text-center">
                      <h3 className="font-serif text-xl font-bold text-[#1c1b1b] mb-2 group-hover:text-[#735c00] transition-colors duration-300">{p.name}</h3>
                      <p className="text-sm text-[#454742] mb-5 flex-1 leading-relaxed">{p.description}</p>
                      <p className="text-[#735c00] font-bold text-base mb-4">Rs. {p.price?.toLocaleString()}</p>
                      <a href={waLink(p.name, p.price)} target="_blank" rel="noopener noreferrer"
                        className="w-full bg-[#25D366] text-white px-4 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#1da851] hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-95 flex items-center justify-center gap-2 group/btn">
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Order via WhatsApp
                      </a>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <FadeIn className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b1b] mb-3">What People Are Saying</h2>
            <div className="flex justify-center gap-1 text-[#735c00] text-2xl mt-2">★★★★★</div>
            <div className="w-16 h-1 bg-[#735c00] rounded-full mx-auto mt-6" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <FadeIn key={r.id} delay={i * 150} direction="up">
                <div className="bg-[#fcf8f7] p-8 rounded-2xl border border-[#e5e2e1] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="text-5xl text-[#735c00] opacity-20 font-serif leading-none block mb-2">"</span>
                  <p className="text-[#1c1b1b] italic leading-relaxed mb-6">"{r.review_text}"</p>
                  <p className="text-sm font-bold text-[#735c00]">— {r.reviewer_name}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#f7f3f2] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FadeIn direction="right">
            {/* UPDATED LOGO: Sizing for landscape and subtle drop shadow */}
            <img 
              src="/logo.png" 
              alt="The Cheesecake House" 
              className="w-auto h-16 md:h-20 object-contain mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
            />
            <p className="text-sm text-[#454742]">Handcrafted with love. Baked fresh every day.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#1c1b1b] mb-4">Links</h4>
            <div className="flex flex-col gap-2">
              {[['#menu','Menu'],['#reviews','Reviews'],['#contact','Contact']].map(([href,label]) => (
                <a key={href} href={href}
                  className="text-sm text-[#454742] hover:text-[#735c00] hover:translate-x-1 transition-all duration-200 inline-block">{label}</a>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200} direction="left">
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#1c1b1b] mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-2 text-sm text-[#454742] mb-4">
              <p className="hover:text-[#735c00] transition-colors">🕐 Open Daily: 7am-8pm</p>
            </div>
            <div className="flex gap-4">
              {[
                { href: 'https://www.facebook.com/profile.php?id=61554919787148&mibextid=wwXIfr&mibextid=wwXIfr', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { href: 'https://www.instagram.com/the_cheesecake_house_sl?igsh=MTl0NmljanJ0MmE4MQ%3D%3D&utm_source=qr', path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' }
              ].map(({ href, path }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-[#454742] hover:text-[#735c00] hover:scale-125 transition-all duration-300 inline-block">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d={path} clipRule="evenodd"/>
                  </svg>
                </a>
              ))}
            </div>
          </FadeIn>
          <div className="md:col-span-3 border-t border-[#e5e2e1] pt-8 text-center text-sm text-[#454742]">
            © 2026 The Cheesecake House. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hey! I\'d love to order a cheesecake.')}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-110 hover:bg-[#1da851] active:scale-95 transition-all duration-300 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-white text-[#1c1b1b] px-4 py-2 rounded-lg shadow-md text-sm font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300">
          Chat to Order!
        </span>
      </a>
    </div>
  )
}