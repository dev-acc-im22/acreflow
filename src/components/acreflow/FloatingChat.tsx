'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Search, Calculator, Headphones, PlusCircle } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

const QUICK_REPLIES = [
  { label: 'Find Property', icon: Search },
  { label: 'EMI Calculator', icon: Calculator },
  { label: 'Contact Support', icon: Headphones },
  { label: 'Post Property', icon: PlusCircle },
];

export default function FloatingChat() {
  const {
    showChat,
    setShowChat,
    chatMessages,
    addChatMessage,
    setView,
  } = useAcreFlowStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasUnread = useMemo(() => {
    if (showChat || chatMessages.length <= 1) return false;
    const lastMsg = chatMessages[chatMessages.length - 1];
    return lastMsg.sender === 'bot' && lastMsg.id !== 'c1';
  }, [showChat, chatMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    if (showChat) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [showChat]);

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    addChatMessage(trimmed, 'user');
    setInputValue('');

    setTimeout(() => {
      addChatMessage(
        "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to explore our property listings.",
        'bot'
      );
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (label: string) => {
    switch (label) {
      case 'Find Property':
        addChatMessage(label, 'user');
        setTimeout(() => {
          addChatMessage(
            "I'll help you find a property! What city and budget are you looking at?",
            'bot'
          );
        }, 500);
        break;
      case 'EMI Calculator':
        setShowChat(false);
        setView('emi-calculator');
        break;
      case 'Contact Support':
        addChatMessage(label, 'user');
        setTimeout(() => {
          addChatMessage(
            "Our support team is available 24/7. Call us at +91 1800-123-4567 or email support@acreflow.com",
            'bot'
          );
        }, 500);
        break;
      case 'Post Property':
        setShowChat(false);
        setView('post-property');
        break;
    }
  };

  return (
    <>
      {/* FAB Button */}
      {!showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setShowChat(true)}
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
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] max-h-[80vh] bg-white dark:bg-[#112240] rounded-2xl shadow-2xl border border-border dark:border-[#1D3461] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-royal to-navy px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AcreFlow Assistant</h3>
                  <p className="text-white/70 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 transition flex items-center justify-center cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto acreflow-scrollbar p-4 space-y-3 bg-cream dark:bg-[#0A192F]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-royal text-white rounded-br-md'
                        : 'bg-white dark:bg-[#1D3461] text-navy dark:text-[#F1F5F9] rounded-bl-md border border-border dark:border-[#334155]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.sender === 'user'
                          ? 'text-white/60'
                          : 'text-slate-accent dark:text-[#64748B]'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto acreflow-scrollbar shrink-0 border-t border-border dark:border-[#1D3461] bg-white dark:bg-[#112240]">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.label}
                  onClick={() => handleQuickReply(reply.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] hover:bg-sky-deep dark:hover:bg-[#334155] transition-colors shrink-0 cursor-pointer"
                >
                  <reply.icon className="w-3 h-3" />
                  {reply.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-3 py-3 flex items-center gap-2 shrink-0 border-t border-border dark:border-[#1D3461] bg-white dark:bg-[#112240]">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-cream dark:bg-[#1D3461] rounded-full px-4 py-2 text-sm text-navy dark:text-[#F1F5F9] placeholder:text-slate-accent dark:placeholder:text-[#64748B] border-0 outline-none focus:ring-2 focus:ring-royal/30 dark:focus:ring-[#60A5FA]/30"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full bg-royal hover:bg-royal-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
