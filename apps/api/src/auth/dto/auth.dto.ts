import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'ana@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ana Pérez' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'demo1234', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: [UserRole.CANDIDATE, UserRole.EMPLOYER] })
  @IsIn([UserRole.CANDIDATE, UserRole.EMPLOYER])
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'candidato@demo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo1234' })
  @IsString()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
