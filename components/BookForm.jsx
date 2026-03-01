'use client';

import { useState } from 'react';
import { Book, Plus, Loader2 } from 'lucide-react';

export default function BookForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
          <Book className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">List a New Book</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Book Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Enter book title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Enter author name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="Tell buyers about the book's condition..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price (Rs.)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
            <option>Fiction</option>
            <option>Non-Fiction</option>
            <option>Academic</option>
            <option>Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Condition</label>
          <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none">
            <option>New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5" /> List Book for Sale
          </>
        )}
      </button>
    </form>
  );
}
