import { User } from "./user.types"

export interface MessageContent {
  id: string
  text: string
  files: string[] | null
  images: string[] | null
  videos: string[] | null
  docs: string[] | null
  stickers: string[] | null
  updatedAt: string
  senderId: string
  chatId: string
}
export interface Message {
  message: MessageContent
  sender: Omit<User, "userId"> & { id: string }
}

