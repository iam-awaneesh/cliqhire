import axios from "axios";

interface ContractData extends FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

export interface ContractResponse {
  _id: string;
  clientId: string;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  fixedPercentage: number;
  fixWithAdvance?: number;
  fixWithoutAdvance?: number;
  variablePercentage: {
    seniorLevel?: number;
    executives?: number;
    nonExecutives?: number;
    other?: number;
  };
  agreement?: {
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
  } | null;
  referralPercentage: number;
  lineOfBusiness?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

const createContract = async (contractData: ContractData) => {
  try {
    const response = await api.post("/contracts", contractData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error creating contract");
  }
};

const updateContract = async (id: string, contractData: ContractData) => {
  try {
    const response = await api.patch(`/contracts/${id}`, contractData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error updating contract");
  }
};

const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
  try {
    const response = await api.get(`/contracts/client/${clientId}`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error fetching contract");
  }
};

const downloadAgreement = async (contractId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/contracts/${contractId}/agreement/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error, "Error downloading agreement");
  }
};

const deleteAgreement = async (contractId: string) => {
  try {
    const response = await api.delete(`/contracts/${contractId}/agreement`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error deleting agreement");
  }
};

const handleError = (error: any, message: string) => {
  if (error.response) {
    const errorMessage = error.response.data?.error || "Unknown error occurred";
    console.error("Server response:", error.response.data);
    return new Error(`${message}: ${errorMessage}`);
  }
  console.error("Unexpected error:", error.message);
  return new Error(`${message}: ${error.message}`);
};

export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };