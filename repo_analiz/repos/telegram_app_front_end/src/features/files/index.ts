// src/features/files/index.ts

// === API functions ===
export {
  getArchive,
  getDocs,
  getImage,
  getVideo,
  uploadAvatar,
} from './api';

// === Hooks ===
export {
  useGetImage,
  useUploadAvatar,
} from './hooks/useFiles';
