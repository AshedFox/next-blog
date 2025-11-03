import { Type } from 'class-transformer';

import { UserDto } from '@/user/dto/user.dto';

export class AuthResponseDto {
  accessToken!: string;
  tokenType!: 'Bearer';
  expiresIn!: number;

  @Type(() => UserDto)
  user!: UserDto;
}
