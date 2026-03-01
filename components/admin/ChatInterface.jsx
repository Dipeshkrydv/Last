
'use client';

import { useState } from 'react';
import { Send, User, Search } from 'lucide-react';

export default function ChatInterface() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-[600px] bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer border-b transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">User {i}</p>
                  <p className="text-xs text-gray-500 truncate">Last message preview...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <User className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-gray-900">Select a conversation</h4>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <p>Start a conversation with users</p>
        </div>

        <div className="p-4 border-t">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
