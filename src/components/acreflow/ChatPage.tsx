'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Send,
  Search,
  Calculator,
  Headphones,
  PlusCircle,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const QUICK_REPLIES = [
  { label: 'Find Property', icon: Search },
  { label: 'EMI Calculator', icon: Calculator },
  { label: 'Contact Support', icon: Headphones },
  { label: 'Post Property', icon: PlusCircle },
];

export default function ChatPage() {
  const { goBack, chatMessages, addChatMessage, setView } = useAcreFlowStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

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
        setView('post-property');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0A192F]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-royal to-navy px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center gap-3 shadow-lg shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-white/20 transition"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
              AcreFlow Assistant
            </h1>
            <p className="text-xs sm:text-sm text-white/70">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto acreflow-scrollbar px-4 sm:px-6 py-4 space-y-3 sm:space-y-4 bg-cream dark:bg-[#0A192F]">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-royal text-white rounded-br-md'
                  : 'bg-white dark:bg-[#1D3461] text-navy dark:text-[#F1F5F9] rounded-bl-md border border-border dark:border-[#334155]'
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed">{msg.message}</p>
              <p
                className={`text-[10px] sm:text-xs mt-1 ${
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
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex gap-2 overflow-x-auto acreflow-scrollbar shrink-0 border-t border-border dark:border-[#1D3461] bg-white dark:bg-[#112240]">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply.label}
            onClick={() => handleQuickReply(reply.label)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] hover:bg-sky-deep dark:hover:bg-[#334155] transition-colors shrink-0 cursor-pointer min-h-[44px]"
          >
            <reply.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {reply.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shrink-0 border-t border-border dark:border-[#1D3461] bg-white dark:bg-[#112240]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-cream dark:bg-[#1D3461] rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-navy dark:text-[#F1F5F9] placeholder:text-slate-accent dark:placeholder:text-[#64748B] border-0 outline-none focus:ring-2 focus:ring-royal/30 dark:focus:ring-[#60A5FA]/30 min-h-[44px]"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-royal hover:bg-royal-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
