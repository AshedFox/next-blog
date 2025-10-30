import { Module } from '@nestjs/common';

import { HashModule } from '@/hash/hash.module';

import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [HashModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
