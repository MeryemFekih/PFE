  import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateUserDto } from '../user/dto/create-user.dto';
  import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
  import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
  import { Public } from './decorators/public.decorator';
  import { Roles } from './decorators/roles.decorator';
  import { ForgotPasswordDto } from './dto/forgot-password.dto';
  import {  ResetPasswordDto } from './dto/reset-password.dto';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Public()
    @Post('signup')
    registerUser(@Body() createUserDto: CreateUserDto) {
      console.log('Received signup data:', createUserDto);
      return this.authService.registerUser(createUserDto);
    }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    login(@Request() req) {
      return this.authService.login(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        req.user.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        req.user.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        req.user.firstName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        req.user.role,
      );
    }
    @Roles('ALUMNI', 'ADMIN', 'STUDENT')
    @Get('protected')
    getAll(@Request() req) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        message: "Now you can access this protected API. this is your user ID:" + req.user.id
      };
    }
    @Public()
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    refreshToken(@Request() req) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      return this.authService.refreshToken(req.user.id, req.user.email);
    }
    @Post('signout')
    signOut(@Req() req) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      return this.authService.signOut(req.user.id);
    }
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    console.log('📩 This should always log.');
  return this.authService.forgotPassword(body.email);}
  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    console.log('📥 Received body in controller:', dto);
    return this.authService.resetPassword(dto);
  }

}