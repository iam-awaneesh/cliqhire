import axios from "axios";

export const createClient = async (data: FormData) => {
  console.log(data)
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