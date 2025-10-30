import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@SerializeOptions({ type: UserDto })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUser('id') userId: string): Promise<UserDto> {
    return this.userService.getOneById(userId);
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
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.userService.getOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Post(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.userService.restore(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.userService.softDelete(id);
  }
}
