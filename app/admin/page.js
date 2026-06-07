'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(null)

  // Simple password protection (good enough for a small business)
  const ADMIN_PASSWORD = 'cheesecake123' // ← change this to something only you know

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setLoggedIn(true)
    else alert('Wrong password')
  }

  useEffect(() => {
    if (!loggedIn) return
    supabase.from('products').select('*').order('created_at').then(({ data }) => setProducts(data))
  }, [loggedIn])

  const updateProduct = async (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const saveProduct = async (product) => {
    setSaving(product.id)
    await supabase.from('products').update({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      label: product.label,
      is_available: product.is_available
    }).eq('id', product.id)
    setSaving(null)
    alert('Saved!')
  }

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#2a1f0e] mb-6">Admin Login</h1>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm" />
        <button onClick={handleLogin}
          className="w-full bg-[#6b5a2a] text-white py-3 rounded-lg font-semibold hover:bg-[#4a3d1a] transition">
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-[#2a1f0e] mb-8">Manage Products</h1>
      <div className="space-y-6">
        {products.map(product => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Name</label>
                <input value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#6b5a2a]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Price (Rs.)</label>
                <input type="number" value={product.price}
                  onChange={e => updateProduct(product.id, 'price', parseInt(e.target.value))}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#6b5a2a]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Label (e.g. "Best Seller")</label>
                <input value={product.label || ''} onChange={e => updateProduct(product.id, 'label', e.target.value)}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#6b5a2a]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Image URL</label>
                <input value={product.image_url || ''} onChange={e => updateProduct(product.id, 'image_url', e.target.value)}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#6b5a2a]" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
                <textarea value={product.description || ''} rows={2}
                  onChange={e => updateProduct(product.id, 'description', e.target.value)}
                  className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#6b5a2a]" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={product.is_available}
                  onChange={e => updateProduct(product.id, 'is_available', e.target.checked)}
                  className="w-4 h-4 accent-[#6b5a2a]" />
                <label className="text-sm text-gray-600">Available for order</label>
              </div>
            </div>
            <button onClick={() => saveProduct(product)}
              className="mt-4 bg-[#6b5a2a] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#4a3d1a] transition">
              {saving === product.id ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}