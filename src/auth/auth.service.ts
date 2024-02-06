import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthDTO, LoginDTO } from './dto/auth.dto';
import { compare, hashSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) { }

  async login(data: LoginDTO) {
    console.log(data);
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!isEmail) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }

      // if (isEmail && !isEmail.active) {
      //   throw new HttpException('User is not active', HttpStatus.UNAUTHORIZED);
      // }

      const isPasswordMatched = await compare(
        data.password,
        isEmail.password,
      );

      if (!isPasswordMatched) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }

      await this.createToken({
        id: isEmail.id,
        type: isEmail.role,
      });

      return isEmail

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private createToken(data: { id: number; type: string }) {
    const payload = {
      user_id: data.id,
      type: data.type,
    };
    const token = this.jwt.sign(payload);
    return token;
  }

  async register(authDto: AuthDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: authDto.email,
        },
      });
      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      } else {
        let hashPassword;
        let userPassword;
        if (authDto.password == null) {
          hashPassword = authDto.firstName + '_' + authDto.lastName;
          userPassword = authDto.firstName + '_' + authDto.lastName;
        } else {
          hashPassword = hashSync(authDto.password, 10);
          userPassword = authDto.password;
        }
        authDto.password = hashPassword;
        return await this.prisma.user.create({ data: authDto });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

}

