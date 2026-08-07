import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '../api';

// === 1. Mening channel obunalarimni olish ===
export const useMyChannelSubscriptions = (
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['channel_subs', 'me'],
    queryFn: api.getMyChannelSubscriptions,
    ...options,
  });

// === 2. Channel obunasini yaratish ===
export const useCreateChannelSubscription = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => api.createChannelSubscription(chatId),
    onSuccess: () => {
      // Yangi obuna yaratilganda cache yangilanadi
      qc.invalidateQueries({ queryKey: ['channel_subs', 'me'] });
    },
    ...options,
  });
};
