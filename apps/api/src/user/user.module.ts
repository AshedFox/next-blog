import { Module } from '@nestjs/common';

import { HashModule } from '@/hash/hash.module';
import { UsernameGeneratorModule } from '@/username-generator/username-generator.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCacheService } from './user-cache.service';

@Module({
  imports: [UsernameGeneratorModule, HashModule],
  controllers: [UserController],
  providers: [UserService, UserCacheService],
  exports: [UserService],
})
export class UserModule {}
