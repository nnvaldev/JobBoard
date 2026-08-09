import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertCompanyDto {
  @ApiProperty({ example: 'NovaTech Solutions' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://novatech.example.com' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  website?: string;
}
