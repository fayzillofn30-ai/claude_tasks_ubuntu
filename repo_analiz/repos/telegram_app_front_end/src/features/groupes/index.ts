// src/features/groupes/index.ts

// === API functions ===
export {
  createGroup,
} from './api/createGroup';

export {
  getAllGroupes,
  getAllGroupsByOwner,
} from './api/getAllGroups';

export {
  getOneGroup,
} from './api/getOneGroup';

// === Hooks ===
export {
  useCreateGroup,
  useGroupsByOwner,
  useOneGroup,
  useAllGroup
} from './hooks/useGroups';

export {type Groupe} from "./types"