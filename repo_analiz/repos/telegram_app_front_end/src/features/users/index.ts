// src/features/users/index.ts

// === API functions ===
export {
  getAllUsers,
} from './api/getAllUsers';
export {
getMyUser
} from "./api/getMyUser"
export {getPrivateUser} from "./api/getPrivateUser"

// === Hooks ===
export {
  useAllUsers,
  useMyUser,
  usePrivateUser,
} from './hooks/useUsers';

// === Types ===
export type { User } from './types';
