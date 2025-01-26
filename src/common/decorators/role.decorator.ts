import { SetMetadata } from "@nestjs/common";
import { Roles } from "src/modules/auth/enums/role.enum";

export const ROLE_KEY = "ROLES";
export const CanAccess = (...roles: Roles[]) =>  SetMetadata(ROLE_KEY, roles)