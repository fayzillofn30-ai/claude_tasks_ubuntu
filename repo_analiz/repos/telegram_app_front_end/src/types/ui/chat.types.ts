export interface Chat {
  id: string
  ownerId: string
  title: string
  description: string
  logo: string | null
  publicUrl: string
  privateUrl: string
  subscriptionsCount: number
  createdAt: string
  updatedAt: string
  type : "group" | "channel" | "user"
  user2Id? :string
  lastActivaty? : string
}
