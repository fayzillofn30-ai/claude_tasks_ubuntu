import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import * as api from "../api/index";

// 📘 1. Barcha kanallarni olish
export const useAllChannels = (
  options?: UseQueryOptions<Record<string, any>[], Error>
) => {
  return useQuery({
    queryKey: ["channels", "all"],
    queryFn: api.getAllChannels,
    ...options,
  });
};

// 📘 2. Yangi kanal yaratish
export const useCreateChannel = (options?: any) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => api.createChannel(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels", "all"] });
    },
    ...options,
  });
};

// 📘 3. Kanalni yangilash
export const useUpdateChannel = (options?: any) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.updateChannel(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels", "all"] });
    },
    ...options,
  });
};

// 📘 4. Kanalni o‘chirish
export const useRemoveChannel = (options?: any) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.removeChannel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["channels", "all"] });
    },
    ...options,
  });
};
