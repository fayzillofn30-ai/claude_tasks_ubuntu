import api from "@/features/axiosInstance";

export const createProfile = async (payload:any) => { const { data } = await api.post('/profile/create', payload); return data; };
export const getAllProfiles = async () => { const { data } = await api.get('/profile/get-all'); return data; };
export const getOneProfile = async (id:string) => { const { data } = await api.get(`/profile/get-one/${id}`); return data; };
export const updateProfile = async (id:string,payload:any) => { const { data } = await api.patch(`/profile/update-one/${id}`, payload); return data; };
export const deleteProfile = async (id:string) => { const { data } = await api.delete(`/profile/delete-one/${id}`); return data; };
