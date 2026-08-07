"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/store/user.store";
import { useSocketStore } from "@/service/socket.io";
import { LeftProps } from "@/types/left/left.types";
import { Chat } from "@/types/ui/chat.types";
import { User } from "@/types/ui/user.types";
import api from "@/features/axiosInstance";
import { Users, Groupes, UserChats } from "@/features";
import { UserCard } from "./left-render/UserRender";
import { ChatCard } from "./left-render/ChatRender";
import * as UIState from "@/store/ui_store/store";
import { Button } from "@mui/material";
import LeftMenu from "./left-render/LeftMenu";

function Left({ props }: LeftProps) {
  const { socket } = useSocketStore();
  // @ts-ignore
  const useUsers = Users.useAllUsers(socket);
  const { data: fetchedPrivateChats } = UserChats.useMyChats();
  const { user } = useUserStore();
  const { left, selected, toggleLeft } = UIState.useUIStore();

  const { setSelectedChat, isOpenMenu, selectedChat, socketStore, setChatType } = props;

  const [targetFolder, setTargetFolder] = useState<
    "all" | "group" | "channel" | "users" | "private"
  >("all");
  const [chats, setChats] = useState<Chat[]>([]);

  // === Querylar ===
  if (!useUsers) return null;
  const { data: fetchedUsers, refetch: refetchUsers } = useUsers;

  const createGroupFunction = async (payload: object) => {
    try {
      await Groupes.createGroup(payload);
      // Kerak bo‘lsa refetch yoki state yangilash
    } catch (error) {
      console.error("Group yaratishda xatolik:", error);
    }
  };

  const setChatTypeFunction = (chatType: UIState.UIState["chatType"]) => {
    setChatType(chatType);
  };

  const targetFolders: typeof targetFolder[] = [
    "all",
    "group",
    "channel",
    "users",
    "private",
  ];

  // === Chatlarni olish (faqat all/group/channel uchun) ===
  const fetchChats = useCallback(async () => {
    try {
      let url = "chats/get-all";
      if (targetFolder === "users") return;
      if (targetFolder !== "all")
        url = `chats/get-all/${targetFolder === "private" ? "user" : targetFolder}`;
      const { data } = await api.get(url);
      setChats(data);
    } catch (error) {
      console.error("❌ Chatlarni olishda xato:", error);
    }
  }, [targetFolder]);

  useEffect(() => {
    if (socket) {
      socket.on("create-user", (user) => {
        // Qo‘shimcha ishlar qilinishi mumkin
        refetchUsers?.();
      });
    }
  }, [socket, refetchUsers]);

  useEffect(() => {
    if (targetFolder !== "users") fetchChats();
  }, [targetFolder, fetchChats]);

  // === Userni tanlaganda yangi chat yaratish ===
  const handleUserSelect = async (selectedUser: User) => {
    try {
      const { data } = await api.post(selectedUser.publicUrl);
      setSelectedChat(data);
      setChatType("user");
    } catch (error) {
      console.error("❌ Chat yaratishda xato:", error);
    }
  };

  return (
    <div className="flex w-full min-h-screen border-r">
      {/* === Chap panel (filterlar) === */}
      <div className="w-full border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <LeftMenu />
          <Button variant="outlined" size="small" onClick={() => toggleLeft()}>
            Menu
          </Button>
        </div>

        <nav className="flex space-x-2 overflow-x-auto border-b px-4 py-2 bg-white">
          {targetFolders.map((target) => (
            <button
              key={target}
              onClick={() => setTargetFolder(target)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150
              ${
                targetFolder === target
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {target.charAt(0).toUpperCase() + target.slice(1)}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          {targetFolder === "users" ? (
            fetchedUsers && fetchedUsers.length > 0 ? (
              (fetchedUsers as User[]).map((item) => (
                <UserCard
                  key={item.userId}
                  user={item}
                  socket={socket}
                  onSelect={handleUserSelect}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10">Foydalanuvchilar mavjud emas</p>
            )
          ) : chats.length > 0 ? (
            chats.map((ch) => (
              <ChatCard
                key={ch.id}
                chat={ch}
                onSelect={setSelectedChat}
                userId={user?.userId || ""}
                setChatType={setChatTypeFunction}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">Chatlar mavjud emas</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Left;
