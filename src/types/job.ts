export enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold'
}

export type JobStage = 'New' | 'Sourcing' | 'Screening' | 'Interviewing' | 'Shortlisted' | 'Offer' | 'Hired' | 'On Hold' | 'Cancelled';



export interface Job {
  id: string;
  positionName: string;
  client: string;
  location: string;
  headcount: string;
  stage: JobStage;
  status: JobStatus;
  jobStatus?: JobStatus; // Optional legacy field for backward compatibility
  minSalary?: number;
  maxSalary?: number;
  department: string;
}
