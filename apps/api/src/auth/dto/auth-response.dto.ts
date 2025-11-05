import { Type } from 'class-transformer';

import { UserDto } from '@/user/dto/user.dto';

export class AuthResponseDto {
  accessToken!: string;
  accessTokenExpiresAt!: Date;
  tokenType!: 'Bearer';
  refreshToken!: string;
  refreshTokenExpiresAt!: Date;

  @Type(() => UserDto)
  user!: UserDto;
}
