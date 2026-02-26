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
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper
  ) {}

  @Get('me')
  @ZodResponse({ type: UserDto })
  async getMe(
    @CurrentUser('id') userId: string,
    @Query() query: UserGetOneDto
  ) {
    return this.userMapper.map(
      await this.userService.getOneById(userId, undefined, query)
    );
  }

  @Patch('me')
  @ZodResponse({ type: UserDto })
  async patchMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userMapper.map(
      await this.userService.update(userId, updateUserDto)
    );
  }

  @Post('me/recover')
  @ZodResponse({ type: UserDto, status: 200 })
  async recoverMe(@CurrentUser('id') userId: string) {
    return this.userMapper.map(await this.userService.restore(userId));
  }

  @Delete('me')
  @ZodResponse({ type: UserDto })
  async deleteMe(@CurrentUser('id') userId: string) {
    return this.userMapper.map(await this.userService.softDelete(userId));
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
      return this.userMapper.map(
        await this.userService.getOneById(idOrUsername, undefined, query)
      );
    } else {
      return this.userMapper.map(
        await this.userService.getOneByUsername(idOrUsername, query)
      );
    }
  }

  @MinRole(UserRole.ADMIN)
  @Patch(':id')
  @ZodResponse({ type: UserDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userMapper.map(
      await this.userService.update(id, updateUserDto)
    );
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/restore')
  @ZodResponse({ type: UserDto, status: 200 })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userMapper.map(await this.userService.restore(id));
  }

  @MinRole(UserRole.ADMIN)
  @Delete(':id')
  @ZodResponse({ type: UserDto })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userMapper.map(await this.userService.softDelete(id));
  }
}
