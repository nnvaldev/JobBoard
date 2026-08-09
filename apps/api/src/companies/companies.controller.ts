import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CompaniesService } from './companies.service';
import { UpsertCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYER, UserRole.ADMIN)
@Controller('companies')
export class CompaniesController {
  constructor(private companies: CompaniesService) {}

  @Get('me')
  getMine(@CurrentUser() user: AuthUser) {
    return this.companies.getMine(user.id);
  }

  @Put('me')
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertCompanyDto) {
    return this.companies.upsert(user.id, dto);
  }
}
