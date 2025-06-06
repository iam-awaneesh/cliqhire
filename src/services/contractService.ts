// import axios from "axios";

// interface ContractData extends FormData {
//   append(name: string, value: string | Blob, fileName?: string): void;
// }

// export interface ContractResponse {
//   _id: string;
//   clientId: string;
//   contractStartDate?: string | null;
//   contractEndDate?: string | null;
//   fixedPercentage: number;
//   fixWithAdvance?: number;
//   fixWithoutAdvance?: number;
//   variablePercentage: {
//     seniorLevel?: number;
//     executives?: number;
//     nonExecutives?: number;
//     other?: number;
//   };
//   agreement?: {
//     fileName: string;
//     filePath: string;
//     fileType: string;
//     fileSize: number;
//   } | null;
//   referralPercentage: number;
//   lineOfBusiness?: string;
//   createdBy?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// const createContract = async (contractData: ContractData) => {
//   try {
//     const response = await api.post("/contracts", contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error creating contract");
//   }
// };

// const updateContract = async (id: string, contractData: ContractData) => {
//   try {
//     const response = await api.patch(`/contracts/${id}`, contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error updating contract");
//   }
// };

// const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
//   try {
//     const response = await api.get(`/contracts/client/${clientId}`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error fetching contract");
//   }
// };

// const downloadAgreement = async (contractId: string): Promise<Blob> => {
//   try {
//     const response = await api.get(`/contracts/${contractId}/agreement/download`, {
//       responseType: 'blob',
//     });
//     return response.data;
//   } catch (error: any) {
//     throw handleError(error, "Error downloading agreement");
//   }
// };

// const deleteAgreement = async (contractId: string) => {
//   try {
//     const response = await api.delete(`/contracts/${contractId}/agreement`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error deleting agreement");
//   }
// };

// const handleError = (error: any, message: string) => {
//   if (error.response) {
//     const errorMessage = error.response.data?.error || "Unknown error occurred";
//     console.error("Server response:", error.response.data);
//     return new Error(`${message}: ${errorMessage}`);
//   }
//   console.error("Unexpected error:", error.message);
//   return new Error(`${message}: ${error.message}`);
// };

// export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };

// import axios from "axios";

// interface ContractData extends FormData {
//   append(name: string, value: string | Blob, fileName?: string): void;
// }

// export interface ContractResponse {
//   _id: string;
//   clientId: string;
//   contractStartDate?: string | null;
//   contractEndDate?: string | null;
//   contractType?: "Fixed Percentage" | "Fix with Advance" | "Fix without Advance" | "Level Based (Hiring)" | null;
//   levelBasedDetails?: {
//     seniorLevel?: { percentage: number; notes: string };
//     executives?: { percentage: number; notes: string };
//     nonExecutives?: { percentage: number; notes: string };
//     other?: { percentage: number; notes: string };
//   } | null;
//   agreement?: {
//     fileName: string;
//     filePath: string;
//     fileType: string;
//     fileSize: number;
//   } | null;
//   referralPercentage: number;
//   notes?: string;
//   lineOfBusiness?: string;
//   createdBy?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// const createContract = async (contractData: ContractData) => {
//   try {
//     const response = await api.post("/contracts", contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error creating contract");
//   }
// };

// const updateContract = async (id: string, contractData: ContractData) => {
//   try {
//     const response = await api.patch(`/contracts/${id}`, contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error updating contract");
//   }
// };

// const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
//   try {
//     const response = await api.get(`/contracts/client/${clientId}`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error fetching contract");
//   }
// };

// const downloadAgreement = async (contractId: string): Promise<Blob> => {
//   try {
//     const response = await api.get(`/contracts/${contractId}/agreement/download`, {
//       responseType: 'blob',
//     });
//     return response.data;
//   } catch (error: any) {
//     throw handleError(error, "Error downloading agreement");
//   }
// };

// const deleteAgreement = async (contractId: string) => {
//   try {
//     const response = await api.delete(`/contracts/${contractId}/agreement`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error deleting agreement");
//   }
// };

// const handleError = (error: any, message: string) => {
//   if (error.response) {
//     const errorMessage = error.response.data?.error || "Unknown error occurred";
//     console.error("Server response:", error.response.data);
//     return new Error(`${message}: ${errorMessage}`);
//   }
//   console.error("Unexpected error:", error.message);
//   return new Error(`${message}: ${error.message}`);
// };

// export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };


// import axios from "axios";

// interface ContractData extends FormData {
//   append(name: string, value: string | Blob, fileName?: string): void;
// }

