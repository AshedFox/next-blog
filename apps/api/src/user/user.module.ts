import { Module } from '@nestjs/common';

import { HashModule } from '@/hash/hash.module';
import { UsernameGeneratorModule } from '@/username-generator/username-generator.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UsernameGeneratorModule, HashModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
