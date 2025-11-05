import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  async verify(digest: string, password: string): Promise<boolean> {
    return argon2.verify(digest, password);
  }

  hashHMAC(token: string, secret: string) {
    return crypto.createHmac('sha256', secret).update(token).digest('hex');
  }
}
