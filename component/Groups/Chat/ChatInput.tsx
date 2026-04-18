"use client";
import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, Smile, Send, TrendingUp, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const [text, setText] = useState("");
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const typingTimer = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prefetch market cache eagerly
  useEffect(() => {
    async function fetchMarketCache() {
      try {
        const response = await apiFetch('/market/live/');
        if (response.ok) {
          const data = await response.json();
          // Extract the stock symbols from the returned dictionary
          setAvailableStocks(Object.keys(data));
        }
      } catch (e) {
        console.error("Failed to fetch market cache", e);
      }
    }
    fetchMarketCache();
  }, []);

  const handleTextChange = (val: string) => {
    setText(val);
    
    // Only show autocomplete while user is still typing the stock symbol part
    // Pattern: /stock <partial_symbol> — no quotes closed, no action word yet
    if (val.startsWith("/stock ")) {
      const afterCommand = val.slice(7); // everything after "/stock "
      
      // If user already selected a stock (has quotes or typed an action word), hide suggestions
      const hasClosingQuote = afterCommand.includes('"') && afterCommand.indexOf('"') < afterCommand.lastIndexOf('"');
      const hasAction = /\s+(discuss|poll)\b/i.test(afterCommand);
      
      if (hasClosingQuote || hasAction) {
        setShowSuggestions(false);
        return;
      }
      
      // Extract the symbol being typed (strip leading quote if present)
      const matchTerm = afterCommand.replace(/^["']/, '').trim().toUpperCase();
      
      if (matchTerm.length === 0) {
        // Just typed "/stock " — show top 5 stocks
        setSuggestions(availableStocks.slice(0, 5));
      } else {
        const matched = availableStocks.filter(s => s.startsWith(matchTerm)).slice(0, 5);
        if (matched.length === 0) {
          setSuggestions([matchTerm, `${matchTerm}.NS`, `${matchTerm}.BO`]);
        } else {
          setSuggestions(matched);
        }
      }
      setShowSuggestions(true);
      setActiveIndex(0);
    } else {
      setShowSuggestions(false);
    }

    // Typing Indicator Logic
    onTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const selectSuggestion = (symbol: string) => {
    // After selecting, set text without closing quotes so user can type discuss/poll
    setText(`/stock ${symbol} `);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative sticky bottom-0 z-40 bg-white">
      {/* Suggestions Overlay Popover */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 rounded-2xl bg-[#0E1B19] shadow-2xl overflow-hidden border border-gray-800 animate-slide-up-bottom">
          <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Search size={14} className="text-[#a7f3d0]" />
            Matching Market Assets
          </div>
          <ul className="py-1">
            {suggestions.map((symbol, idx) => (
              <li
                key={symbol}
                onClick={() => selectSuggestion(symbol)}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  idx === activeIndex ? "bg-[#1A3A34] text-white" : "text-gray-300 hover:bg-[#132c27]"
                }`}
              >
                <div className="flex h-7 w-7 rounded-md items-center justify-center bg-[#0d2a23] text-[#a7f3d0]">
                  <TrendingUp size={16} />
                </div>
                <div className="flex-1">
                  <span className="font-bold tracking-wide">{symbol}</span>
                </div>
                {idx === activeIndex && (
                  <span className="text-[10px] uppercase font-bold text-[#a7f3d0] opacity-80 border border-[#a7f3d0]/30 px-1.5 py-0.5 rounded">Enter ↵</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-[#e5e8e6]">
        {/* Attachment */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-[#f0f2f1] tap-highlight flex-shrink-0"
          aria-label="Attach file"
        >
          <PlusCircle size={24} strokeWidth={1.6} className="text-[#6b7c75]" />
        </button>

        {/* Input Field */}
        <div className="flex-1 flex items-center gap-2 bg-[#f0f2f1] rounded-full px-4 py-2.5 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message or /stock"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[14px] text-[#0E1B19] placeholder-[#8a9690] outline-none"
          />
          <button className="flex-shrink-0 tap-highlight" aria-label="Emoji">
            <Smile size={22} strokeWidth={1.6} className="text-[#8a9690]" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 tap-highlight flex-shrink-0 ${
            text.trim() ? "bg-[#0D624B] text-white shadow-md" : "bg-gray-300 text-gray-500"
          }`}
          aria-label="Send message"
        >
          <Send size={18} strokeWidth={2} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
