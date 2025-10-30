import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class JwtFactory implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createJwtOptions(): Promise<JwtModuleOptions> {
    const publicKey = await readFile(
      join(
        __dirname,
        '../../',
        this.configService.getOrThrow('ACCESS_TOKEN_PUBLIC_KEY_PATH')
      ),
      'utf8'
    );
    const privateKey = await readFile(
      join(
        __dirname,
        '../../',
        this.configService.getOrThrow('ACCESS_TOKEN_PRIVATE_KEY_PATH')
      ),
      'utf8'
    );

    return {
      publicKey,
      privateKey,
      signOptions: {
        algorithm: 'ES256',
        expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_LIFETIME'),
      },
    };
  }
}
