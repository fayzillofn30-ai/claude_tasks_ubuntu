"use client"

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as api from '../api/getAllUsers';
import * as myApi from '../api/getMyUser';
import * as privateApi from '../api/getPrivateUser';
import { Socket } from 'socket.io-client';
import { useEffect } from 'react'

// === 1. Barcha foydalanuvchilarni olish + socket events ===
export const useAllUsers = (
  socket: Socket,
  options?: UseQueryOptions<any, Error>
) => {
  const queryClient = useQueryClient()


  const query = useQuery({
    queryKey: ['users', 'all'],
    queryFn: api.getAllUsers,
    ...options,
  })

  useEffect(() => {
    if (!socket) return

    const refetchUsers = () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] })
    }

    socket.on('create-user', refetchUsers)
    socket.on('delete-user', refetchUsers)
    socket.on('update-user', refetchUsers)

    return () => {
      socket.off('create-user', refetchUsers)
      socket.off('delete-user', refetchUsers)
      socket.off('update-user', refetchUsers)
    }
  }, [socket, queryClient])

  return query
}

// === 2. Mening foydalanuvchi ma’lumotimni olish ===
export const useMyUser = (options?: UseQueryOptions<any, Error>) =>
  useQuery({
    queryKey: ['users', 'me'],
    queryFn: myApi.getMyUser,
    ...options,
  });

// === 3. Maxfiy (private) foydalanuvchini olish ===
export const usePrivateUser = (
  userId?: string,
  options?: UseQueryOptions<any, Error>
) =>
  useQuery({
    queryKey: ['users', userId],
    queryFn: () => privateApi.getPrivateUser(userId as string),
    enabled: !!userId,
    ...options,
  });
