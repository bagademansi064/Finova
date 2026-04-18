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
  messageType?: string;
  stockSymbol?: string;
  cardAction?: "discuss" | "poll" | null;
  pollDirection?: "buy" | "sell" | null;
  discussionId?: string;
  pollId?: string;
  createdAt?: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
  showSender: boolean;
  onLongPress: (messageId: string, position: { x: number; y: number }, text: string) => void;
  groupFinovaId?: string;
  myFinovaId?: string;
  onDiscussClick?: (symbol: string, discussionId?: string) => void;
  onVoteSubmit?: (pollId: string, choice: string) => void;
}

export default function ChatBubble({
  message,
  showSender,
  onLongPress,
  groupFinovaId,
  myFinovaId,
  onDiscussClick,
  onVoteSubmit,
}: ChatBubbleProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      pressTimer.current = setTimeout(() => {
        const rect = bubbleRef.current?.getBoundingClientRect();
        const x = rect
          ? message.isOwn
            ? rect.left - 60
            : rect.right + 8
          : touch.clientX;
        const y = rect ? rect.top + rect.height / 2 - 52 : touch.clientY;
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

  // Match both frontend-sent "stock" and backend-stored "stock_card"
  const isStockCard = message.messageType === "stock" || message.messageType === "stock_card";

  // Stock cards get the rich StockCardBubble treatment
  if (isStockCard && message.stockSymbol && message.stockSymbol !== "UNKNOWN") {
    const StockCardBubble = require("./StockCardBubble").default;
    return (
      <div className="animate-fade-in-up">
        {!message.isOwn && showSender && (
          <span className="text-[12px] font-semibold text-[#6b7c75] mb-1 ml-5 block">
            {message.senderName}
          </span>
        )}
        <StockCardBubble
          symbol={message.stockSymbol}
          cardAction={message.cardAction || null}
          pollDirection={message.pollDirection || null}
          messageText={message.text}
          isOwn={message.isOwn}
          time={message.time}
          groupFinovaId={groupFinovaId || ""}
          discussionId={message.discussionId}
          pollId={message.pollId}
          createdAt={message.createdAt}
          myFinovaId={myFinovaId}
          onDiscussClick={onDiscussClick}
          onVoteSubmit={onVoteSubmit}
        />
      </div>
    );
  }

  // Regular text bubbles
  return (
    <div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} px-4 mb-1 animate-fade-in-up`}
    >
      <div className={`flex flex-col max-w-[78%] ${message.isOwn ? "items-end" : "items-start"}`}>
        {!message.isOwn && showSender && (
          <span className="text-[12px] font-semibold text-[#6b7c75] mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        <div
          ref={bubbleRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchEnd}
          onContextMenu={handleContextMenu}
          className={`relative px-4 py-2.5 select-none transition-transform active:scale-[0.98] ${
            message.isOwn
              ? "bg-[#0E1B19] text-white rounded-t-2xl rounded-bl-2xl rounded-br-md"
              : "bg-white border border-[#e5e8e6] text-[#0E1B19] rounded-t-2xl rounded-br-2xl rounded-bl-md"
          }`}
          style={{ cursor: "pointer" }}
        >
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

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
