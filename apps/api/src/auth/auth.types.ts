import { AuthResponseDto } from './dto/auth-response.dto';

export type AuthResult = AuthResponseDto & {
  refreshToken: string;
};

export type TokenPayload = {
  sub: string;
};
