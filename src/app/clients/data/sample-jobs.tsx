import { Job, JobStatus } from "@/types/job"; // Update this path to the correct path if necessary
import { getJobs } from "@/services/jobService"; // Ensure this path is correct or create the module if it doesn't exist
let sampleJobs: Job[] = [];

const fetchJobs = async (): Promise<Job[]> => {
  try {
    const jobs = await getJobs();
    console.log('API Response:', jobs);
    sampleJobs = jobs.map((job: any) => ({
      id: job._id,
      positionName: job.jobTitle,
      client: job.client,
      location: job.location,
      headcount: job.headcount.toString(),
      stage: job.stage as Job['stage'],
      minSalary: Number(job.minimumSalary),
      maxSalary: Number(job.maximumSalary),
      status: job.status || JobStatus.OPEN,
      department: job.department
    }));
    console.log('Mapped Jobs:', sampleJobs);
    return sampleJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

const getSampleJobs = async (): Promise<Job[]> => {
  return await fetchJobs();
};

export { getSampleJobs };
