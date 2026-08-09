import { PrismaClient, UserRole, JobType, JobSeniority, JobStatus, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 10);

  const employer = await prisma.user.create({
    data: {
      email: 'empresa@demo.com',
      name: 'Ana Empresa',
      role: UserRole.EMPLOYER,
      passwordHash,
    },
  });

  const candidate = await prisma.user.create({
    data: {
      email: 'candidato@demo.com',
      name: 'Carlos Candidato',
      role: UserRole.CANDIDATE,
      passwordHash,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: 'NovaTech Solutions',
      description:
        'Empresa de software enfocada en productos digitales para Latinoamérica. Cultura remota-first y stack moderno.',
      website: 'https://novatech.example.com',
      ownerId: employer.id,
    },
  });

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Desarrollador Full Stack',
        description:
          'Buscamos un desarrollador full stack para construir productos web con Next.js y NestJS. Trabajarás en features de punta a punta, code reviews y mejoras de performance.\n\nRequisitos:\n- Experiencia con TypeScript\n- Conocimiento de React y APIs REST\n- Git y trabajo en equipo',
        location: 'Buenos Aires, AR',
        type: JobType.FULL_TIME,
        seniority: JobSeniority.MID,
        salaryMin: 1800,
        salaryMax: 2800,
        isRemote: true,
        status: JobStatus.PUBLISHED,
        companyId: company.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Frontend Engineer (React)',
        description:
          'Únete al equipo de producto para diseñar interfaces accesibles y rápidas. Colaborarás con diseño y backend en un ciclo de entrega continuo.',
        location: 'Ciudad de México, MX',
        type: JobType.FULL_TIME,
        seniority: JobSeniority.SENIOR,
        salaryMin: 2500,
        salaryMax: 3800,
        isRemote: true,
        status: JobStatus.PUBLISHED,
        companyId: company.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Backend NestJS Junior',
        description:
          'Oportunidad para juniors con ganas de crecer en backends con NestJS, PostgreSQL y buenas prácticas de API.',
        location: 'Remoto LATAM',
        type: JobType.FULL_TIME,
        seniority: JobSeniority.JUNIOR,
        salaryMin: 900,
        salaryMax: 1400,
        isRemote: true,
        status: JobStatus.PUBLISHED,
        companyId: company.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Pasantía QA Automation',
        description:
          'Pasantía de 6 meses para aprender testing automatizado con Playwright y CI. Ideal para estudiantes de últimos años.',
        location: 'Lima, PE',
        type: JobType.INTERNSHIP,
        seniority: JobSeniority.JUNIOR,
        isRemote: false,
        status: JobStatus.PUBLISHED,
        companyId: company.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Tech Lead (borrador)',
        description: 'Borrador interno — aún no publicar.',
        location: 'Remoto',
        type: JobType.FULL_TIME,
        seniority: JobSeniority.LEAD,
        isRemote: true,
        status: JobStatus.DRAFT,
        companyId: company.id,
      },
    }),
  ]);

  await prisma.application.create({
    data: {
      jobId: jobs[0].id,
      candidateId: candidate.id,
      coverLetter:
        'Hola, soy Carlos. Tengo experiencia con Next y Nest y me entusiasma el producto de NovaTech. Adjunto mi motivación para el rol full stack.',
      status: ApplicationStatus.PENDING,
    },
  });

  console.log('Seed OK');
  console.log('Empresa: empresa@demo.com / demo1234');
  console.log('Candidato: candidato@demo.com / demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
