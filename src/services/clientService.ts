import axios from "axios";

interface ClientData extends FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

// Define an interface for the client response
export interface ClientResponse {
  _id: string;
  name: string;
  website?: string;
  industry: string;
  location: string;
  address?: string;
  incorporationDate?: string;
  countryOfRegistration: string;
  registrationNumber?: string;
  lineOfBusiness: string;
  countryOfBusiness: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  email?: string;
  profileImage?: string;
  crCopy?: string;
  vatCopy?: string;
  gstTinDocument?: string;
  clientStage: 'Lead' | 'Engaged' | 'Negotiation' | 'Signed' | 'Prospect';
  clientRm?: string;
  clientTeam?: 'Enterprise' | 'SMB' | 'Mid-Market';
  clientAge?: string;
  jobCount: number;
  createdAt: string;
}

const API_URL = "https://aems-backend.onrender.com/api";

const createClient = async (clientData: ClientData) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error creating client: ${errorMessage}`);
    }
    throw new Error(`Error creating client: ${error.message}`);
  }
};

const getClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error fetching clients: ${errorMessage}`);
    }
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

const getClientNames = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/clients/names`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error fetching clients: ${errorMessage}`);
    }
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await axios.get(`${API_URL}/clients/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error fetching client: ${errorMessage}`);
    }
    throw new Error(`Error fetching client: ${error.message}`);
  }
};

const updateClient = async (id: string, clientData: ClientData) => {
  try {
    const response = await axios.patch(`${API_URL}/clients/${id}`, clientData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
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
      const errorMessage = error.response.data?.message || 'Unknown error occurred';
      console.error('Server response:', error.response.data);
      throw new Error(`Error deleting client: ${errorMessage}`);
    }
    throw new Error(`Error deleting client: ${error.message}`);
  }
};

export { createClient, getClients,getClientNames, getClientById, updateClient, deleteClient };