import api from "@/features/axiosInstance";

export const createGroup = async (payload: any) => {
  const { data } = await api.post('/groupes/create', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
