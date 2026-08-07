import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as allApi from '../api/getAllGroups';
import * as createApi from '../api/createGroup';
import * as oneApi from '../api/getOneGroup';

// === 1. Foydalanuvchiga tegishli barcha gruppalarni olish ===
export const useGroupsByOwner = (
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['groupes', 'owner'],
    queryFn: allApi.getAllGroupsByOwner,
    ...options,
  });

// === 2. Yangi gruppa yaratish ===
export const useCreateGroup = (
  options?: UseMutationOptions<any, Error, any>
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createApi.createGroup(payload),
    onSuccess: () => {
      // Yaratilgandan keyin cache ni yangilash
      qc.invalidateQueries({ queryKey: ['groupes', 'owner'] });
    },
    ...options,
  });
};

// === 3. Bitta gruppa ma’lumotini olish ===
export const useOneGroup = (
  id?: string,
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['group', id],
    queryFn: () => oneApi.getOneGroup(id as string),
    enabled: !!id, // faqat id mavjud bo‘lsa so‘rov yuboriladi
    ...options,
  });


// === 3. Bitta gruppa ma’lumotini olish ===
export const useAllGroup = (
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['allgroupes', "all"],
    queryFn: () => allApi.getAllGroupes(),
    ...options,
  });
