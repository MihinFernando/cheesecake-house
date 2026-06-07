export default function Reviews({ reviews }) {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2a1f0e] mb-2">What Our Cake Lovers Say</h2>
        <div className="flex justify-center gap-1 mb-12 text-yellow-400">★★★★★</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews?.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100">
              <span className="text-4xl text-gray-200 font-serif leading-none">"</span>
              <p className="text-sm text-gray-600 mt-2 italic">{review.review_text}</p>
              <p className="mt-4 text-sm font-semibold text-[#6b5a2a]">— {review.reviewer_name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}