import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(jobId: string, candidateId: string, dto: CreateApplicationDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Oferta no disponible');
    }

    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_candidateId: { jobId, candidateId },
      },
    });
    if (existing) {
      throw new ConflictException('Ya te postulaste a esta oferta');
    }

    return this.prisma.application.create({
      data: {
        jobId,
        candidateId,
        coverLetter: dto.coverLetter,
        status: ApplicationStatus.PENDING,
      },
      include: {
        job: {
          include: {
            company: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findMine(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            company: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJob(jobId: string, ownerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });
    if (!job) throw new NotFoundException('Oferta no encontrada');
    if (job.company.ownerId !== ownerId) {
      throw new ForbiddenException('No puedes ver estas postulaciones');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    ownerId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
      },
    });
    if (!application) {
      throw new NotFoundException('Postulación no encontrada');
    }
    if (application.job.company.ownerId !== ownerId) {
      throw new ForbiddenException('No puedes actualizar esta postulación');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: dto.status },
      include: {
        candidate: {
          select: { id: true, name: true, email: true },
        },
        job: { select: { id: true, title: true } },
      },
    });
  }
}
