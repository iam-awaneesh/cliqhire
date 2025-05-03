import axios from "axios";

interface ClientData extends FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

export interface ClientResponse {
  _id: string;
  name: string;
  website?: string;
  industry: string;
  location: string;
  address?: string;
  incorporationDate?: string | null;
  countryOfRegistration: string;
  registrationNumber?: string;
  lineOfBusiness: string;
  countryOfBusiness: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  email?: string;
  profileImage?: string | null;
  crCopy?: string | null;
  vatCopy?: string | null;
  gstTinDocument?: string | null;
  clientStage: "Lead" | "Engaged" | "Negotiation" | "Signed" | "Prospect";
  clientRm?: string;
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  jobCount: number;
  createdAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: ClientResponse[];
}

// Use environment variable for API URL, default to production
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

const createClient = async (clientData: ClientData) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, clientData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response:", error.response.data);
      throw new Error(`Error creating client: ${errorMessage}`);
    }
    throw new Error(`Error creating client: ${error.message}`);
  }
};

const getClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    const result: ApiResponse = response.data;
    return result.data; // Return the 'data' array
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response:", error.response.data);
      throw new Error(`Error fetching clients: ${errorMessage}`);
    }
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

const getClientNames = async (): Promise<ClientResponse[]> => {
  try {
    console.log("Fetching clients from:", `${API_URL}/clients/names`);
    const response = await axios.get(`${API_URL}/clients/names`);
    console.log("getClientNames raw response:", response);
    console.log("getClientNames response data:", response.data);

    // Handle both direct array and wrapped response
    const clientData = response.data.data || response.data;
    if (!Array.isArray(clientData)) {
      console.error("Unexpected response format, expected array, got:", clientData);
      return [];
    }

    console.log("Processed client data:", clientData);
    return clientData;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response error:", error.response.status, error.response.data);
      throw new Error(`Error fetching clients: ${errorMessage}`);
    }
    console.error("Network or other error:", error.message);
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await axios.get(`${API_URL}/clients/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response:", error.response.data);
      throw new Error(`Error fetching client: ${errorMessage}`);
    }
    throw new Error(`Error fetching client: ${error.message}`);
  }
};

const updateClient = async (id: string, clientData: ClientData) => {
  try {
    const response = await axios.patch(`${API_URL}/clients/${id}`, clientData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response:", error.response.data);
      throw new Error(`Error updating client: ${errorMessage}`);
    }
    throw new Error(`Error updating client: ${error.message}`);
  }
};

const deleteClient = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/clients/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Unknown error occurred";
      console.error("Server response:", error.response.data);
      throw new Error(`Error deleting client: ${errorMessage}`);
    }
    throw new Error(`Error deleting client: ${error.message}`);
  }
};

export { createClient, getClients, getClientNames, getClientById, updateClient, deleteClient };