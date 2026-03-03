// patient-portal/src/components/chat/FloatingChatButton.tsx
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatBot } from './ChatBot';

export const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] z-[60] shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-[70] p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <ChatBot />
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask about your scans
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </button>
      )}
    </>
  );
};
