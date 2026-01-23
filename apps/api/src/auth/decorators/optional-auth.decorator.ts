import { SetMetadata } from '@nestjs/common';

export const OPTIONAL_AUTH_KEY = Symbol('OPTIONAL_AUTH_KEY');

export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
