"use client"

import React, { useEffect, useState, useRef } from 'react'
import * as UIState from "@/store/ui_store/store"
import { createMessageSchema } from '@/features/messages/api/dto'
import { useUserStore } from '@/store/user.store'
import { Messages } from '@/features'
import { useSocketStore } from '@/service/socket.io'

function SendMessage() {
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  const { selected, chatType } = UIState.useUIStore()
  const { user } = useUserStore()
  const { socket } = useSocketStore()
  const chat = selected.chat

  // ============================
  // 🔸 Typing Event: Handle user input
  // ============================
  const handleTyping = () => {
    if (!socket || !user?.userId || !chat?.id) return

    // Emit "typing" only once until "typing_stop" is sent
    if (!isTypingRef.current) {
      socket.emit("typing", {
        userId: user.userId,
        chatId: chat.id,
      })
      isTypingRef.current = true
    }

    // Reset timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", {
        userId: user.userId,
        chatId: chat.id,
      })
      isTypingRef.current = false
    }, 1500) // 1.5s delay before considering as "stopped typing"
  }

  // ============================
  // 🔸 SEND MESSAGE HANDLER
  // ============================
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.userId || !chat || !chatType) return

    try {
      const validated = await createMessageSchema.validateAsync({
        text,
        chatId: chat.id,
        senderId: user.userId,
      })

      // Send message
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((file) => formData.append("files", file))
        formData.append("senderId", user.userId)
        formData.append("chatId", chat.id)
        await Messages.sendMessage(formData, chatType)
      } else if (text.trim()) {
        await Messages.sendMessage(validated, chatType)
      }

      // Clear input
      setText("")
      setFiles([])

      // Emit typing_stop immediately after sending
      if (socket) {
        socket.emit("typing_stop", {
          userId: user.userId,
          chatId: chat.id,
        })
      }

      isTypingRef.current = false
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    } catch (err) {
      console.error("Xatolik:", err)
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="p-3 flex gap-2 border-t bg-white">
      {/* 📎 File Upload */}
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer px-3 py-2 bg-gray-200 rounded">📎</label>

      {/* ✍️ Message Input */}
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          handleTyping()
        }}
        placeholder="Xabar yozing..."
        className="flex-1 border px-3 py-2 rounded"
      />

      {/* 🚀 Send Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!text.trim() && files.length === 0}
      >
        Yuborish
      </button>
    </form>
  )
}

export default SendMessage
