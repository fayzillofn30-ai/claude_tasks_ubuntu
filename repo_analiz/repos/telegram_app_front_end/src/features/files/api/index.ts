import api from "@/features/axiosInstance";

export const getImage = async (file:string) => {
  const { data } = await api.get(`/image/${file}`, { responseType: 'blob' });
  return data;
};
export const getVideo = async (file:string) => {
  const { data } = await api.get(`/video/${file}`, { responseType: 'blob' });
  return data;
};
export const getArchive = async (file:string) => {
  const { data } = await api.get(`/archive/${file}`, { responseType: 'blob' });
  return data;
};
export const getDocs = async (file:string) => {
  const { data } = await api.get(`/docs/${file}`, { responseType: 'blob' });
  return data;
};
export const uploadAvatar = async (formData:FormData) => {
  const { data } = await api.post('/avatar', formData);
  return data;
};
