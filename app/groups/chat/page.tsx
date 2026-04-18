"use client";
import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import ChatHeader from "@/component/Groups/Chat/ChatHeader";
import ChatBubble, { ChatMessage } from "@/component/Groups/Chat/ChatBubble";
import ChatInput from "@/component/Groups/Chat/ChatInput";
import MessageContextMenu from "@/component/Groups/Chat/MessageContextMenu";
import { getAuthToken, WS_BASE_URL, apiFetch } from "@/lib/api";
import { useSearchParams } from "next/navigation";

import GroupCapitalModal from "@/component/Groups/Chat/GroupCapitalModal";
import InviteMemberModal from "@/component/Groups/Chat/InviteMemberModal";

function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myFinovaId, setMyFinovaId] = useState<string>("");
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [groupDetails, setGroupDetails] = useState<{name: string, capital: number, isLoading: boolean}>({
    name: "Loading...",
    capital: 0,
    isLoading: true
  });
  const [typingUsers, setTypingUsers] = useState<Map<string, {username: string, timeout: any}>>(new Map());
  const typingTimeouts = useRef<Record<string, any>>({});
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const finovaId = searchParams.get('finovaId') || 'GROUP';

  // Fetch Group details and History
  useEffect(() => {
    if (!finovaId || finovaId === 'GROUP') return;
    async function fetchGroupData() {
      try {
        const [meRes, groupRes, msgRes] = await Promise.all([
          apiFetch('/users/me/'),
          apiFetch(`/groups/${finovaId}/`),
          apiFetch(`/groups/${finovaId}/messages/`)
        ]);
        
        let personalFinovaId = "";
        if (meRes.ok) {
           const meData = await meRes.json();
           personalFinovaId = meData.finova_id;
           setMyFinovaId(personalFinovaId);
        }

        if (groupRes.ok) {
          const data = await groupRes.json();
          setGroupDetails({
            name: data.name,
            capital: data.wallet ? parseFloat(data.wallet.current_balance) : 0,
            isLoading: false
          });
        }
        
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          const history = (msgData.results || msgData).map((m: any) => {
            const dt = new Date(m.created_at);
            const isMyText = personalFinovaId ? m.sender_finova_id === personalFinovaId : m.sender_finova_id === 'You';
            
            // Detect cardAction from message content
            let cardAction: "discuss" | "poll" | undefined;
            let pollDirection: "buy" | "sell" | undefined;
            const content = m.content || "";
            if (content.match(/discuss$/i)) cardAction = "discuss";
            else if (content.match(/poll(\s+(buy|sell))?$/i)) {
              cardAction = "poll";
              pollDirection = content.match(/sell/i) ? "sell" : "buy";
            }

            return {
              id: m.id,
              senderName: isMyText ? "You" : m.sender_finova_id,
              text: m.content,
              time: `${dt.getHours()}:${dt.getMinutes().toString().padStart(2, '0')} ${dt.getHours() >= 12 ? 'PM' : 'AM'}`,
              isOwn: isMyText,
              isRead: true,
              avatarInitials: (m.sender_finova_id || "U").substring(0, 2).toUpperCase(),
              messageType: m.message_type,
              stockSymbol: m.stock_symbol,
              cardAction,
              pollDirection,
              createdAt: m.created_at,
            }
          });
          // Set messages directly — DRF natively returns chronological [Oldest, Newer, Newest]
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to fetch group data:", err);
      }
    }
    fetchGroupData();
  }, [finovaId]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !groupId) return;

    // Connect to Django Groups WebSocket dynamically using the true UUID
    const wsUrl = `${WS_BASE_URL}/groups/${groupId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    let isMounted = true;

    ws.onopen = () => {
      if (isMounted) console.log(`Connected to group ${groupId}`);
    };
    
    ws.onmessage = (event) => {
      if (!isMounted) return;
      const data = JSON.parse(event.data);
      
      if (data.type === 'group_message_broadcast') {
        const now = new Date();
        const isMyText = myFinovaId ? data.sender_finova_id === myFinovaId : data.sender_finova_id === 'You';
        
        // Don't add if it's our own optimistic message (we'll see it from our own send)
        // Actually, it's better to let the server broadcast be the source of truth
        setMessages((prev) => {
          if (prev.find(m => m.id === data.id)) return prev;
          const msg: ChatMessage = {
            id: data.id || Date.now().toString(),
            senderName: isMyText ? "You" : data.sender_username || data.sender_finova_id,
            text: data.content,
            time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`,
            isOwn: isMyText, 
            isRead: false,
            avatarInitials: (data.sender_username || data.sender_finova_id || "U").substring(0, 2).toUpperCase(),
            messageType: data.message_type,
            stockSymbol: data.stock_symbol,
            cardAction: data.cardAction,
            pollDirection: data.pollDirection,
            pollId: data.pollId,
            discussionId: data.discussionId,
            createdAt: data.created_at
          };
          return [...prev, msg];
        });

        // Clear typing status for this user when they send a message
        setTypingUsers(prev => {
          const next = new Map(prev);
          next.delete(data.sender_finova_id);
          return next;
        });
      }

      if (data.type === 'group_user_typing') {
        if (data.sender_finova_id === myFinovaId) return;

        if (data.is_typing) {
          setTypingUsers(prev => {
            const next = new Map(prev);
            
            // Clear existing timeout
            if (typingTimeouts.current[data.sender_finova_id]) {
               clearTimeout(typingTimeouts.current[data.sender_finova_id]);
            }

            // Set auto-clear timeout
            const timeout = setTimeout(() => {
              setTypingUsers(curr => {
                const nextCurr = new Map(curr);
                nextCurr.delete(data.sender_finova_id);
                return nextCurr;
              });
            }, 3000);

            typingTimeouts.current[data.sender_finova_id] = timeout;
            next.set(data.sender_finova_id, { username: data.sender_username, timeout });
            return next;
          });
        } else {
          setTypingUsers(prev => {
            const next = new Map(prev);
            if (typingTimeouts.current[data.sender_finova_id]) {
                clearTimeout(typingTimeouts.current[data.sender_finova_id]);
                delete typingTimeouts.current[data.sender_finova_id];
            }
            next.delete(data.sender_finova_id);
            return next;
          });
        }
      }
    };

    ws.onerror = (error) => {
      if (isMounted) {
        console.error("WebSocket Error (Full):", JSON.stringify(error, null, 2), error);
      }
    };
    
    ws.onclose = (event) => {
      if (isMounted) {
        console.warn(`WebSocket Closed: Code=${event.code}, Reason=${event.reason}, Clean=${event.wasClean}`);
      }
    };

    return () => {
      isMounted = false;
      console.log("Cleaning up WebSocket connection");
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [groupId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    let messageType = "text";
    let stockSymbol: string | null = null;
    let cardAction: "discuss" | "poll" | null = null;
    let pollDirection: "buy" | "sell" | null = null;
    let content = text;
    let discussionId: string | undefined;
    let pollId: string | undefined;

    // Command Parsing: /stock SYMBOL [discuss | poll buy/sell/default]
    const stockMatch = text.match(/^\/stock\s+["']?([A-Za-z0-9._-]+)["']?\s*(discuss|poll(?:\s+(?:buy|sell))?)?$/i);
    if (stockMatch) {
      messageType = "stock";
      stockSymbol = stockMatch[1].toUpperCase();
      const action = (stockMatch[2] || "").trim().toLowerCase();

      if (action === "discuss") {
        cardAction = "discuss";
        // Create Discussion entity on the backend
        try {
          const res = await apiFetch(`/groups/${finovaId}/discussions/`, {
            method: "POST",
            body: JSON.stringify({
              stock_symbol: stockSymbol,
              stock_name: stockSymbol,
              discussion_type: "buy",
              reasoning: `Discussion thread for ${stockSymbol}`,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            discussionId = data.id;
          }
        } catch (e) {
          console.error("Failed to create discussion:", e);
        }
      } else if (action.startsWith("poll")) {
        cardAction = "poll";
        pollDirection = action.includes("sell") ? "sell" : "buy";
        // Create Discussion + TradePoll via direct-vote
        try {
          const discRes = await apiFetch(`/groups/${finovaId}/discussions/`, {
            method: "POST",
            body: JSON.stringify({
              stock_symbol: stockSymbol,
              stock_name: stockSymbol,
              discussion_type: pollDirection,
              reasoning: `Poll to ${pollDirection} ${stockSymbol}`,
              required_capital: 0,
            }),
          });
          if (discRes.ok) {
            const discData = await discRes.json();
            discussionId = discData.id;
            // Trigger direct-vote to create TradePoll immediately
            const voteRes = await apiFetch(`/groups/${finovaId}/discussions/${discData.id}/direct-vote/`, {
              method: "POST",
            });
            if (voteRes.ok) {
              const voteData = await voteRes.json();
              pollId = voteData.poll_id;
            }
          }
        } catch (e) {
          console.error("Failed to create poll:", e);
        }
      }
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content, message_type: messageType, stock_symbol: stockSymbol }));
      
      // Optimistic UI update
      const now = new Date();
      const msg: ChatMessage = {
        id: Date.now().toString() + "_optimistic",
        senderName: "You",
        text: content,
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`,
        isOwn: true,
        isRead: false,
        avatarInitials: "YO",
        messageType,
        stockSymbol: stockSymbol || undefined,
        cardAction: cardAction || undefined,
        pollDirection: pollDirection || undefined,
        discussionId,
        pollId,
        createdAt: now.toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    } else {
      console.error("WebSocket is not connected");
    }
  }, [finovaId]);

  const handleTyping = useCallback((isTyping: boolean) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
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

  const handleDiscussClick = useCallback((symbol: string, discussionId?: string) => {
    // Navigate to the discussion thread page
    const params = new URLSearchParams({
      groupId: groupId || '',
      finovaId: finovaId,
      symbol: symbol,
      ...(discussionId ? { discussionId } : {}),
    });
    window.location.href = `/groups/chat/discussion?${params.toString()}`;
  }, [groupId, finovaId]);

  const handleVoteSubmit = useCallback(async (pollIdToVote: string, choice: string) => {
    try {
      // Capital contribution gate: check if user has deposited
      const walletRes = await apiFetch(`/groups/${finovaId}/wallet/`);
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        const userTransactions = walletData.transactions?.filter(
          (t: any) => t.transaction_type === 'deposit'
        ) || [];
        
        if (userTransactions.length === 0) {
          // User hasn't contributed — prompt them
          setShowCapitalModal(true);
          alert("You must contribute to the pool capital before voting. Please deposit first.");
          return;
        }
      }

      const res = await apiFetch(`/groups/${finovaId}/polls/${pollIdToVote}/vote/`, {
        method: "POST",
        body: JSON.stringify({ choice }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Vote recorded:", data);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to vote.");
      }
    } catch (e) {
      console.error("Vote submission failed:", e);
    }
  }, [finovaId]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <ChatHeader
        groupName={groupDetails.name}
        groupInitials={groupDetails.isLoading ? ".." : groupDetails.name.substring(0, 2).toUpperCase()}
        avatarBg="#e8f5e9"
        avatarTextColor="#2e7d32"
        pooledCapital={groupDetails.capital > 0 ? `₹${groupDetails.capital.toLocaleString()}` : "₹0"}
        isActive={true}
        typingStatus={
          typingUsers.size > 0 
            ? `${Array.from(typingUsers.values()).map(u => u.username).join(", ")} ${typingUsers.size === 1 ? 'is' : 'are'} typing...`
            : undefined
        }
        onCapitalClick={() => setShowCapitalModal(true)}
        onInviteClick={() => setShowInviteModal(true)}
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
                groupFinovaId={finovaId}
                myFinovaId={myFinovaId}
                onDiscussClick={handleDiscussClick}
                onVoteSubmit={handleVoteSubmit}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />

      {/* Context Menu */}
      <MessageContextMenu
        isVisible={contextMenu.visible}
        position={contextMenu.position}
        messageText={contextMenu.messageText}
        onDelete={handleDelete}
        onCopy={() => {}}
        onClose={closeContextMenu}
      />

      <GroupCapitalModal
        isOpen={showCapitalModal}
        onClose={() => setShowCapitalModal(false)}
        finovaId={finovaId}
        currentCapital={groupDetails.capital}
        onSuccess={() => {
          // Simply refetch group details to update pool capital visually
          apiFetch(`/groups/${finovaId}/`)
            .then(res => res.json())
            .then(data => setGroupDetails(prev => ({...prev, capital: data.wallet ? parseFloat(data.wallet.current_balance) : 0})));
        }}
      />

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        finovaId={finovaId}
        onSuccess={(msg) => alert(msg)}
      />
    </div>
  );
}

export default function GroupChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
}
