export interface User {
  userId: string
  profileId: string
  username: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  bio: string | null
  isBot: boolean
  publicUrl: string
  privateUrl: string
  lastActivaty: string
}
