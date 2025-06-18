// src/components/create-client-modal/api.ts
import axios from "axios";

// API call to create client
export const createClient = async (data: FormData) => {
  try {
    const response = await axios.post(
      "https://aems-backend.onrender.com/api/clients",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to create client");
  }
};
