// src/features/profile/index.ts

// === API functions ===
export {
  createProfile,
  deleteProfile,
  getAllProfiles,
  getOneProfile,
  updateProfile,
} from './api';

// === Hooks ===
export {
  useAllProfiles,
  useOneProfile,
  useUpdateProfile,
} from './hooks/useProfile';
