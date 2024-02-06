import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() authDto: AuthDTO) {
    return await this.authService.register(authDto)
  }
}
