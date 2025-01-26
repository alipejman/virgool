import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.gurad";
import { RoleGuard } from "src/modules/auth/guards/role.guard";

export function authDecorator() {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(AuthGuard, RoleGuard));
}
