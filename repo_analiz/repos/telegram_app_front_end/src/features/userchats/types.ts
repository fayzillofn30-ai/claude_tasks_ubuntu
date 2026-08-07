export interface UserChat {
  id: string;
  participantIds: string[];
  lastMessage?: string | null;
  updatedAt?: string;
}
