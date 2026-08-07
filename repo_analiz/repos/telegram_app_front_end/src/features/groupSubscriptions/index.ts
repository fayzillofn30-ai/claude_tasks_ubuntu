// src/features/groupSubscriptions/index.ts

// === API functions ===
export {
  createGroupSubscription,
  getChatGroupSubscriptions,
  getMyGroupSubscriptions,
  removeGroupSubscription,
} from './api';

// === Hooks ===
export {
  useCreateGroupSubscription,
  useMyGroupSubscriptions,
} from './hooks/useGroupSubscriptions';
