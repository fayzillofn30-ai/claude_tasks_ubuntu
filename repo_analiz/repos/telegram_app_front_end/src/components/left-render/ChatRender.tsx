import React, { useEffect, useState } from "react";
import { Chat } from "@/types/ui/chat.types";
import * as UIState from "@/store/ui_store/store";
import { useSocketStore } from "@/service/socket.io";

interface ChatCardProps {
  chat: Chat;
  onSelect: (chat: Chat) => void;
  userId: string;
  setChatType: (chatType: "groupe" | "channel" | "user") => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  chat,
  onSelect,
  userId,
  setChatType,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingChatId, setTypingChatId] = useState<string>("");
  const { baseUrl } = UIState.useUIStore();
  const { socket } = useSocketStore();

  const handleSelect = (chat: Chat) => {
    onSelect(chat);
    setChatType(chat.type as "groupe" | "channel" | "user");
  };

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chat.id) {
        setIsTyping(true);
        setTypingChatId(data.chatId);
      }
    };

    const handleTypingStop = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chat.id) {
        setIsTyping(false);
        setTypingChatId("");
      }
    };

    socket.on("typing", handleTyping);
    socket.on("typing_stop", handleTypingStop);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("typing_stop", handleTypingStop);
      setIsTyping(false);
    };
  }, [socket, chat.id]);

  const logoUrl = chat.logo
    ? baseUrl.endsWith("/")
      ? `${baseUrl}${chat.logo}`
      : `${baseUrl}/${chat.logo}`
    : "";

  return (
    <div
      onClick={() => handleSelect(chat)}
      className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors rounded-md"
    >
      <img
        src={logoUrl}
        alt={chat.title}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
      <div className="flex flex-col overflow-hidden">
        <div className="flex space-x-7">
          <h2 className="font-semibold text-gray-900 truncate">{chat.title}</h2>
          {
            chat.lastActivaty ? <small>{new Date(chat.lastActivaty).toLocaleString("en-US",{hour : "2-digit","minute": "2-digit"})}</small> : <small>{chat.subscriptionsCount}</small>
          }
        </div>
        {isTyping && chat.type === "user" && typingChatId === chat.id ? (
          <p className="text-xs text-blue-600 font-medium mt-1">typing...</p>
        ) : (
          <p className="text-sm text-gray-600 truncate">
            {chat.description || "No description"}
          </p>
        )}
      </div>
    </div>
  );
};
