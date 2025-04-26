import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector(); // Provide required dependency
    const guard = new JwtAuthGuard(reflector);
    expect(guard).toBeDefined();
  });
});
