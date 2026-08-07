"use client";

import Center from "@/components/EditorArea";
import Left from "@/components/SiderBar";
import Right from "@/components/right";
import { useSocketStore } from "@/service/socket.io";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { CircularProgress } from "@mui/material";
import * as cachingStores from "@/features";
import * as UIState from "@/store/ui_store/store/index";
import {AxiosError} from "axios"
export default function Home() {
  // --- UI global store ---
  const uiStore = UIState.useUIStore();

  // --- Socket & routing ---
  const socketStore = useSocketStore();
  const router = useRouter();

  const { user, setUser, resetUser } = useUserStore();
  const { chatType, selected: { chat } } = uiStore


  const { data: myUser, isLoading: loadingUser, refetch: refetchUser,error } = cachingStores.Users.useMyUser();

  useEffect(() => {
    if (myUser) {
      setUser(myUser.data);
    }
    if(error){
      let er = error as AxiosError
      if(er.status === 404){
        router.push("/sign")
      }
    }
  }, [myUser, setUser,error]);

  if (loadingUser || !user?.userId) {
    return (
      <div className="w-full h-screen flex items-center justify-center relative">
        <h1 className="absolute">Loading ...</h1>
        <CircularProgress />
      </div>
    );
  }

  setTimeout(() => socketStore.connect(user.userId), 0);

  const setUsers = async () => {
    await refetchUser()
  }



  return (
    <div className="font-sans min-w-screen min-h-screen flex box-border">
      <div className="w-2/7">
        <Left props={{
          isOpenMenu: uiStore.left,
          selectedChat: uiStore.selected.chat,
          setSelectedChat: uiStore.setSelectedChat,
          setChatType: uiStore.setChatType,
          socketStore: socketStore
        }} />
      </div>

      <Center />
      {/* Right panel ixtiyoriy */}
      {/* <Right /> */}
    </div>
  );
}
