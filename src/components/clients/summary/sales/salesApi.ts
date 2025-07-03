import axios from "axios";

// Replace with your real API endpoint
const BASE_URL = "https://example/api";

export interface SalesInfo {
  financials: string;
  nonFinancials: string;
  numberOfEmployees: string;
  formationYear: string;
}

// Fetch sales info from backend
export async function getSalesInfo(): Promise<SalesInfo> {
  // Dummy data for development. Remove this and uncomment the axios call when using a real API.
  return {
    financials: "50000",
    nonFinancials: "Demo non-financial info",
    numberOfEmployees: "25",
    formationYear: "2015",
  };
  /*
  // Example: GET https://example/api/get.com
  const response = await axios.get(`${BASE_URL}/get.com`); // <-- Replace with your GET endpoint
  return response.data;
  */
}

// Update all sales info in backend
export async function updateSalesInfo(data: SalesInfo): Promise<void> {
  // Example: PUT https://example/api/update.com
  await axios.put(`${BASE_URL}/update.com`, data); // <-- Replace with your PUT endpoint
}

// Update a single field in sales info (partial update)
export async function patchSalesInfoField(field: keyof SalesInfo, value: string): Promise<void> {
  // Example: PATCH https://example/api/patch.com
  // Sends { field: value } as the body
  await axios.patch(`${BASE_URL}/patch.com`, { [field]: value }); // <-- Replace with your PATCH endpoint
}
