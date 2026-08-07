// src/features/channels/index.ts

// === API functions ===
export {
  createChannel,
  getAllChannels,
  getOneChannel,
  removeChannel,
  updateChannel,
} from './api';

// === Hooks ===
export {
  useAllChannels,
  useCreateChannel,
  useRemoveChannel,
  useUpdateChannel,
} from './hooks/useChannels';

// === Types ===
export type { Channel } from './types';
