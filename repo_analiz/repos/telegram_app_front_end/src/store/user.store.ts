import { create } from "zustand";


export type User = {
    "userId": "aa5f857f-85b7-42c7-a022-4693f2265275",
    "email": "ovovovlululutvata@gmail.com",
    "firstName": "Fayzillo",
    "lastName": "Ummatov",
    "avatar": "http://localhost:15976/api/image/1759334442562-111109608.jpg",
    "bio": null,
    "privateUrl": null,
    "publicUrl": null,
    "isBot": false,
    "profileId": "09dc3d5e-4025-4f07-802c-6176b70e2d69"
    "username" : "fayzill95",
    lastActivaty : string
}
/*
userId,
email,
firstName,
lastName,
avatar,
bio,
privateUrl,
publicUrl,
isBot,
profileId,
username,
lastActivaty
*/

export type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (field: keyof User, value: any) => void;
    resetUser: () => void;
};


export type emailStoreType = {
    email: string | null;
    setEmail: (email : string) => void;
    resetEmil : () => void;
}

export const emailStore = create<emailStoreType>(set => (
    {
        email: "",
        setEmail : (email) => {set({email})},
        resetEmil : () => {set({email : ""})}
    }
))


export const useUserStore = create<UserStore>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    updateUser: (field, value) =>
        set((state) =>
            state.user
                ? {
                    user: {
                        ...state.user,
                        [field]: value,
                    },
                }
                : state
        ),

    resetUser: () => set({ user: null }),
}));