// export interface ContractResponse {
//   _id: string;
//   clientId: string;
//   contractStartDate?: string | null;
//   contractEndDate?: string | null;
//   contractType?: "Fixed Percentage" | "Fix with Advance" | "Fix without Advance" | "Level Based (Hiring)" | null;
//   levelBasedDetails?: {
//     seniorLevel?: { percentage: number; notes: string };
//     executives?: { percentage: number; notes: string };
//     nonExecutives?: { percentage: number; notes: string };
//     other?: { percentage: number; notes: string };
//   } | null;
//   agreement?: {
//     fileName: string;
//     filePath: string;
//     fileType: string;
//     fileSize: number;
//   } | null;
//   referralPercentage: number;
//   notes?: string;
//   lineOfBusiness?: string;
//   createdBy?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// const createContract = async (contractData: ContractData) => {
//   try {
//     const response = await api.post("/clients", contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error creating contract");
//   }
// };

// const updateContract = async (id: string, contractData: ContractData) => {
//   try {
//     if (!id) {
//       throw new Error("Contract ID is undefined or invalid");
//     }
//     // Log the request details for debugging
//     console.log("Updating contract with ID:", id, "Data:", Object.fromEntries(contractData));
//     const response = await api.patch(`/clients/${id}`, contractData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Update successful, response:", response.data);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, `Error updating contract with ID ${id}`);
//   }
// };

// const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
//   try {
//     const response = await api.get(`/clients/${clientId}`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error fetching contract");
//   }
// };

// const downloadAgreement = async (contractId: string): Promise<Blob> => {
//   try {
//     const response = await api.get(`/clients/${contractId}/agreement/download`, {
//       responseType: 'blob',
//     });
//     return response.data;
//   } catch (error: any) {
//     throw handleError(error, "Error downloading agreement");
//   }
// };

// const deleteAgreement = async (contractId: string) => {
//   try {
//     const response = await api.delete(`/clients/${contractId}/agreement`);
//     return response.data.data as ContractResponse;
//   } catch (error: any) {
//     throw handleError(error, "Error deleting agreement");
//   }
// };

// const handleError = (error: any, message: string) => {
//   if (error.response) {
//     const errorMessage = error.response.data?.error || error.response.data?.message || "Unknown error occurred";
//     console.error("Server response:", {
//       status: error.response.status,
//       statusText: error.response.statusText,
//       data: error.response.data,
//     });
//     return new Error(`${message}: ${errorMessage}`);
//   }
//   console.error("Unexpected error:", error.message);
//   return new Error(`${message}: ${error.message}`);
// };

// export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };

import axios from "axios";

interface ContractData extends FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

export interface ContractResponse {
  _id: string;
  clientId: string;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  contractType?: "Fixed Percentage" | "Fix with Advance" | "Fix without Advance" | "Level Based (Hiring)" | null;
  levelBasedDetails?: {
    seniorLevel?: { percentage: number; notes: string };
    executives?: { percentage: number; notes: string };
    nonExecutives?: { percentage: number; notes: string };
    other?: { percentage: number; notes: string };
  } | null;
  agreement?: {
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
  } | null;
  referralPercentage: number;
  notes?: string;
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
    const response = await api.post("/clients", contractData, {
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
    if (!id) {
      throw new Error("Contract ID is undefined or invalid");
    }
    // Log the request details for debugging
    console.log("Sending PATCH request to:", `${API_URL}/clients/${id}`);
    console.log("FormData payload:", Object.fromEntries(contractData));
    const response = await api.patch(`/clients/${id}`, contractData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Add Accept header to ensure JSON response
        "Accept": "application/json",
      },
    });
    console.log("PATCH request successful, response:", response.data);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, `Error updating contract with ID ${id}`);
  }
};

const getContractByClient = async (clientId: string): Promise<ContractResponse> => {
  try {
    const response = await api.get(`/clients/${clientId}`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error fetching contract");
  }
};

const downloadAgreement = async (contractId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/clients/${contractId}/agreement/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error, "Error downloading agreement");
  }
};

const deleteAgreement = async (contractId: string) => {
  try {
    const response = await api.delete(`/clients/${contractId}/agreement`);
    return response.data.data as ContractResponse;
  } catch (error: any) {
    throw handleError(error, "Error deleting agreement");
  }
};

const handleError = (error: any, message: string) => {
  if (error.response) {
    const errorMessage = error.response.data?.error || error.response.data?.message || "Unknown error occurred";
    console.error("Server response:", {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    });
    return new Error(`${message}: ${errorMessage}`);
  }
  console.error("Unexpected error:", error.message);
  return new Error(`${message}: ${error.message}`);
};

export { createContract, updateContract, getContractByClient, downloadAgreement, deleteAgreement };