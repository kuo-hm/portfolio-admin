import { IsString, Length, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
} 