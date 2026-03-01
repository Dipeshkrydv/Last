'use client';

import { Star, User } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    { id: 1, name: 'Alice', text: 'Great platform for finding rare books!', rating: 5 },
    { id: 2, name: 'Bob', text: 'Easy to sell my old textbooks.', rating: 4 },
  ];

  return (
    <section className="py-12">
      <h3 className="text-2xl font-bold text-center mb-8">What our users say</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{review.name}</p>
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
