import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ConflictException } from '@nestjs/common'; // Make sure to import ConflictException

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
}
