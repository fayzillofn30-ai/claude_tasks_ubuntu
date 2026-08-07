import api from '@/features/axiosInstance';

// === Universal message send ===
// type: string
export const sendMessage = async (payload: any, type: string) => {
  const { data } = await api.post(`/messages/${type}`, payload);
  return data;
};

// === Fetch all messages by chat ===
export const getMessages = async (chatId: string, type: string) => {
  const url = `messages/${type || ""}/get-all/${chatId}`
  const { data } = await api.get(url);
  return data.messages;
};

// === Fetch single message ===
export const getMessage = async (id: string, type: string) => {
  const { data } = await api.get(`/messages/${type}/get-one/${id}`);
  return data;
};

// === Remove single message ===
export const removeMessage = async (id: string, type: string) => {
  const { data } = await api.delete(`/messages/${type}/remove-one/${id}`);
  return data;
};
