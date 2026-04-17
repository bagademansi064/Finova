"use client";
import React, { useState, useRef } from "react";
import { PlusCircle, Smile, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 z-40 flex items-center gap-2 bg-white px-3 py-3 border-t border-[#e5e8e6]">
      {/* Attachment */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-[#f0f2f1] tap-highlight flex-shrink-0"
        aria-label="Attach file"
      >
        <PlusCircle size={24} strokeWidth={1.6} className="text-[#6b7c75]" />
      </button>

      {/* Input Field */}
      <div className="flex-1 flex items-center gap-2 bg-[#f0f2f1] rounded-full px-4 py-2.5">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[14px] text-[#0E1B19] placeholder-[#8a9690] outline-none"
        />
        <button
          className="flex-shrink-0 tap-highlight"
          aria-label="Emoji"
        >
          <Smile size={22} strokeWidth={1.6} className="text-[#8a9690]" />
        </button>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 tap-highlight flex-shrink-0 ${
          text.trim()
            ? "bg-[#0D624B] text-white shadow-md"
            : "bg-[#0D624B] text-white shadow-md"
        }`}
        aria-label="Send message"
      >
        <Send size={18} strokeWidth={2} className="ml-0.5" />
      </button>
    </div>
  );
}
