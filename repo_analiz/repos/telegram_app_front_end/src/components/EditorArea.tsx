"use client"

import React, { useEffect, useState } from "react"
import { useUserStore } from "@/store/user.store"
import * as UIState from "@/store/ui_store/store"
import { useSocketStore } from "@/service/socket.io"
import RenderMessage from "./center/RenderMesssage"
import CenterHeader from "./center/CenterHeader"
import SendMessage from "./center/SendMessage"

function Center() {
  const [chatId, setChatId] = useState<string | null>(null)
  const { user } = useUserStore()
  const { selected } = UIState.useUIStore()

  useEffect(() => {
    if (selected.chat) {
      setChatId(selected.chat.id)
    }
  }, [selected])

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50">
      {/* Header */}
      <CenterHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {chatId ? (
          <RenderMessage chatId={chatId} />
        ) : (
          <p className="text-gray-400 text-center mt-10">Xabarlar yo‘q</p>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <SendMessage />
      </div>
    </div>
  )
}

export default Center
