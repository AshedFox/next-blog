import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { HashModule } from '@/hash/hash.module';
import { RefreshTokenModule } from '@/refesh-token/refresh-token.module';
import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtFactory } from './jwt.factory';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtFactory,
    }),
    HashModule,
    RefreshTokenModule,
    UserModule,
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
