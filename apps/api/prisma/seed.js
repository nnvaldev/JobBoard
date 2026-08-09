"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
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
            role: client_1.UserRole.EMPLOYER,
            passwordHash,
        },
    });
    const candidate = await prisma.user.create({
        data: {
            email: 'candidato@demo.com',
            name: 'Carlos Candidato',
            role: client_1.UserRole.CANDIDATE,
            passwordHash,
        },
    });
    const company = await prisma.company.create({
        data: {
            name: 'NovaTech Solutions',
            description: 'Empresa de software enfocada en productos digitales para Latinoamérica. Cultura remota-first y stack moderno.',
            website: 'https://novatech.example.com',
            ownerId: employer.id,
        },
    });
    const jobs = await Promise.all([
        prisma.job.create({
            data: {
                title: 'Desarrollador Full Stack',
                description: 'Buscamos un desarrollador full stack para construir productos web con Next.js y NestJS. Trabajarás en features de punta a punta, code reviews y mejoras de performance.\n\nRequisitos:\n- Experiencia con TypeScript\n- Conocimiento de React y APIs REST\n- Git y trabajo en equipo',
                location: 'Buenos Aires, AR',
                type: client_1.JobType.FULL_TIME,
                seniority: client_1.JobSeniority.MID,
                salaryMin: 1800,
                salaryMax: 2800,
                isRemote: true,
                status: client_1.JobStatus.PUBLISHED,
                companyId: company.id,
            },
        }),
        prisma.job.create({
            data: {
                title: 'Frontend Engineer (React)',
                description: 'Únete al equipo de producto para diseñar interfaces accesibles y rápidas. Colaborarás con diseño y backend en un ciclo de entrega continuo.',
                location: 'Ciudad de México, MX',
                type: client_1.JobType.FULL_TIME,
                seniority: client_1.JobSeniority.SENIOR,
                salaryMin: 2500,
                salaryMax: 3800,
                isRemote: true,
                status: client_1.JobStatus.PUBLISHED,
                companyId: company.id,
            },
        }),
        prisma.job.create({
            data: {
                title: 'Backend NestJS Junior',
                description: 'Oportunidad para juniors con ganas de crecer en backends con NestJS, PostgreSQL y buenas prácticas de API.',
                location: 'Remoto LATAM',
                type: client_1.JobType.FULL_TIME,
                seniority: client_1.JobSeniority.JUNIOR,
                salaryMin: 900,
                salaryMax: 1400,
                isRemote: true,
                status: client_1.JobStatus.PUBLISHED,
                companyId: company.id,
            },
        }),
        prisma.job.create({
            data: {
                title: 'Pasantía QA Automation',
                description: 'Pasantía de 6 meses para aprender testing automatizado con Playwright y CI. Ideal para estudiantes de últimos años.',
                location: 'Lima, PE',
                type: client_1.JobType.INTERNSHIP,
                seniority: client_1.JobSeniority.JUNIOR,
                isRemote: false,
                status: client_1.JobStatus.PUBLISHED,
                companyId: company.id,
            },
        }),
        prisma.job.create({
            data: {
                title: 'Tech Lead (borrador)',
                description: 'Borrador interno — aún no publicar.',
                location: 'Remoto',
                type: client_1.JobType.FULL_TIME,
                seniority: client_1.JobSeniority.LEAD,
                isRemote: true,
                status: client_1.JobStatus.DRAFT,
                companyId: company.id,
            },
        }),
    ]);
    await prisma.application.create({
        data: {
            jobId: jobs[0].id,
            candidateId: candidate.id,
            coverLetter: 'Hola, soy Carlos. Tengo experiencia con Next y Nest y me entusiasma el producto de NovaTech. Adjunto mi motivación para el rol full stack.',
            status: client_1.ApplicationStatus.PENDING,
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
//# sourceMappingURL=seed.js.map