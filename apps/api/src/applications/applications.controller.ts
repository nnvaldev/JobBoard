import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private applications: ApplicationsService) {}

  @Roles(UserRole.CANDIDATE)
  @Post('jobs/:id/applications')
  apply(
    @Param('id') jobId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applications.apply(jobId, user.id, dto);
  }

  @Roles(UserRole.CANDIDATE)
  @Get('applications/me')
  findMine(@CurrentUser() user: AuthUser) {
    return this.applications.findMine(user.id);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @Get('jobs/:id/applications')
  findByJob(@Param('id') jobId: string, @CurrentUser() user: AuthUser) {
    return this.applications.findByJob(jobId, user.id);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @Patch('applications/:id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applications.updateStatus(id, user.id, dto);
  }
}
