'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'charith123'

// ── small reusable input components ──────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-xs text-[#767872] uppercase tracking-wider font-semibold block mb-1">
        {label} {hint && <span className="normal-case text-[#c6c7c0] font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
const inp = "w-full border border-[#e5e2e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#735c00] transition-colors"

// ── Tab button ────────────────────────────────────────────────────
function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active ? 'bg-[#735c00] text-white shadow-sm' : 'text-[#454742] hover:bg-[#f1edec]'
      }`}>
      {children}
    </button>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#735c00]' : 'bg-[#e5e2e1]'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      <span className="text-sm text-[#454742]">{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword]   = useState('')
  const [loggedIn, setLoggedIn]   = useState(false)
  const [tab, setTab]             = useState('products') // 'products' | 'reviews'

  // products state
  const [products, setProducts]   = useState([])
  const [saving, setSaving]       = useState(null)
  const [saved, setSaved]         = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', image_url: '', label: '', is_available: true
  })
  const [addingProduct, setAddingProduct] = useState(false)

  // reviews state
  const [reviews, setReviews]     = useState([])
  const [savingReview, setSavingReview]   = useState(null)
  const [savedReview, setSavedReview]     = useState(null)
  const [deletingReview, setDeletingReview] = useState(null)
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({ reviewer_name: '', review_text: '' })
  const [addingReview, setAddingReview]   = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setLoggedIn(true)
    else alert('Wrong password')
  }

  useEffect(() => {
    if (!loggedIn) return
    fetchProducts()
    fetchReviews()
  }, [loggedIn])

  const fetchProducts = () =>
    supabase.from('products').select('*').order('created_at')
      .then(({ data }) => setProducts(data || []))

  const fetchReviews = () =>
    supabase.from('reviews').select('*').order('created_at')
      .then(({ data }) => setReviews(data || []))

  // ── PRODUCT actions ────────────────────────────────────────────
  const updateProduct = (id, field, value) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

  const saveProduct = async (product) => {
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

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Name and price are required.')
    setAddingProduct(true)
    const { data } = await supabase.from('products').insert({
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      image_url: newProduct.image_url || null,
      label: newProduct.label || null,
      is_available: newProduct.is_available,
    }).select()
    if (data) setProducts(prev => [...prev, ...data])
    setNewProduct({ name: '', description: '', price: '', image_url: '', label: '', is_available: true })
    setShowAddProduct(false)
    setAddingProduct(false)
  }

  // ── REVIEW actions ─────────────────────────────────────────────
  const updateReview = (id, field, value) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))

  const saveReview = async (review) => {
    setSavingReview(review.id)
    await supabase.from('reviews').update({
      reviewer_name: review.reviewer_name,
      review_text: review.review_text,
    }).eq('id', review.id)
    setSavingReview(null)
    setSavedReview(review.id)
    setTimeout(() => setSavedReview(null), 2000)
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    setDeletingReview(id)
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeletingReview(null)
  }

  const addReview = async () => {
    if (!newReview.reviewer_name || !newReview.review_text) return alert('Name and review text are required.')
    setAddingReview(true)
    const { data } = await supabase.from('reviews').insert({
      reviewer_name: newReview.reviewer_name,
      review_text: newReview.review_text,
    }).select()
    if (data) setReviews(prev => [...prev, ...data])
    setNewReview({ reviewer_name: '', review_text: '' })
    setShowAddReview(false)
    setAddingReview(false)
  }

  // ── LOGIN SCREEN ───────────────────────────────────────────────
  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3f2]">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#e5e2e1] w-full max-w-sm">
        <p className="font-serif text-3xl font-bold text-[#735c00] mb-1">Admin</p>
        <p className="text-sm text-[#454742] mb-8">The Cheesecake House</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="password" placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)}
            className={inp} />
          <button type="submit"
            className="bg-[#735c00] text-white py-3 rounded-xl font-semibold hover:opacity-80 transition-opacity">
            Login
          </button>
        </form>
      </div>
    </div>
  )

  // ── MAIN ADMIN ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f3f2]">

      {/* Header */}
      <div className="bg-white border-b border-[#e5e2e1] px-6 md:px-16 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="font-serif text-xl font-bold text-[#735c00]">The Cheesecake House</p>
          <p className="text-xs text-[#767872]">Admin Dashboard</p>
        </div>
        <a href="/" target="_blank"
          className="text-sm text-[#735c00] font-semibold hover:underline">
          View Website →
        </a>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-6 md:px-0">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-[#e5e2e1] w-fit">
          <Tab active={tab === 'products'} onClick={() => setTab('products')}>
            🍰 Products ({products.length})
          </Tab>
          <Tab active={tab === 'reviews'} onClick={() => setTab('reviews')}>
            ⭐ Reviews ({reviews.length})
          </Tab>
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div className="space-y-6">

            {/* Add Product Button */}
            {!showAddProduct && (
              <button onClick={() => setShowAddProduct(true)}
                className="w-full border-2 border-dashed border-[#735c00]/30 rounded-2xl py-5 text-[#735c00] font-semibold text-sm hover:border-[#735c00]/60 hover:bg-[#735c00]/5 transition-all duration-200 flex items-center justify-center gap-2">
                <span className="text-xl">+</span> Add New Product
              </button>
            )}

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-white border-2 border-[#735c00]/30 rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#735c00] mb-5">New Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Product Name *">
                    <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="e.g. Strawberry Dream" className={inp} />
                  </Field>
                  <Field label="Price (Rs.) *">
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="e.g. 2500" className={inp} />
                  </Field>
                  <Field label="Label" hint="(e.g. New, Best Seller, 10% Off)">
                    <input value={newProduct.label} onChange={e => setNewProduct({...newProduct, label: e.target.value})}
                      placeholder="Leave empty for no label" className={inp} />
                  </Field>
                  <Field label="Image URL">
                    <input value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                      placeholder="https://..." className={inp} />
                  </Field>
                  <Field label="Description" >
                    <textarea value={newProduct.description} rows={2}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Short description of the cheesecake..."
                      className={`${inp} resize-none md:col-span-2`} />
                  </Field>
                  <div className="md:col-span-2">
                    <Toggle value={newProduct.is_available}
                      onChange={v => setNewProduct({...newProduct, is_available: v})}
                      label="Show on website immediately" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={addProduct} disabled={addingProduct}
                    className="bg-[#735c00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
                    {addingProduct ? 'Adding...' : 'Add Product'}
                  </button>
                  <button onClick={() => { setShowAddProduct(false); setNewProduct({ name:'', description:'', price:'', image_url:'', label:'', is_available:true }) }}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#454742] hover:bg-[#f1edec] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Products */}
            {products.map(product => (
              <div key={product.id} className="bg-white border border-[#e5e2e1] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                      : <div className="w-14 h-14 rounded-xl bg-[#f1edec] flex items-center justify-center text-2xl">🍰</div>
                    }
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#1c1b1b]">{product.name}</h2>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {product.is_available ? '● Visible' : '● Hidden'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(product.id)} disabled={deleting === product.id}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all text-xs font-semibold">
                    {deleting === product.id ? '...' : '🗑 Delete'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Product Name">
                    <input value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} className={inp} />
                  </Field>
                  <Field label="Price (Rs.)">
                    <input type="number" value={product.price} onChange={e => updateProduct(product.id, 'price', e.target.value)} className={inp} />
                  </Field>
                  <Field label="Label" hint="(e.g. Best Seller, 10% Off)">
                    <input value={product.label || ''} onChange={e => updateProduct(product.id, 'label', e.target.value)}
                      placeholder="Leave empty for no label" className={inp} />
                  </Field>
                  <Field label="Image URL">
                    <input value={product.image_url || ''} onChange={e => updateProduct(product.id, 'image_url', e.target.value)}
                      placeholder="https://..." className={inp} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea value={product.description || ''} rows={2}
                        onChange={e => updateProduct(product.id, 'description', e.target.value)}
                        className={`${inp} resize-none`} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Toggle value={product.is_available}
                      onChange={v => updateProduct(product.id, 'is_available', v)}
                      label="Show on website" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-5">
                  <button onClick={() => saveProduct(product)} disabled={saving === product.id}
                    className="bg-[#735c00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
                    {saving === product.id ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saved === product.id && <span className="text-sm text-green-600 font-semibold">✓ Saved!</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className="space-y-6">

            {/* Add Review Button */}
            {!showAddReview && (
              <button onClick={() => setShowAddReview(true)}
                className="w-full border-2 border-dashed border-[#735c00]/30 rounded-2xl py-5 text-[#735c00] font-semibold text-sm hover:border-[#735c00]/60 hover:bg-[#735c00]/5 transition-all duration-200 flex items-center justify-center gap-2">
                <span className="text-xl">+</span> Add New Review
              </button>
            )}

            {/* Add Review Form */}
            {showAddReview && (
              <div className="bg-white border-2 border-[#735c00]/30 rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#735c00] mb-5">New Review</h2>
                <div className="flex flex-col gap-4">
                  <Field label="Customer Name *">
                    <input value={newReview.reviewer_name} onChange={e => setNewReview({...newReview, reviewer_name: e.target.value})}
                      placeholder="e.g. Sarah L." className={inp} />
                  </Field>
                  <Field label="Review Text *">
                    <textarea value={newReview.review_text} rows={3}
                      onChange={e => setNewReview({...newReview, review_text: e.target.value})}
                      placeholder="What did they say about the cheesecake?"
                      className={`${inp} resize-none`} />
                  </Field>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={addReview} disabled={addingReview}
                    className="bg-[#735c00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
                    {addingReview ? 'Adding...' : 'Add Review'}
                  </button>
                  <button onClick={() => { setShowAddReview(false); setNewReview({ reviewer_name:'', review_text:'' }) }}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#454742] hover:bg-[#f1edec] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Reviews */}
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-[#e5e2e1] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-serif font-bold text-[#1c1b1b]">{review.reviewer_name}</p>
                  <button onClick={() => deleteReview(review.id)} disabled={deletingReview === review.id}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all text-xs font-semibold">
                    {deletingReview === review.id ? '...' : '🗑 Delete'}
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <Field label="Customer Name">
                    <input value={review.reviewer_name} onChange={e => updateReview(review.id, 'reviewer_name', e.target.value)} className={inp} />
                  </Field>
                  <Field label="Review Text">
                    <textarea value={review.review_text} rows={3}
                      onChange={e => updateReview(review.id, 'review_text', e.target.value)}
                      className={`${inp} resize-none`} />
                  </Field>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => saveReview(review)} disabled={savingReview === review.id}
                    className="bg-[#735c00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
                    {savingReview === review.id ? 'Saving...' : 'Save Changes'}
                  </button>
                  {savedReview === review.id && <span className="text-sm text-green-600 font-semibold">✓ Saved!</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}