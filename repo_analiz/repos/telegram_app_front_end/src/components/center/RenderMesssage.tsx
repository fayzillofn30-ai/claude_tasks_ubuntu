"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import { useUserStore } from "@/store/user.store"
import * as UIState from "@/store/ui_store/store"
import { useSocketStore } from "@/service/socket.io"
import { Messages } from "@/features"
import { Message } from "@/types/ui/message.types"

type Props = {
  chatId: string | null
}

const RenderMessage: React.FC<Props> = ({ chatId }) => {
  const { user } = useUserStore()
  const { selected, baseUrl } = UIState.useUIStore()
  const { socket } = useSocketStore()
  const [loadingId, setLoadingId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const { data: allMessages = [], isLoading, refetch } = Messages.useAllMessages<Message[]>(
    selected.chat?.type || "",
    selected.chat?.id || ""
  )

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages])

  const handleDelete = async (msgId: string) => {
    if (selected.chat?.type) {
      setLoadingId(msgId)
      socket?.on("create-msg", () => refetch())
      await Messages.removeMessage(msgId, selected.chat.type)
      setLoadingId("")
    }
  }

  const uniqueMessages: string[] = []

  return (
    <div className="flex flex-col gap-3 max-h-full w-full overflow-y-auto">
      {allMessages.map(({ message, sender }) => {
        const isMine = user?.userId === sender.id
        if (uniqueMessages.includes(message.id)) return null
        uniqueMessages.push(message.id)

        return (
          <div
            key={message.id}
            className={`flex gap-2 max-w-[85%] ${
              isMine ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            <img
              src={`${baseUrl}${sender.avatar}` || ""}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />

            <div
              className={`rounded-xl p-3 shadow-sm ${
                isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              <div className="text-sm font-medium">
                {sender.firstName} {sender.lastName}
              </div>

              {/* Text */}
              {message.text && (
                <div className="mt-1 text-sm whitespace-pre-line">{message.text}</div>
              )}

              {/* Files */}
              {message.files && message.files?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.files.map((file, i) => (
                    <a
                      key={i}
                      href={`${baseUrl}${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-100 underline block text-sm"
                    >
                      📎 {file}
                    </a>
                  ))}
                </div>
              )}

              {/* Images */}
              {message.images && message.images?.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${baseUrl}${img}`}
                      alt="image"
                      className="w-full h-32 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Time */}
              <div className="text-xs text-gray-300 mt-1 text-right">
                {new Date(message.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Delete Button */}
              {isMine && (
                <div className="mt-1 flex justify-end">
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() => handleDelete(message.id)}
                    disabled={loadingId === message.id}
                  >
                    {loadingId === message.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      "O‘chirish"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Scroll ref */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default RenderMessage
