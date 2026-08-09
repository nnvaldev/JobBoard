import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getMine(ownerId: string) {
    return this.prisma.company.findUnique({
      where: { ownerId },
      include: {
        _count: { select: { jobs: true } },
      },
    });
  }

  async upsert(ownerId: string, dto: UpsertCompanyDto) {
    const existing = await this.prisma.company.findUnique({
      where: { ownerId },
    });

    if (existing) {
      return this.prisma.company.update({
        where: { ownerId },
        data: {
          name: dto.name,
          description: dto.description,
          website: dto.website,
        },
      });
    }

    return this.prisma.company.create({
      data: {
        name: dto.name,
        description: dto.description,
        website: dto.website,
        ownerId,
      },
    });
  }

  async assertOwnedBy(companyId: string, ownerId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Compañía no encontrada');
    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('No eres dueño de esta compañía');
    }
    return company;
  }

  async requireMine(ownerId: string) {
    const company = await this.getMine(ownerId);
    if (!company) {
      throw new ConflictException(
        'Primero debes crear el perfil de tu compañía',
      );
    }
    return company;
  }
}
