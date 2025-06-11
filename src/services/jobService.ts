import axios from "axios";

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface WorkVisa {
  workVisa: string;
  visaCountries: string[];
}

export interface JobData {
  jobTitle: string;
  jobPosition?: string[];
  department?: string;
  client: string | ClientRef;
  location?: string[];
  headcount?: number;
  stage?: string;
  workVisa?: WorkVisa;
  minimumSalary?: number;
  maximumSalary?: number;
  salaryCurrency?: string;
  salaryRange?: SalaryRange;
  jobType: string;
  experience: string;
  education?: string[];
  specialization?: string[];
  certifications?: string[];
  benefits?: string[];
  jobDescription?: string;
  jobDescriptionPdf?: string;
  nationalities?: string[];
  gender?: string;
  deadlineclient?: string | Date | null;
  deadlineinternal?: string | Date | null;
  reportingTo?: string;
  teamSize?: number;
  link?: string;
  keySkills?: string;
  numberOfPositions?: number;
}

export interface ClientRef {
  _id: string;
  name: string;
}

export interface Job extends JobData {
  _id:string;
  client: ClientRef;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface JobResponse {
  success: boolean;
  data?: Job | Job[];
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface PaginatedJobResponse extends JobResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
}

const API_URL = "https://aems-backend.onrender.com/api";

// Utility function to handle API errors consistently
const handleApiError = (error: any, context: string) => {
  if (error.response) {
    const status = error.response.status;
    const errorMessage = error.response.data?.message || 'Unknown error occurred';
    
    console.error(`API Error (${context}):`, {
      status,
      message: errorMessage,
      url: error.config.url,
      data: error.response.data
    });

    throw new Error(`${context} failed: ${errorMessage} (Status: ${status})`);
  } else if (error.request) {
    console.error(`Network Error (${context}):`, error.request);
    throw new Error(`Network error during ${context}: No response received`);
  } else {
    console.error(`Request Setup Error (${context}):`, error.message);
    throw new Error(`Error setting up ${context} request: ${error.message}`);
  }
};

// Process job data before sending to API
const processJobData = (jobData: JobData | Partial<JobData>) => {
  const dataToSend = { ...jobData };

  // Ensure client is just the ID string before sending
  if (dataToSend.client && typeof dataToSend.client === 'object' && (dataToSend.client as ClientRef)._id) {
    dataToSend.client = (dataToSend.client as ClientRef)._id;
  }

  return {
    ...dataToSend,
    deadlineclient: dataToSend.deadlineclient ? new Date(dataToSend.deadlineclient).toISOString() : null,
    deadlineinternal: dataToSend.deadlineinternal ? new Date(dataToSend.deadlineinternal).toISOString() : null,
    jobType: dataToSend.jobType?.toLowerCase(),
    gender: dataToSend.gender?.toLowerCase(),
    salaryRange: dataToSend.salaryRange || (dataToSend.minimumSalary !== undefined || dataToSend.maximumSalary !== undefined ? {
      min: dataToSend.minimumSalary || 0,
      max: dataToSend.maximumSalary || 0,
      currency: dataToSend.salaryCurrency || 'SAR'
    } : undefined)
  };
};

const createJob = async (jobData: JobData): Promise<JobResponse> => {
  try {
    const processedData = processJobData(jobData);
    const response = await axios.post<JobResponse>(`${API_URL}/jobs`, processedData);
    
    console.log('Job created successfully:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job creation');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

const getJobs = async (
  params?: {
    stage?: string;
    jobType?: string;
    location?: string;
    client?: string;
    minSalary?: number;
    maxSalary?: number;
    currency?: string;
    gender?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }
): Promise<PaginatedJobResponse> => {
  try {
    // Process query parameters
    const processedParams = {
      ...params,
      ...(params?.jobType && { jobType: params.jobType.toLowerCase() }),
      ...(params?.gender && { gender: params.gender.toLowerCase() })
    };

    const response = await axios.get<PaginatedJobResponse>(`${API_URL}/jobs`, {
      params: processedParams
    });

    return response.data;
  } catch (error) {
    handleApiError(error, 'jobs fetching');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

const getJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await axios.get<JobResponse>(`${API_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Job not found');
    }
    handleApiError(error, 'job fetching');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

const updateJobById = async (id: string, jobData: Partial<JobData>): Promise<JobResponse> => {
  try {
    const processedData = processJobData(jobData);
    const response = await axios.put<JobResponse>(`${API_URL}/jobs/${id}`, processedData);
    
    console.log('Job updated successfully:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job update');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

const deleteJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await axios.delete<JobResponse>(`${API_URL}/jobs/${id}`);
    console.log('Job deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'job deletion');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

// New function to get job counts by client
const getJobCountsByClient = async (): Promise<{_id: string, count: number}[]> => {
  try {
    const response = await axios.get<{data: {_id: string, count: number}[]}>(
      `${API_URL}/jobs/clients/count`
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'fetching job counts by client');
    throw error; // This line is actually unreachable because handleApiError throws
  }
};

export { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJobById, 
  deleteJobById,
  getJobCountsByClient 
};