import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import * as api from '../api';

// === 1. Avatar yuklash ===
export const useUploadAvatar = (
  options?: UseMutationOptions<any, Error, FormData>
) =>
  useMutation({
    mutationFn: (fd: FormData) => api.uploadAvatar(fd),
    ...options,
  });

// === 2. Rasmni olish ===
export const useGetImage = (
  file?: string,
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['file', 'image', file],
    queryFn: () => api.getImage(file as string),
    enabled: !!file, // faqat file mavjud bo‘lsa ishlaydi
    ...options,
  });
