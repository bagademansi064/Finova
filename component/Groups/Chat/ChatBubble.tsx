"use client";
import React, { useRef, useCallback } from "react";
import { Check } from "lucide-react";

export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
  isOwn: boolean;
  isRead?: boolean;
  avatarInitials?: string;
  avatarBg?: string;
  avatarTextColor?: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
  showSender: boolean;
  onLongPress: (messageId: string, position: { x: number; y: number }, text: string) => void;
}

export default function ChatBubble({
  message,
  showSender,
  onLongPress,
}: ChatBubbleProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      pressTimer.current = setTimeout(() => {
        // Compute position relative to viewport
        const rect = bubbleRef.current?.getBoundingClientRect();
        const x = rect
          ? message.isOwn
            ? rect.left - 60
            : rect.right + 8
          : touch.clientX;
        const y = rect ? rect.top + rect.height / 2 - 52 : touch.clientY;

        // Keep menu on screen
        const clampedX = Math.min(Math.max(x, 8), window.innerWidth - 60);
        const clampedY = Math.min(Math.max(y, 8), window.innerHeight - 120);

        onLongPress(message.id, { x: clampedX, y: clampedY }, message.text);
      }, 500);
    },
    [message, onLongPress]
  );

  const handleTouchEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  // Desktop right-click support
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = bubbleRef.current?.getBoundingClientRect();
      const x = rect
        ? message.isOwn
          ? rect.left - 60
          : rect.right + 8
        : e.clientX;
      const y = rect ? rect.top + rect.height / 2 - 52 : e.clientY;

      const clampedX = Math.min(Math.max(x, 8), window.innerWidth - 60);
      const clampedY = Math.min(Math.max(y, 8), window.innerHeight - 120);

      onLongPress(message.id, { x: clampedX, y: clampedY }, message.text);
    },
    [message, onLongPress]
  );

  return (
    <div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} px-4 mb-1 animate-fade-in-up`}
    >
      <div className={`flex flex-col max-w-[78%] ${message.isOwn ? "items-end" : "items-start"}`}>
        {/* Sender Name (for other people's messages in group) */}
        {!message.isOwn && showSender && (
          <span className="text-[12px] font-semibold text-[#6b7c75] mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          ref={bubbleRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchEnd}
          onContextMenu={handleContextMenu}
          className={`relative px-4 py-2.5 select-none transition-transform active:scale-[0.98] bg-[#f0f2f1] text-[#0E1B19] ${
            message.isOwn
              ? "rounded-t-2xl rounded-bl-2xl rounded-br-md"
              : "rounded-t-2xl rounded-br-2xl rounded-bl-md"
          }`}
          style={{ cursor: "pointer" }}
        >
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* Time + Read status */}
        <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? "mr-1" : "ml-1"}`}>
          <span className="text-[10px] text-[#8a9690]">{message.time}</span>
          {message.isOwn && (
            <div className="flex -space-x-1">
              <Check size={12} strokeWidth={2.5} className="text-[#8a9690]" />
              {message.isRead && (
                <Check size={12} strokeWidth={2.5} className="text-[#8a9690]" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
