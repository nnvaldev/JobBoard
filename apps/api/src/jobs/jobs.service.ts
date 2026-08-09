import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateJobDto, JobsQueryDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private companies: CompaniesService,
  ) {}

  async findPublic(query: JobsQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);
    const where: Prisma.JobWhereInput = {
      status: JobStatus.PUBLISHED,
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
              {
                company: {
                  name: { contains: query.q, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
      ...(query.location
        ? { location: { contains: query.location, mode: 'insensitive' } }
        : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.seniority ? { seniority: query.seniority } : {}),
      ...(typeof query.isRemote === 'boolean'
        ? { isRemote: query.isRemote }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          company: {
            select: { id: true, name: true, website: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOnePublic(id: string) {
    const job = await this.prisma.job.findFirst({
      where: { id, status: JobStatus.PUBLISHED },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
          },
        },
      },
    });
    if (!job) throw new NotFoundException('Oferta no encontrada');
    return job;
  }

  async findMine(ownerId: string) {
    const company = await this.companies.requireMine(ownerId);
    return this.prisma.job.findMany({
      where: { companyId: company.id },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForOwner(id: string, ownerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
    });
    if (!job) throw new NotFoundException('Oferta no encontrada');
    if (job.company.ownerId !== ownerId) {
      throw new ForbiddenException('No puedes acceder a esta oferta');
    }
    return job;
  }

  async create(ownerId: string, dto: CreateJobDto) {
    const company = await this.companies.requireMine(ownerId);
    return this.prisma.job.create({
      data: {
        ...dto,
        status: dto.status ?? JobStatus.DRAFT,
        companyId: company.id,
      },
      include: {
        company: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateJobDto) {
    await this.findOneForOwner(id, ownerId);
    return this.prisma.job.update({
      where: { id },
      data: dto,
      include: {
        company: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOneForOwner(id, ownerId);
    await this.prisma.job.delete({ where: { id } });
    return { ok: true };
  }
}
