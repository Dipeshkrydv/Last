'use client';

import { Heart, Coffee } from 'lucide-react';

export default function DonationFooter({ role }) {
  return (
    <footer className="mt-12 p-8 bg-amber-50 rounded-2xl border border-amber-100 text-center">
      <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
        <Heart className="w-6 h-6 fill-current" />
        <h4 className="text-xl font-bold">Support Pustaklinu</h4>
      </div>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Help us keep this platform free for everyone to buy and sell books. Your support makes a difference!
      </p>
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition shadow-md hover:shadow-lg">
        <Coffee className="w-5 h-5" />
        Buy us a coffee
      </button>
      <p className="mt-4 text-xs text-gray-400">
        Role: {role || 'User'} | © 2026 Pustaklinu
      </p>
    </footer>
  );
}
