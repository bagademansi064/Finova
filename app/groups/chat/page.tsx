"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "@/component/Groups/Chat/ChatHeader";
import ChatBubble, { ChatMessage } from "@/component/Groups/Chat/ChatBubble";
import ChatInput from "@/component/Groups/Chat/ChatInput";
import MessageContextMenu from "@/component/Groups/Chat/MessageContextMenu";

/* ── Mock Data ──────────────────────────────────────────────── */

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    senderName: "Marcus Lee",
    text: "The solar farm project in Nevada just hit its first milestone. We're looking at a 12% yield forecast increase.",
    time: "10:24 AM",
    isOwn: false,
    avatarInitials: "ML",
    avatarBg: "#e0f2f1",
    avatarTextColor: "#00695C",
  },
  {
    id: "2",
    senderName: "You",
    text: "That's huge news! Should we re-allocate some of the liquid capital from the wind fund to double down?",
    time: "10:25 AM",
    isOwn: true,
    isRead: true,
  },
  {
    id: "3",
    senderName: "Sarah Chen",
    text: "To kick anybody out we vote",
    time: "10:27 AM",
    isOwn: false,
    avatarInitials: "SC",
    avatarBg: "#fff3e0",
    avatarTextColor: "#e65100",
  },
  {
    id: "4",
    senderName: "Jordan Smith",
    text: "Agreed, decentralized governance is key for the Eco Alpha model. Let's keep the proposal transparent.",
    time: "10:30 AM",
    isOwn: false,
    avatarInitials: "JS",
    avatarBg: "#e8f5e9",
    avatarTextColor: "#2e7d32",
  },
];

/* ── Page ────────────────────────────────────────────────────── */

export default function GroupChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    position: { x: number; y: number };
    messageId: string;
    messageText: string;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
    messageId: "",
    messageText: "",
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback((text: string) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderName: "You",
      text,
      time: `${h12}:${minutes} ${ampm}`,
      isOwn: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);
  }, []);

  const handleLongPress = useCallback(
    (messageId: string, position: { x: number; y: number }, text: string) => {
      setContextMenu({
        visible: true,
        position,
        messageId,
        messageText: text,
      });
    },
    []
  );

  const handleDelete = useCallback(() => {
    setMessages((prev) =>
      prev.filter((m) => m.id !== contextMenu.messageId)
    );
  }, [contextMenu.messageId]);

  const handleCopy = useCallback(() => {
    // Copy handled inside MessageContextMenu
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <ChatHeader
        groupName="Eco Alpha Core"
        groupInitials="EA"
        avatarBg="#e8f5e9"
        avatarTextColor="#2e7d32"
        pooledCapital="$18.2K"
        isActive={true}
      />

      {/* Date Separator */}
      <div className="flex justify-center py-3">
        <span className="bg-[#e5e8e6] text-[#6b7c75] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Today
        </span>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar pb-2 flex flex-col"
      >
        <div className="mt-auto">
          {messages.map((msg, idx) => {
            // Show sender name if this is not own message and sender changed from previous
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const showSender =
              !msg.isOwn &&
              (!prevMsg || prevMsg.senderName !== msg.senderName || prevMsg.isOwn);

            return (
              <ChatBubble
                key={msg.id}
                message={msg}
                showSender={showSender}
                onLongPress={handleLongPress}
              />
            );
          })}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />

      {/* Context Menu */}
      <MessageContextMenu
        isVisible={contextMenu.visible}
        position={contextMenu.position}
        messageText={contextMenu.messageText}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onClose={closeContextMenu}
      />
    </div>
  );
}
