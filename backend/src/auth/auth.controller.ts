import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service'; // ✅ Add this
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signup')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  registerUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Received signup data:', createUserDto);
    if (file) {
      createUserDto.profilePicture = `/profile-pictures/${file.filename}`;
    }
    return this.authService.registerUser(createUserDto);
  }

 @Post('signin')
@UseGuards(LocalAuthGuard)
@Public()
async login(@Request() req) {
  const result = await this.authService.login(
    req.user.id,
    req.user.email,
    req.user.firstName,
    req.user.role,
  );
  console.log("✅ Returning result:", result); // Add this to confirm
  return result; // ✅ This is mandatory
}



  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.refreshToken(req.user.id, req.user.email);
  }
  @Post('signout')
  signOut(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.signOut(req.user.id);
  }
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    console.log('📩 This should always log.');
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    console.log('📥 Received body in controller:', dto);
    return this.authService.resetPassword(dto);
  }
}
