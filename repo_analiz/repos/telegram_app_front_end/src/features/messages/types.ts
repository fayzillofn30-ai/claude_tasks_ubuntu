export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content?: string | null;
  fileUrl?: string | null;
  createdAt?: string;
}
