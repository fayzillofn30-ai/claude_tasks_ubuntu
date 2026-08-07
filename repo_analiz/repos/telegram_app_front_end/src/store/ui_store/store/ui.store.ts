import { create } from "zustand"
import { Chat } from "@/types/ui/chat.types"
import { User } from "@/features/users"
import { Message } from "@/features/messages/types"

export type UIState = {
  baseUrl : string
  isOpenGroupModal: boolean
  isOpenChannelModal: boolean
  infoUrl : string 
  left: boolean
  right: boolean
  editProfile: boolean
  editMessage: boolean
  chatInfo: boolean
  chatType: "groupe" | "channel" | "user"

  selected: {
    chat: Chat | null
    message: Message | null
    user: User | null
    profile: User | null
  }

  selectedMessages: string[]
  user: User | null
  profile: User | null

  // --- toggle actions ---

  toggleGroupCreateModal: () => void
  toggleChannelCreateModal: () => void
  toggleLeft: () => void
  toggleRight: () => void
  toggleEditProfile: () => void
  toggleEditMessage: () => void
  toggleChatInfo: () => void

  // --- set actions ---
  setUser: (user: User) => void
  setProfile: (profile: User) => void

  setSelectedChat: (chat: Chat | null) => void
  setSelectedUser: (user: User | null) => void
  setSelectedProfile: (profile: User | null) => void
  setSelectedMessage: (message: Message | null) => void
  setChatType: (type: "groupe" | "channel" | "user") => void

  // --- message selection ---
  setSelectedMessages: (messages: string[]) => void
  addSelectedMessage: (id: string) => void
  removeSelectedMessage: (id: string) => void
  clearSelectedMessages: () => void

  setInfoUrl : (url :string) => void

  reset: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  // --- default state ---
  baseUrl : "http://localhost:15976/",
  infoUrl : "",
  isOpenGroupModal: false,
  isOpenChannelModal: false,
  left: false,
  right: false,
  editProfile: false,
  editMessage: false,
  chatInfo: false,
  chatType: "user",
  selected: {
    chat: null,
    message: null,
    user: null,
    profile: null,
  },
  selectedMessages: [],
  user: null,
  profile: null,

  // --- toggle ---
  toggleGroupCreateModal: () => set((s) => ({ isOpenGroupModal: !s.isOpenGroupModal })),
  toggleChannelCreateModal: () => set((s) => ({ isOpenChannelModal: !s.isOpenChannelModal })),
  toggleLeft: () => set((s) => ({ left: !s.left })),
  toggleRight: () => set((s) => ({ right: !s.right })),
  toggleEditProfile: () => set((s) => ({ editProfile: !s.editProfile })),
  toggleEditMessage: () => set((s) => ({ editMessage: !s.editMessage })),
  toggleChatInfo: () => set((s) => ({ chatInfo: !s.chatInfo })),

  // --- set basic ---
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  // --- set selected objects ---
  setSelectedChat: (chat) => set((s) => ({ selected: { ...s.selected, chat } })),
  setSelectedUser: (user) => set((s) => ({ selected: { ...s.selected, user } })),
  setSelectedProfile: (profile) =>
    set((s) => ({ selected: { ...s.selected, profile } })),
  setSelectedMessage: (message) =>
    set((s) => ({ selected: { ...s.selected, message } })),

  // --- fix: correct field name ---
  setChatType: (type) => set({ chatType: type }),

  // --- multi-select message actions ---
  setSelectedMessages: (messages) => set({ selectedMessages: messages }),
  addSelectedMessage: (id) =>
    set((s) => ({
      selectedMessages: [...new Set([...s.selectedMessages, id])],
    })),
  removeSelectedMessage: (id) =>
    set((s) => ({
      selectedMessages: s.selectedMessages.filter((x) => x !== id),
    })),
  clearSelectedMessages: () => set({ selectedMessages: [] }),

  setInfoUrl : (url :string) => set({infoUrl : url}),

  // --- reset all ---
  reset: () =>
    set({
      isOpenGroupModal: false,
      isOpenChannelModal : false,
      left: false,
      right: false,
      editProfile: false,
      editMessage: false,
      chatInfo: false,
      chatType: "user",
      selected: { chat: null, message: null, user: null, profile: null },
      selectedMessages: [],
      user: null,
      profile: null,
    }),
}))
