import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import * as api from '../api';

// === 1. Barcha profillarni olish ===
export const useAllProfiles = (
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['profiles', 'all'],
    queryFn: api.getAllProfiles,
    ...options,
  });

// === 2. Bitta profilni olish ===
export const useOneProfile = (
  id?: string,
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['profiles', id],
    queryFn: () => api.getOneProfile(id as string),
    enabled: !!id, // faqat id bo‘lsa so‘rov yuboriladi
    ...options,
  });

// === 3. Profilni yangilash ===
export const useUpdateProfile = (
  options?: UseMutationOptions<any, Error, { id: string; payload: any }>
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => api.updateProfile(id, payload),
    onSuccess: () => {
      // Profil yangilanganidan so‘ng barcha profillar cache-ni yangilash
      qc.invalidateQueries({ queryKey: ['profiles', 'all'] });
    },
    ...options,
  });
};
