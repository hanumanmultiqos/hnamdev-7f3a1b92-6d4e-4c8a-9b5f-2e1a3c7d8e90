import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('assign-list')
  async getAssignableUsers(@Req() req: any) {
    const user: UserPayload = req.user;
    return this.usersService.getAssignableUsers(user);
  }
}