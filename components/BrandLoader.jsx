'use client';

import { BookOpen } from 'lucide-react';

export default function BrandLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-amber-600" />
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-800 animate-pulse">Pustaklinu</h2>
      <p className="text-gray-500 text-sm">Loading your experience...</p>
    </div>
  );
}
