import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ZodResponse } from 'nestjs-zod';
import { z } from 'zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { MinRole } from '@/auth/decorators/min-role.decorator';
import { Public } from '@/auth/decorators/public.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserGetOneDto } from './dto/user-get-one.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ZodResponse({ type: UserDto })
  getMe(@CurrentUser('id') userId: string, @Query() query: UserGetOneDto) {
    return this.userService.getOneById(userId, undefined, query);
  }

  @Patch('me')
  @ZodResponse({ type: UserDto })
  patchMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Post('me/recover')
  @ZodResponse({ type: UserDto, status: 200 })
  recoverMe(@CurrentUser('id') userId: string) {
    return this.userService.restore(userId);
  }

  @Delete('me')
  @ZodResponse({ type: UserDto })
  deleteMe(@CurrentUser('id') userId: string) {
    return this.userService.softDelete(userId);
  }

  @Public()
  @Get(':idOrUsername')
  @ZodResponse({ type: UserDto })
  async getOne(
    @Param('idOrUsername') idOrUsername: string,
    @Query() query: UserGetOneDto
  ) {
    const isId = (await z.uuid().safeParseAsync(idOrUsername)).success;

    if (isId) {
      return this.userService.getOneById(idOrUsername, undefined, query);
    } else {
      return this.userService.getOneByUsername(idOrUsername, query);
    }
  }

  @MinRole(UserRole.ADMIN)
  @Patch(':id')
  @ZodResponse({ type: UserDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/restore')
  @ZodResponse({ type: UserDto, status: 200 })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.restore(id);
  }

  @MinRole(UserRole.ADMIN)
  @Delete(':id')
  @ZodResponse({ type: UserDto })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.softDelete(id);
  }
}
