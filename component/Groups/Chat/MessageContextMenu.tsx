"use client";
import React, { useEffect, useRef } from "react";
import { Trash2, Copy } from "lucide-react";

interface MessageContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onDelete: () => void;
  onCopy: () => void;
  onClose: () => void;
  messageText: string;
}

export default function MessageContextMenu({
  isVisible,
  position,
  onDelete,
  onCopy,
  onClose,
  messageText,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Adjust position to keep menu in viewport
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: position.y,
    left: position.x,
    zIndex: 100,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText).catch(() => {
      // Fallback for clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = messageText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
    onCopy();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99] bg-black/10" onClick={onClose} />

      {/* Menu */}
      <div
        ref={menuRef}
        style={menuStyle}
        className="z-[100] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden animate-context-menu-in min-w-[52px]"
      >
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex items-center justify-center w-[52px] h-[52px] transition-colors active:bg-[#fce4ec] tap-highlight"
          aria-label="Delete message"
        >
          <Trash2 size={20} strokeWidth={1.8} className="text-[#e53935]" />
        </button>

        <div className="h-px bg-[#e5e8e6] mx-2" />

        <button
          onClick={() => {
            handleCopy();
            onClose();
          }}
          className="flex items-center justify-center w-[52px] h-[52px] transition-colors active:bg-[#f0f2f1] tap-highlight"
          aria-label="Copy message"
        >
          <Copy size={20} strokeWidth={1.8} className="text-[#6b7c75]" />
        </button>
      </div>
    </>
  );
}
