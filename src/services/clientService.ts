import axios, { AxiosError } from "axios";

// Interface for Primary Contact
export interface PrimaryContact {
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
  position?: string;
  linkedin?: string;
}

// Interface for Client Response
export interface ClientResponse {
  _id: string;
  name: string;
  emails?: string[];
  phoneNumber?: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string | null;
  countryOfRegistration?: string;
  registrationNumber?: string;
  lineOfBusiness?: string[];
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  profileImage?: string | null;
  crCopy?: string | null;
  vatCopy?: string | null;
  gstTinDocument?: string | null;
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed" | "Prospect";
  clientRm?: string;
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  clientAge?: number;
  primaryContacts?: PrimaryContact[];
  jobCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
  message?: string;
  error?: string;
}

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

/**
 * Prepares the FormData for client creation/update, handling primaryContacts correctly.
 * @param data The raw client data including files and primary contacts.
 * @returns FormData object ready for submission.
 */
const prepareClientFormData = (data: {
  name: string;
  emails?: string[];
  phoneNumber?: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string | null;
  countryOfRegistration?: string;
  registrationNumber?: string;
  lineOfBusiness?: string[];
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  profileImage?: File | null;
  crCopy?: File | null;
  vatCopy?: File | null;
  gstTinDocument?: File | null;
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed" | "Prospect";
  clientRm?: string;
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  clientAge?: number;
  primaryContacts?: PrimaryContact[];
}): FormData => {
  const formData = new FormData();

  // Append all non-file fields
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof typeof data];

      // Skip primaryContacts - we'll handle it separately
      if (key === "primaryContacts") {
        continue;
      }
      // Handle File objects
      else if (value instanceof File && value.size > 0) {
        formData.append(key, value);
      }
      // Handle null values by appending empty string or skipping
      else if (value === null) {
        formData.append(key, "");
      }
      // Handle arrays (like emails, lineOfBusiness) by stringifying
      else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      }
      // Handle other primitive values
      else if (value !== undefined) {
        formData.append(key, String(value));
      }
    }
  }

  // Handle primaryContacts separately - append each contact as individual form fields
  if (data.primaryContacts && Array.isArray(data.primaryContacts)) {
    data.primaryContacts.forEach((contact, index) => {
      formData.append(`primaryContacts[${index}][name]`, contact.name || '');
      formData.append(`primaryContacts[${index}][email]`, contact.email || '');
      formData.append(`primaryContacts[${index}][phone]`, contact.phone || '');
      formData.append(`primaryContacts[${index}][countryCode]`, contact.countryCode || '');
      formData.append(`primaryContacts[${index}][position]`, contact.position || '');
      formData.append(`primaryContacts[${index}][linkedin]`, contact.linkedin || '');
    });
  }

  return formData;
};

/**
 * Alternative: Prepare JSON payload for non-file uploads.
 * Use this if the backend can accept JSON instead of FormData for non-file fields.
 */
const prepareClientJsonData = (data: {
  name: string;
  emails?: string[];
  phoneNumber?: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string | null;
  countryOfRegistration?: string;
  registrationNumber?: string;
  lineOfBusiness?: string[];
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed" | "Prospect";
  clientRm?: string;
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  clientAge?: number;
  primaryContacts?: PrimaryContact[];
}) => {
  return {
    ...data,
    // Ensure primaryContacts is an array of objects, not stringified
    primaryContacts: data.primaryContacts || [],
    // Convert null values to undefined or empty string as needed
    incorporationDate: data.incorporationDate || undefined,
    emails: data.emails || [],
    lineOfBusiness: data.lineOfBusiness || [], // Fixed to pass array directly
  };
};

// Extracted function for sending client requests
const sendClientRequest = async (url: string, method: "post" | "patch", rawData: any) => {
  const hasFiles = rawData.profileImage || rawData.crCopy || rawData.vatCopy || rawData.gstTinDocument;
  
  if (!hasFiles) {
    // No files - send as JSON
    const jsonData = prepareClientJsonData(rawData);
    console.log('Sending JSON data:', JSON.stringify(jsonData, null, 2));
    return axios({
      method,
      url,
      data: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    // Has files - send as FormData with proper primaryContacts handling
    const clientData = prepareClientFormData(rawData);
    console.log('Sending FormData with files');
    // Log FormData contents for debugging
    for (let pair of clientData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    return axios({
      method,
      url,
      data: clientData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

// Error handling function
const handleError = (error: AxiosError) => {
  const errorData = error.response?.data as any;
  const errorMessage = errorData?.message || error.message || "Unknown error occurred";
  console.error("Error:", errorData || error.message);
  return new Error(errorMessage);
};

// Create a new client
const createClient = async (rawData: Omit<ClientResponse, "_id" | "createdAt" | "updatedAt" | "jobCount" | "profileImage" | "crCopy" | "vatCopy" | "gstTinDocument"> & {
  profileImage?: File | null;
  crCopy?: File | null;
  vatCopy?: File | null;
  gstTinDocument?: File | null;
}): Promise<ClientResponse> => {
  try {
    const response = await sendClientRequest(`${API_URL}/clients`, "post", rawData);
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Get all clients with full details
const getClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get<ApiResponse<ClientResponse[]>>(`${API_URL}/clients`);
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Get client names with job counts
const getClientNames = async (): Promise<{ _id: string; name: string; jobCount: number }[]> => {
  try {
    const response = await axios.get<ApiResponse<{ _id: string; name: string; jobCount: number }[]>>(
      `${API_URL}/clients/names`
    );
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Get client by ID
const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await axios.get<ApiResponse<ClientResponse>>(`${API_URL}/clients/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Update client by ID
const updateClient = async (id: string, rawData: Omit<ClientResponse, "_id" | "createdAt" | "updatedAt" | "jobCount" | "profileImage" | "crCopy" | "vatCopy" | "gstTinDocument"> & {
  profileImage?: File | null;
  crCopy?: File | null;
  vatCopy?: File | null;
  gstTinDocument?: File | null;
}): Promise<ClientResponse> => {
  try {
    const response = await sendClientRequest(`${API_URL}/clients/${id}`, "patch", rawData);
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Delete client by ID
const deleteClient = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${API_URL}/clients/${id}`);
  } catch (error: any) {
    throw handleError(error);
  }
};

// Upload client file (crCopy, vatCopy, gstTinDocument, or profileImage)
const uploadClientFile = async (clientId: string, file: File, field: "crCopy" | "vatCopy" | "gstTinDocument" | "profileImage"): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post<ApiResponse<{ fileUrl: string }>>(
      `${API_URL}/clients/${clientId}/upload?field=${field}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.fileUrl;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Add primary contact to client
const addPrimaryContact = async (
  clientId: string,
  contactData: PrimaryContact
): Promise<ClientResponse> => {
  try {
    const response = await axios.post<ApiResponse<ClientResponse>>(
      `${API_URL}/clients/${clientId}/primary-contacts`,
      contactData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export {
  createClient,
  getClients,
  getClientNames,
  getClientById,
  updateClient,
  deleteClient,
  uploadClientFile,
  addPrimaryContact,
};