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
  SerializeOptions,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { MinRole } from '@/auth/decorators/min-role.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserGetOneDto } from './dto/user-get-one.dto';
import { UserService } from './user.service';

@SerializeOptions({ type: UserDto })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(
    @CurrentUser('id') userId: string,
    @Query() query: UserGetOneDto
  ): Promise<UserDto> {
    return this.userService.getOneById(userId, undefined, query.include);
  }

  @Patch('me')
  patchMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Post('me/recover')
  recoverMe(@CurrentUser('id') userId: string): Promise<UserDto> {
    return this.userService.restore(userId);
  }

  @Delete('me')
  deleteMe(@CurrentUser('id') userId: string): Promise<UserDto> {
    return this.userService.softDelete(userId);
  }

  @Get(':id')
  getOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: UserGetOneDto
  ): Promise<UserDto> {
    return this.userService.getOneById(id, undefined, query.include);
  }

  @MinRole(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.userService.restore(id);
  }

  @MinRole(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.userService.softDelete(id);
  }
}
