import { UserRole } from "@prisma/client";

export type UserFromJwt = {
  id: number;
  email: string;
  role: UserRole;
};