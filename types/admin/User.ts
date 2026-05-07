import { UserRoles } from "@/enums/user-roles.enum";

export interface User {
  userId: number;
  name: string;
  email: string;
  role: UserRoles;
}
