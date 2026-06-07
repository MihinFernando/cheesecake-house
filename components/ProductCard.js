export default function ProductCard({ product }) {
  const WHATSAPP_NUMBER = '94771234567' // ← put your number here (no + or spaces)
  const message = `Hi! I'd like to order the ${product.name} cheesecake (Rs. ${product.price.toLocaleString()}). Is it available?`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {product.image_url && (
        <div className="relative">
          <img src={product.image_url} alt={product.name}
            className="w-full h-52 object-cover" />
          {product.label && (
            <span className="absolute top-3 left-3 bg-white text-[#6b5a2a] text-xs font-semibold px-3 py-1 rounded-full shadow">
              {product.label}
            </span>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-[#2a1f0e]">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex-1">{product.description}</p>
        <p className="text-[#6b5a2a] font-bold mt-3">Rs. {product.price.toLocaleString()}</p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-full text-center hover:bg-[#1db954] transition">
          Order via WhatsApp
        </a>
      </div>
    </div>
  )
}