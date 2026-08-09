export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobSeniority {
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JobType.FULL_TIME]: 'Tiempo completo',
  [JobType.PART_TIME]: 'Medio tiempo',
  [JobType.CONTRACT]: 'Contrato',
  [JobType.INTERNSHIP]: 'Pasantía',
};

export const JOB_SENIORITY_LABELS: Record<JobSeniority, string> = {
  [JobSeniority.JUNIOR]: 'Junior',
  [JobSeniority.MID]: 'Mid',
  [JobSeniority.SENIOR]: 'Senior',
  [JobSeniority.LEAD]: 'Lead',
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.DRAFT]: 'Borrador',
  [JobStatus.PUBLISHED]: 'Publicada',
  [JobStatus.CLOSED]: 'Cerrada',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Pendiente',
  [ApplicationStatus.REVIEWING]: 'En revisión',
  [ApplicationStatus.REJECTED]: 'Rechazada',
  [ApplicationStatus.ACCEPTED]: 'Aceptada',
};
