import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/guards/AuthGuard";
// import { RoleGuard } from "src/modules/auth/guards/role.guard";

export function AuthDecorator() {
    return applyDecorators(
        UseGuards(AuthGuard)
    )
}