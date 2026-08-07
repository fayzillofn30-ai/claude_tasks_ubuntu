import api from '@/lib/axios';
import { UserFlat } from './types';

export const usersApi = {
  create: async (dto: any, image?: File) => {
    if (image) {
      const form = new FormData();
      Object.entries(dto).forEach(([k, v]) => v !== undefined && form.append(k, String(v)));
      form.append('image', image);
      const { data } = await api.post('/users/create', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data as { message: string; user: UserFlat };
    }
    const { data } = await api.post('/users/create', dto);
    return data as { message: string; user: UserFlat };
  },

  getAll: async () => {
    const { data } = await api.get('/users/get-all');
    return (data as { message: string; count: number; users: UserFlat[] }).users;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/users/get-one/${id}`);
    return data as { message: string; user: UserFlat };
  },

  update: async (id: string, dto: any) => {
    const { data } = await api.patch(`/users/update-one/${id}`, dto);
    return data as { message: string; user: UserFlat };
  },

  remove: async (id: string) => {
    const { data } = await api.delete(`/users/delete-one/${id}`);
    return data as { message: string; user: UserFlat };
  },
};
