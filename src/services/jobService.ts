import axios from "axios";

interface JobData {
  jobTitle: string;
  department: string;
  client: string;
  jobPosition: string;
  location: string;
  headcount: number;
  stage: string;
  minimumSalary: number;
  maximumSalary: number;
  jobType: string;
  experience: string;
  salaryRange: {
    min: number;
    max: number;
  };
}

// Define an interface for the job response
export interface JobResponse {
  _id: string;
  jobTitle: string;
  department: string;
  client: {
    _id: string;
    name: string;
  };
  jobPosition: string;
  location: string;
  headcount: number;
  stage: string;
  minimumSalary: number;
  maximumSalary: number;
  jobType: string;
  experience: string;
  salaryRange: {
    min: number;
    max: number;
  };
  createdAt: string;
}

const createJob = async (jobData: JobData) => {
  try {
    const response = await axios.post("https://aems-backend.onrender.com/api/jobs", jobData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error creating job: ${errorMessage}`);
    }
    throw new Error(`Error creating job: ${error.message}`);
  }
};

const getJobs = async (): Promise<JobResponse[]> => {
  try {
    const response = await axios.get("https://aems-backend.onrender.com/api/jobs");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error fetching jobs: ${errorMessage}`);
    }
    throw new Error(`Error fetching jobs: ${error.message}`);
  }
};

const getJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await axios.get(`https://aems-backend.onrender.com/api/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error fetching job: ${errorMessage}`);
    }
    throw new Error(`Error fetching job: ${error.message}`);
  }
};

const updateJobById = async (id: string, jobData: JobData) => {
  try {
    const response = await axios.patch(`https://aems-backend.onrender.com/api/jobs/${id}`, jobData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error updating job: ${errorMessage}`);
    }
    throw new Error(`Error updating job: ${error.message}`);
  }
};

const deleteJobById = async (id: string) => {
  try {
    const response = await axios.delete(`https://aems-backend.onrender.com/api/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error deleting job: ${errorMessage}`);
    }
    throw new Error(`Error deleting job: ${error.message}`);
  }
};

export { createJob, getJobs, getJobById, updateJobById, deleteJobById };