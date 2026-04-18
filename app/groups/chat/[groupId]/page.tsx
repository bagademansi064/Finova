"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "@/component/Groups/Chat/ChatHeader";
import ChatBubble, { ChatMessage } from "@/component/Groups/Chat/ChatBubble";
import ChatInput from "@/component/Groups/Chat/ChatInput";
import MessageContextMenu from "@/component/Groups/Chat/MessageContextMenu";
import { getAuthToken, WS_BASE_URL } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";

export default function GroupChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
  const wsRef = useRef<WebSocket | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const groupId = params.groupId as string;
  const finovaId = searchParams.get('finovaId') || 'GROUP';

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !groupId) return;

    // Connect to Django Groups WebSocket dynamically using the true UUID
    const wsUrl = `${WS_BASE_URL}/groups/${groupId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log(`Connected to group ${groupId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message_broadcast') {
        const now = new Date();
        const msg: ChatMessage = {
          id: data.id || Date.now().toString(),
          senderName: data.sender_finova_id === 'You' ? "You" : data.sender_finova_id,
          text: data.content,
          time: `${now.getHours()}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`,
          isOwn: data.sender_finova_id === 'You',
          isRead: false,
          avatarInitials: (data.sender_finova_id || "U").substring(0, 2).toUpperCase(),
        };
        setMessages((prev) => [...prev, msg]);
      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    return () => {
      ws.close();
    };
  }, [groupId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content: text }));

      // Optimistic UI update
      const now = new Date();
      const msg: ChatMessage = {
        id: Date.now().toString() + "_optimistic",
        senderName: "You",
        text,
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`,
        isOwn: true,
        isRead: false,
        avatarInitials: "YO",
      };
      setMessages((prev) => [...prev, msg]);
    } else {
      console.error("WebSocket is not connected");
    }
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

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <ChatHeader
        groupName="Investment Club"
        groupInitials={finovaId.substring(0, 2).toUpperCase()}
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
        onCopy={() => { }}
        onClose={closeContextMenu}
      />
    </div>
  );
}
