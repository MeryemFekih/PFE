import { ExecutionContext, Injectable } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return result;
    } else if (result instanceof Observable) {
      return lastValueFrom(result);
    }
    console.log('🔍 isPublic =', isPublic, 'for', context.getHandler().name);
    return result;
  }
}