import { Module } from '@nestjs/common';

import { HashModule } from '@/hash/hash.module';
import { UsernameGeneratorModule } from '@/username-generator/username-generator.module';

import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { UserCacheService } from './user-cache.service';

@Module({
  imports: [UsernameGeneratorModule, HashModule],
  controllers: [UserController],
  providers: [UserService, UserCacheService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule {}
