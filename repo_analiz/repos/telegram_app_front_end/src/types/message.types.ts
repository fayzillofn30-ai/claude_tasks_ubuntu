export type MessageType = {
  message: {
    id: string
    text: string
    senderId : string
    updatedAt: string
    files: string[] | null
    images: string[] | null
    videos: string[] | null
    docs: string[] | null
  }
  sender: {
    id : string
    firstName: string
    lastName: string
    avatar: string
  }
}