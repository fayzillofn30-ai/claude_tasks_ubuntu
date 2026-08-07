import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '../api';

// === 1. Mening guruh obunalarimni olish ===
export const useMyGroupSubscriptions = (
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['group_subs', 'me'],
    queryFn: api.getMyGroupSubscriptions,
    ...options,
  });

// === 2. Guruh obunasini yaratish ===
export const useCreateGroupSubscription = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => api.createGroupSubscription(chatId),
    onSuccess: () => {
      // Yangi obuna yaratilganda cache yangilanadi
      qc.invalidateQueries({ queryKey: ['group_subs', 'me'] });
    },
    ...options,
  });
};
