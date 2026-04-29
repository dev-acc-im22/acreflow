'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

export default function FloatingChat() {
  const { chatMessages, setView } = useAcreFlowStore();

  const hasUnread = useMemo(() => {
    if (chatMessages.length <= 1) return false;
    const lastMsg = chatMessages[chatMessages.length - 1];
    return lastMsg.sender === 'bot' && lastMsg.id !== 'c1';
  }, [chatMessages]);

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={() => setView('chat')}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-royal to-navy text-white shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center cursor-pointer"
      aria-label="Open chat assistant"
    >
      <MessageCircle className="w-6 h-6" />
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-royal to-navy animate-ping opacity-20" />
      {/* Unread dot */}
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#0A192F]" />
      )}
    </motion.button>
  );
}
