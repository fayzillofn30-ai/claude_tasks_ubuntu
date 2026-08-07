// src/types/left/left.types.tsx
import { Chat } from "@/types/ui/chat.types"
import { UIState } from "@/store/ui_store/store"
import { Message } from "../ui/message.types"

export type LeftProps = {
  props: {
    isOpenMenu: boolean
    socketStore: Record<string, any>
    selectedChat: Chat | null
    setSelectedChat: UIState["setSelectedChat"]
    setChatType: UIState["setChatType"] // ✅ <-- endi to‘g‘ri
  }
}
