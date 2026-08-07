import React, { useEffect, useState } from 'react'
import * as UIState from "@/store/ui_store/store"
import { useUserStore } from '@/store/user.store'
import { useSocketStore } from '@/service/socket.io'

function CenterHeader() {
    const { selected, baseUrl } = UIState.useUIStore()
    const { user } = useUserStore()
    const { socket } = useSocketStore()
    
    const [isTyping, setIsTyping] = useState(false)
    const [isOnline, setIsOnline] = useState<boolean>(false)

    useEffect(() => {
        if (!socket || !selected.chat) return;

        const handleTyping = (data: { userId: string, chatId: string }) => {
            if(!selected.chat) return
            if (selected.chat.type !== "user") return;
            if (data.userId === selected.chat.ownerId || data.userId === selected.chat.id) {
                setIsTyping(true);
            }
        }

        const handleStopTyping = (data: { userId: string, chatId: string }) => {
            if(!selected.chat) return
            if (selected.chat.type !== "user") return;
            if (data.userId === selected.chat.ownerId) {
                setIsTyping(false);
            }
        }

        const handleOnline = (data: { userId: string, isOnline: boolean }) => {
            if(!selected.chat) return
            if (selected.chat.type !== "user") return;
            if (data.userId === selected.chat.ownerId) {
                setIsOnline(data.isOnline);
                if(!data.isOnline){
                    setIsTyping(false)
                }
            }
        }

        socket.on("typing", handleTyping);
        socket.on("typing_stop", handleStopTyping);
        socket.on("online", handleOnline);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("typing_stop", handleStopTyping);
            socket.off("online", handleOnline);
        }
    }, [socket, selected.chat]);

    if (!selected.chat) {
        return (
            <div className="border-b py-4 px-4">
                <h1 className="text-gray-400 text-lg">Chat tanlang</h1>
            </div>
        )
    }

    const isUserChat = selected.chat.type === "user";
    const isOwner = selected.chat.ownerId === user?.userId;
    const lastActiveDate = selected.chat?.lastActivaty
        ? new Date(selected.chat?.lastActivaty)
        : null;

    const formatLastSeen = () => {
        if (!lastActiveDate || isNaN(lastActiveDate.getTime())) return "No recent activity";
        return lastActiveDate.toLocaleString("en-US", {
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="border-b py-4 px-4 flex flex-col gap-1 bg-white shadow-sm">
            <div className="flex items-center gap-4">
                <img
                    src={selected.chat.logo ? `${baseUrl}${selected.chat.logo}` : ""}
                    alt="chat-logo"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900">
                        {selected.chat.title}
                    </h1>

                    {isUserChat ? (
                        isOwner ? (
                            <p className="text-sm text-gray-600">{selected.chat.description}</p>
                        ) : isTyping && isOnline ? (
                            <p className="text-xs text-blue-600 font-medium mt-1">typing...</p>
                        ) : isOnline ? (
                            <p className="text-sm text-green-600 font-medium">Online</p>
                        ) : (
                            <p className="text-sm text-gray-500">{formatLastSeen()}</p>
                        )
                    ) : (
                        <span className="text-sm text-gray-500">
                            Followers:{" "}
                            <span className="font-medium">{selected.chat.subscriptionsCount}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CenterHeader;
