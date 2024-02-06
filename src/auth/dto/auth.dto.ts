import {
    IsBoolean,
    IsNotEmpty,
    IsEmail,
    IsString,
    IsOptional,
  } from 'class-validator';
  
  export class AuthDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @IsOptional()
    @IsString()
    lastName: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsOptional()
    @IsString()
    last_logged_in?: string;
  
    @IsOptional()
    @IsBoolean()
    active?: boolean;
  
    @IsOptional()
    @IsString()
    role?: any;
  
    @IsOptional()
    @IsString()
    number: string;
  }
  
  export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  
  