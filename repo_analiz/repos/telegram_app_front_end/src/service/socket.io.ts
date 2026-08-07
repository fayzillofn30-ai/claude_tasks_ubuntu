import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import {v4} from "uuid"

export type SocketStoreType = {
  socket: Socket | null;
  connect: (userId: string) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStoreType>((set, get) => ({
  socket: null,

  connect: (userId: string) => {

    if (get().socket) return get().socket;

    const socket = io("http://localhost:15975", {
      withCredentials: true,
      query: { userId ,deviceId : v4()},
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    console.log(socket)
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
