'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)

  const ADMIN_PASSWORD = 'cheesecake123' // ← CHANGE THIS

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setLoggedIn(true)
    else alert('Wrong password')
  }

  useEffect(() => {
    if (!loggedIn) return
    supabase.from('products').select('*').order('created_at')
      .then(({ data }) => setProducts(data || []))
  }, [loggedIn])

  const update = (id, field, value) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

  const save = async (product) => {
    setSaving(product.id)
    await supabase.from('products').update({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image_url: product.image_url,
      label: product.label,
      is_available: product.is_available,
    }).eq('id', product.id)
    setSaving(null)
    setSaved(product.id)
    setTimeout(() => setSaved(null), 2000)
  }

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3f2]">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#e5e2e1] w-full max-w-sm">
        <h1 className="font-serif text-3xl font-bold text-[#735c00] mb-2">Admin</h1>
        <p className="text-sm text-[#454742] mb-8">The Cheesecake House</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="password" placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#735c00] transition-colors" />
          <button type="submit" className="bg-[#735c00] text-white py-3 rounded-xl font-semibold hover:opacity-80 transition-opacity">
            Login
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f3f2]">
      <div className="bg-white border-b border-[#e5e2e1] px-6 md:px-16 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#735c00]">Manage Products</h1>
          <p className="text-sm text-[#454742]">Edit prices, labels, images and availability</p>
        </div>
        <a href="/" target="_blank" className="text-sm text-[#735c00] font-semibold hover:underline">View Website →</a>
      </div>
      <div className="max-w-4xl mx-auto py-10 px-6 md:px-0 space-y-6">
        {products.map(product => (
          <div key={product.id} className="bg-white border border-[#e5e2e1] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              {product.image_url
                ? <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                : <div className="w-16 h-16 rounded-xl bg-[#f1edec] flex items-center justify-center text-2xl">🍰</div>
              }
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1c1b1b]">{product.name}</h2>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {product.is_available ? 'Available' : 'Hidden'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">Product Name</label>
                <input value={product.name} onChange={e => update(product.id, 'name', e.target.value)}
                  className="w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">Price (Rs.)</label>
                <input type="number" value={product.price} onChange={e => update(product.id, 'price', e.target.value)}
                  className="w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">Label <span className="normal-case text-[#c6c7c0]">(e.g. Best Seller, 10% Off)</span></label>
                <input value={product.label || ''} onChange={e => update(product.id, 'label', e.target.value)}
                  placeholder="Leave empty for no label"
                  className="w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">Image URL</label>
                <input value={product.image_url || ''} onChange={e => update(product.id, 'image_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">Description</label>
                <textarea value={product.description || ''} rows={2} onChange={e => update(product.id, 'description', e.target.value)}
                  className="w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => update(product.id, 'is_available', !product.is_available)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.is_available ? 'bg-[#735c00]' : 'bg-[#e5e2e1]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <label className="text-sm text-[#454742]">Show on website</label>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={() => save(product)}
                className="bg-[#735c00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity">
                {saving === product.id ? 'Saving...' : 'Save Changes'}
              </button>
              {saved === product.id && <span className="text-sm text-green-600 font-semibold">✓ Saved!</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}