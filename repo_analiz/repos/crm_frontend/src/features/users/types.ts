export type UserFlat = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  image?: string | null;
  birthDay?: string | null;
  isDeleted: boolean;
  createdAt?: string;
  staff?: { id: string; role: string; isDeleted: boolean } | null;
};
