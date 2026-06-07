import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Reviews from '@/components/Reviews'

export default async function Home() {
  // Fetch products from Supabase
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="bg-white/60 backdrop-blur-sm p-10 rounded-2xl max-w-2xl">
          <span className="text-xs tracking-widest uppercase text-[#6b5a2a] border border-[#6b5a2a] px-3 py-1 rounded-full">
            Artisanal Bakery
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#2a1f0e] leading-tight">
            Indulge in creamy, premium, handcrafted cheesecakes baked with love.
          </h1>
          <p className="mt-4 text-[#5a4a2a]">
            Welcome to The Cheesecake House. We bake fresh daily using only the
            finest ingredients. Available for local delivery and pickup.
          </p>
          <a href="#flavors"
            className="mt-6 inline-block bg-[#6b5a2a] text-white px-6 py-3 rounded-full hover:bg-[#4a3d1a] transition">
            Browse Our Flavors ↓
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="flavors" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2a1f0e]">Our Signature Selection</h2>
        <p className="text-center text-gray-500 mt-2 mb-12">
          Discover our handcrafted flavors, from classic New York style to decadent Lotus Biscoff.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <Reviews reviews={reviews} />
    </main>
  )
}