import { IsString } from 'class-validator';

import { Match } from '@/common/validation/match.decorator';

import { LoginDto } from './login.dto';

export class SignUpDto extends LoginDto {
  @IsString()
  @Match<SignUpDto>('password')
  passwordComparison!: string;
}
