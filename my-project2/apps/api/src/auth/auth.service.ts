import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ConflictException } from '@nestjs/common'; // Make sure to import ConflictException
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(createUserDto: CreateUserDto) {
    // Make the method async
    const user = await this.userService.findByEmail(createUserDto.email); // Await the result here
    if (user) {
      throw new ConflictException('User already exists'); // Correct usage of ConflictException
    }
    return this.userService.create(createUserDto); // Create the user if not found
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('user not found!');
    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials!');
    return {id : user.id , email: user.email};
  }
}
